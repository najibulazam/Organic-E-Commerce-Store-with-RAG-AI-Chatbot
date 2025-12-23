"""
RAG (Retrieval-Augmented Generation) Engine for E-commerce Chatbot
Uses sentence-transformers for embeddings and cosine similarity for retrieval
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Tuple
from .models import KnowledgeBase


class RAGEngine:
    """
    RAG engine that handles:
    - Text embedding generation
    - Similarity search
    - Context retrieval for LLM
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize RAG engine with embedding model
        
        Args:
            model_name: Sentence transformer model name (lightweight by default)
        """
        self.model = SentenceTransformer(model_name)
        self.dimension = 384  # all-MiniLM-L6-v2 produces 384-dim embeddings
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector for text
        
        Args:
            text: Input text to embed
            
        Returns:
            List of floats representing the embedding
        """
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    
    def cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vectors
        
        Args:
            vec1: First vector
            vec2: Second vector
            
        Returns:
            Similarity score (0-1)
        """
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def retrieve_context(self, query: str, top_k: int = 5, threshold: float = 0.3) -> List[Dict]:
        """
        Retrieve relevant context from knowledge base using semantic search
        
        Args:
            query: User's question
            top_k: Number of top results to return
            threshold: Minimum similarity threshold
            
        Returns:
            List of relevant knowledge base entries with similarity scores
        """
        # Generate query embedding
        query_embedding = np.array(self.generate_embedding(query))
        
        # Get all knowledge base entries
        knowledge_entries = KnowledgeBase.objects.exclude(embedding__isnull=True)
        
        if not knowledge_entries.exists():
            return []
        
        # Calculate similarities
        similarities = []
        for entry in knowledge_entries:
            if entry.embedding:
                entry_embedding = np.array(entry.embedding)
                similarity = self.cosine_similarity(query_embedding, entry_embedding)
                
                if similarity >= threshold:
                    similarities.append({
                        'content': entry.content,
                        'content_type': entry.content_type,
                        'metadata': entry.metadata,
                        'similarity': float(similarity)
                    })
        
        # Sort by similarity and return top_k
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        return similarities[:top_k]
    
    def format_context_for_llm(self, context_entries: List[Dict]) -> str:
        """
        Format retrieved context for LLM prompt
        
        Args:
            context_entries: List of relevant context entries
            
        Returns:
            Formatted context string
        """
        if not context_entries:
            return "No relevant information found in the knowledge base."
        
        formatted = "Relevant Information:\n\n"
        
        for i, entry in enumerate(context_entries, 1):
            formatted += f"{i}. [{entry['content_type'].upper()}] {entry['content']}\n"
            
            # Add metadata details for products
            if entry['content_type'] == 'product' and entry['metadata']:
                meta = entry['metadata']
                if 'price' in meta:
                    formatted += f"   💰 Price: ${meta['price']}\n"
                if 'stock' in meta:
                    formatted += f"   📦 Stock: {meta['stock']} units\n"
                if 'rating' in meta:
                    formatted += f"   ⭐ Rating: {meta['rating']}/5.0\n"
            
            # For categories, fetch and display actual products with prices
            elif entry['content_type'] == 'category' and entry['metadata']:
                category_id = entry['metadata'].get('category_id')
                if category_id:
                    # Get products in this category from KB
                    from .models import KnowledgeBase
                    category_products = KnowledgeBase.objects.filter(
                        content_type='product',
                        metadata__category=entry['metadata'].get('category_name')
                    )[:5]  # Limit to 5 products
                    
                    if category_products:
                        formatted += "   Products in this category:\n"
                        for prod in category_products:
                            prod_meta = prod.metadata
                            formatted += f"   • {prod_meta.get('product_name')} - ${prod_meta.get('price')} "
                            formatted += f"({prod_meta.get('stock')} in stock, ⭐{prod_meta.get('rating')})\n"
            
            formatted += f"   (Relevance: {entry['similarity']:.2f})\n\n"
        
        return formatted
