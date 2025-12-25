"""
Lightweight RAG Engine for E-commerce Chatbot
Uses simple keyword matching instead of embeddings to avoid memory issues on free tier
"""

from typing import List, Dict
from .models import KnowledgeBase
from django.db.models import Q
import re


class RAGEngineLite:
    """
    Lightweight RAG engine that uses keyword matching instead of embeddings.
    Perfect for memory-constrained environments like Render free tier.
    """
    
    def __init__(self):
        """Initialize lightweight RAG engine"""
        pass
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Dummy method for compatibility - returns None
        In lite version, we don't generate embeddings
        """
        return None
    
    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract meaningful keywords from text for searching
        
        Args:
            text: Input text
            
        Returns:
            List of keywords
        """
        # Convert to lowercase and split
        text = text.lower()
        
        # Remove punctuation and split into words
        words = re.findall(r'\b\w+\b', text)
        
        # Common stop words to ignore
        stop_words = {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'you', 'your', 'i', 'me', 'my',
            'we', 'can', 'do', 'have', 'what', 'which', 'who', 'how', 'when'
        }
        
        # Filter out stop words and short words
        keywords = [w for w in words if w not in stop_words and len(w) > 2]
        
        return keywords
    
    def retrieve_context(self, query: str, top_k: int = 8, threshold: float = 0.0) -> List[Dict]:
        """
        Retrieve relevant context using keyword matching
        
        Args:
            query: User's question
            top_k: Number of results to return
            threshold: Ignored in lite version
            
        Returns:
            List of relevant knowledge base entries
        """
        # Extract keywords from query
        keywords = self.extract_keywords(query)
        
        if not keywords:
            # If no keywords, return some general entries
            return list(KnowledgeBase.objects.all()[:top_k].values(
                'id', 'content', 'source_type', 'metadata'
            ))
        
        # Build query using OR for each keyword
        q_objects = Q()
        for keyword in keywords:
            q_objects |= Q(content__icontains=keyword)
        
        # Search in knowledge base
        results = KnowledgeBase.objects.filter(q_objects).distinct()[:top_k]
        
        # If we didn't find enough results, also try searching in metadata
        if results.count() < top_k // 2:
            meta_results = KnowledgeBase.objects.filter(
                metadata__icontains=keywords[0] if keywords else ""
            ).exclude(id__in=[r.id for r in results])[:top_k - results.count()]
            
            results = list(results) + list(meta_results)
        
        # Convert to dict format
        context_entries = []
        for entry in results:
            context_entries.append({
                'id': entry.id,
                'content': entry.content,
                'source_type': entry.source_type,
                'metadata': entry.metadata,
                'similarity': 1.0  # Dummy similarity for compatibility
            })
        
        return context_entries
    
    def format_context_for_llm(self, context_entries: List[Dict]) -> str:
        """
        Format retrieved context for LLM consumption
        
        Args:
            context_entries: List of context entries
            
        Returns:
            Formatted context string
        """
        if not context_entries:
            return "No specific product information available. Please provide general assistance."
        
        formatted = []
        for i, entry in enumerate(context_entries, 1):
            content = entry['content']
            source = entry.get('source_type', 'unknown')
            
            formatted.append(f"{i}. [{source.upper()}]\n{content}\n")
        
        return "\n".join(formatted)
