"""
Chatbot Service - Main logic for handling chat interactions
Uses RAG for context and provides intelligent responses
"""

import uuid
from typing import Dict, List, Optional
from django.utils import timezone
from .models import ChatConversation, ChatMessage
from .rag_engine import RAGEngine


class ChatbotService:
    """
    Main chatbot service that:
    - Manages conversations
    - Uses RAG for context retrieval
    - Generates responses
    """
    
    def __init__(self):
        self.rag_engine = RAGEngine()
        
        # System prompt for the chatbot
        self.system_prompt = """You are a knowledgeable e-commerce assistant for an organic products store.

Your role:
- Help customers find products that match their needs
- Answer questions about products using the Product Information provided
- Make confident recommendations based on the context
- Provide specific product names, prices, and details

Important rules:
1. ALWAYS use the Product Information section - it contains accurate, up-to-date product details
2. When products are listed in the context, confidently recommend them with specific details
3. For health-related queries (headache, immunity, diet):
   - Recommend relevant products from the context
   - Mention specific benefits (e.g., "Green tea has antioxidants", "Tofu is high in protein")
   - Include prices and stock information
4. For dietary needs (vegan, gluten-free):
   - List ALL relevant products from the context
   - Be specific: "We have X, Y, and Z for vegan protein"
5. Format responses clearly:
   - Use **bold** for product names
   - Include prices (e.g., $4.99)
   - Mention stock availability when relevant
6. If a product category is mentioned, list the specific products within it
7. Be helpful and specific - don't say "I don't have information" if products are in the context

Example good response:
"For vegan protein, we have several excellent options:
- **Organic Tofu** - $4.99 (100 units in stock) - High protein, versatile
- **Organic Mixed Nuts** - $8.99 - Great protein and healthy fats"

Never say you don't have information if relevant products appear in the Product Information section."""
    
    def get_or_create_conversation(self, session_id: Optional[str] = None, user=None) -> ChatConversation:
        """
        Get existing conversation or create new one
        
        Args:
            session_id: Optional session ID
            user: Optional user object
            
        Returns:
            ChatConversation object
        """
        if session_id:
            try:
                conversation = ChatConversation.objects.get(session_id=session_id)
                return conversation
            except ChatConversation.DoesNotExist:
                pass
        
        # Create new conversation
        session_id = session_id or str(uuid.uuid4())
        conversation = ChatConversation.objects.create(
            session_id=session_id,
            user=user
        )
        return conversation
    
    def add_message(self, conversation: ChatConversation, role: str, content: str) -> ChatMessage:
        """
        Add message to conversation
        
        Args:
            conversation: ChatConversation object
            role: 'user' or 'assistant'
            content: Message content
            
        Returns:
            ChatMessage object
        """
        message = ChatMessage.objects.create(
            conversation=conversation,
            role=role,
            content=content
        )
        return message
    
    def generate_response(self, user_message: str, conversation: ChatConversation) -> str:
        """
        Generate chatbot response using RAG
        
        Args:
            user_message: User's message
            conversation: ChatConversation object
            
        Returns:
            Chatbot's response
        """
        # Retrieve relevant context using RAG with lower threshold for better recall
        context_entries = self.rag_engine.retrieve_context(user_message, top_k=8, threshold=0.20)
        formatted_context = self.rag_engine.format_context_for_llm(context_entries)
        
        # Get conversation history for context
        recent_messages = conversation.messages.all()[:10]  # Last 10 messages
        conversation_history = "\n".join([
            f"{msg.role.capitalize()}: {msg.content}"
            for msg in reversed(list(recent_messages))
        ])
        
        # Build prompt
        prompt = self._build_prompt(user_message, formatted_context, conversation_history)
        
        # Generate response using LLM
        response = self._call_llm(prompt)
        
        return response
    
    def _build_prompt(self, user_message: str, context: str, history: str = "") -> str:
        """
        Build complete prompt for LLM
        
        Args:
            user_message: Current user message
            context: Retrieved context from RAG
            history: Conversation history
            
        Returns:
            Complete prompt string
        """
        prompt = f"""{self.system_prompt}

--- Product Information ---
{context}
--- End Product Information ---

"""
        
        if history:
            prompt += f"--- Recent Conversation ---\n{history}\n--- End Conversation ---\n\n"
        
        prompt += f"Customer Question: {user_message}\n\nYour Response:"
        
        return prompt
    
    def _call_llm(self, prompt: str) -> str:
        """
        Call LLM to generate response
        
        Uses Groq API for fast, reliable responses with fallback
        
        Args:
            prompt: Complete prompt
            
        Returns:
            Generated response
        """
        try:
            # Try using Groq API (fast and free)
            return self._call_groq_api(prompt)
        except Exception as e:
            # Fallback to rule-based response
            print(f"LLM API error: {e}")
            return self._generate_fallback_response(prompt)
    
    def _call_groq_api(self, prompt: str) -> str:
        """
        Call Groq API for fast LLM inference
        
        Args:
            prompt: Complete prompt
            
        Returns:
            Generated response
        """
        from groq import Groq
        import os
        
        # Initialize Groq client
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            raise Exception("GROQ_API_KEY not set in environment")
        
        client = Groq(api_key=api_key)
        
        # Extract system prompt and user message
        if "Customer Question:" in prompt:
            parts = prompt.split("Customer Question:")
            system_context = parts[0].strip()
            user_part = parts[1].replace("Your Response:", "").strip()
        else:
            system_context = self.system_prompt
            user_part = prompt
        
        # Call Groq with llama model (fast and accurate)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_context
                },
                {
                    "role": "user",
                    "content": user_part
                }
            ],
            model="llama-3.3-70b-versatile",  # Updated to current supported model
            temperature=0.5,  # Lower temperature for more focused responses
            max_tokens=500,   # Allow longer responses
            top_p=0.9,
        )
        
        return chat_completion.choices[0].message.content.strip()
    
    def _generate_fallback_response(self, prompt: str) -> str:
        """
        Generate intelligent response using RAG context when LLM is unavailable
        
        Args:
            prompt: Complete prompt with RAG context
            
        Returns:
            Context-aware response
        """
        # Extract context from prompt
        user_question = ""
        if "User Question:" in prompt:
            user_question = prompt.split("User Question:")[1].split("\n")[0].strip().lower()
        
        # Extract and parse relevant information from prompt
        relevant_info = []
        products = []
        
        if "Relevant Information:" in prompt:
            context_section = prompt.split("Relevant Information:")[1].split("User Question:")[0]
            
            # Parse product entries more carefully
            lines = context_section.split('\n')
            current_product = {}
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('(Relevance:'):
                    if current_product and 'name' in current_product:
                        products.append(current_product)
                        current_product = {}
                    continue
                    
                # Remove numbering like "1. [PRODUCT]"
                if line[0].isdigit() and '. [' in line:
                    line = line.split('] ', 1)[-1] if '] ' in line else line
                
                # Parse product fields
                if line.startswith('Product:'):
                    current_product['name'] = line.replace('Product:', '').strip()
                elif line.startswith('Category:'):
                    current_product['category'] = line.replace('Category:', '').strip()
                elif line.startswith('Description:'):
                    current_product['description'] = line.replace('Description:', '').strip()
                elif line.startswith('Price:'):
                    current_product['price'] = line.replace('Price:', '').strip()
                elif line.startswith('Stock:'):
                    current_product['stock'] = line.replace('Stock:', '').strip()
                elif line.startswith('Rating:'):
                    current_product['rating'] = line.replace('Rating:', '').strip()
            
            # Add last product
            if current_product and 'name' in current_product:
                products.append(current_product)
        
        has_context = len(products) > 0
        
        # Generate intelligent response using parsed products
        if has_context and products:
            response_parts = []
            
            # Check question type for appropriate intro
            if any(word in user_question for word in ['pain', 'relief', 'health', 'wellness', 'help', 'hurt']):
                response_parts.append("For pain relief and wellness, here are some organic products that may help:\n")
            elif any(word in user_question for word in ['breakfast', 'morning', 'eat']):
                response_parts.append("Great choices for a healthy organic breakfast:\n")
            elif any(word in user_question for word in ['honey', 'benefit', 'good', 'about']):
                response_parts.append("Here's what I can tell you about our organic honey:\n")
            else:
                response_parts.append("Based on your query, here are some organic products I recommend:\n")
            
            # Format each product nicely
            for i, product in enumerate(products[:3], 1):
                response_parts.append(f"\n{i}. **{product.get('name', 'Unknown Product')}**")
                
                if 'description' in product:
                    response_parts.append(f"   {product['description']}")
                
                details = []
                if 'price' in product:
                    details.append(f"Price: {product['price']}")
                if 'stock' in product:
                    details.append(f"Stock: {product['stock']}")
                if 'rating' in product:
                    details.append(f"Rating: {product['rating']}")
                
                if details:
                    response_parts.append(f"   {' • '.join(details)}")
            
            # Add contextual closing
            if any(word in user_question for word in ['pain', 'relief', 'health', 'wellness']):
                response_parts.append("\n✨ All products are certified organic and may support your wellness needs. Would you like to know more about any of them?")
            elif any(word in user_question for word in ['honey', 'benefit', 'good']):
                response_parts.append("\n✨ Our organic honey is pure, raw, and packed with natural antioxidants and enzymes. Great for boosting immunity and soothing throats!")
            else:
                response_parts.append("\n✨ All products are certified organic and in stock. Free shipping on orders over $50!")
            
            return "\n".join(response_parts)
        
        # Extract conversation history context
        recent_context = ""
        if "Conversation History:" in prompt:
            history_section = prompt.split("Conversation History:")[1].split("User Question:")[0]
            recent_context = history_section.lower()
        
        # Fallback for common questions - check history for context
        if any(word in user_question for word in ['pain', 'relief', 'hurt', 'ache', 'sore']):
            return "For pain relief, I recommend checking our organic wellness products like turmeric (anti-inflammatory), ginger tea, honey, or omega-3 supplements. Would you like me to search for specific products in these categories?"
        
        elif any(word in user_question for word in ['price', 'cost', 'expensive', 'cheap']):
            return "I'd be happy to help you with pricing information. Could you specify which product you're interested in?"
        
        elif any(word in user_question for word in ['stock', 'available', 'availability', 'in stock']):
            return "I can check stock availability for you. Which product are you interested in?"
        
        elif any(word in user_question for word in ['recommend', 'suggest', 'best', 'good']):
            # Check if previous message mentioned pain/health
            if any(word in recent_context for word in ['pain', 'relief', 'health', 'wellness', 'hurt']):
                return "For pain relief and wellness, I recommend our organic turmeric supplements, ginger tea, raw honey, or omega-3 fish oil. These products have natural anti-inflammatory properties. Would you like details on any of these?"
            return "I'd love to recommend some organic products! What are you looking for? For example: healthy snacks, breakfast items, wellness products, etc."
        
        elif any(word in user_question for word in ['shipping', 'delivery', 'deliver', 'ship']):
            return "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping on orders over $50! Shipping costs are calculated at checkout based on your location."
        
        elif any(word in user_question for word in ['return', 'refund', 'exchange']):
            return "We have a 30-day return policy. If you're not satisfied with your purchase, you can return unused items in original packaging for a full refund or exchange. Return shipping is free for defective items."
        
        elif any(word in user_question for word in ['payment', 'pay', 'credit card', 'paypal']):
            return "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through encrypted connections."
        
        elif any(word in user_question for word in ['order', 'track', 'tracking', 'status']):
            return "You can track your order using the tracking number sent to your email after shipment. Orders typically ship within 1-2 business days. If you have questions about a specific order, please contact our support team."
        
        elif any(word in user_question for word in ['organic', 'natural', 'certified']):
            return "All our products are certified organic and sourced from trusted suppliers. We prioritize natural, eco-friendly, and sustainable products. Look for the organic certification details on each product page."
        
        else:
            return "I'd be happy to help! I can assist you with:\n• Product recommendations\n• Pricing and stock information\n• Shipping and delivery\n• Returns and refunds\n• Organic product information\n\nWhat would you like to know?"
    
    def handle_chat_message(self, message: str, session_id: Optional[str] = None, user=None) -> Dict:
        """
        Main method to handle incoming chat message
        
        Args:
            message: User's message
            session_id: Optional session ID
            user: Optional user object
            
        Returns:
            Dict with response and session info
        """
        # Get or create conversation
        conversation = self.get_or_create_conversation(session_id, user)
        
        # Add user message
        self.add_message(conversation, 'user', message)
        
        # Generate response
        response = self.generate_response(message, conversation)
        
        # Add assistant message
        self.add_message(conversation, 'assistant', response)
        
        return {
            'response': response,
            'session_id': conversation.session_id,
            'conversation_id': conversation.id
        }
