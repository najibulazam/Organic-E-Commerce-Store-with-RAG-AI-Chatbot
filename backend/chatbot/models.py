from django.db import models
from django.contrib.auth.models import User


class ChatConversation(models.Model):
    """Store chat conversation sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='chat_conversations')
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Chat {self.session_id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ChatMessage(models.Model):
    """Store individual chat messages"""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]
    
    conversation = models.ForeignKey(ChatConversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."


class KnowledgeBase(models.Model):
    """Store knowledge base entries for RAG"""
    TYPE_CHOICES = [
        ('product', 'Product'),
        ('category', 'Category'),
        ('faq', 'FAQ'),
    ]
    
    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict)  # Store product ID, category, etc.
    embedding = models.JSONField(null=True, blank=True)  # Store embedding vector
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.content_type}: {self.content[:50]}..."
