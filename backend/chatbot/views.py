from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import ChatRequestSerializer, ChatConversationSerializer, ChatMessageSerializer
from .chatbot_service import ChatbotService
from .models import ChatConversation, ChatMessage


@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    """
    Main chat endpoint
    POST: Send message and get response
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Handle chat message
        
        Request body:
        {
            "message": "What organic products do you have?",
            "session_id": "optional-session-id"
        }
        """
        serializer = ChatRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Log the validation errors for debugging
            print(f"Validation errors: {serializer.errors}")
            print(f"Request data: {request.data}")
            return Response(
                {'error': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')
        
        # Get user if authenticated
        user = request.user if request.user.is_authenticated else None
        
        # Process message using chatbot service
        chatbot = ChatbotService()
        result = chatbot.handle_chat_message(message, session_id, user)
        
        return Response({
            'response': result['response'],
            'session_id': result['session_id'],
            'conversation_id': result['conversation_id']
        }, status=status.HTTP_200_OK)


class ConversationHistoryView(APIView):
    """
    Get conversation history
    GET: Retrieve messages for a conversation
    """
    permission_classes = [AllowAny]
    
    def get(self, request, session_id):
        """
        Get conversation history by session ID
        """
        try:
            conversation = ChatConversation.objects.get(session_id=session_id)
            serializer = ChatConversationSerializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatConversation.DoesNotExist:
            return Response(
                {'error': 'Conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ChatHealthView(APIView):
    """
    Health check endpoint for chatbot
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Check if chatbot is ready
        """
        from .models import KnowledgeBase
        
        # Check if knowledge base is populated
        kb_count = KnowledgeBase.objects.count()
        kb_with_embeddings = KnowledgeBase.objects.exclude(embedding__isnull=True).count()
        
        return Response({
            'status': 'healthy',
            'knowledge_base_entries': kb_count,
            'entries_with_embeddings': kb_with_embeddings,
            'ready': kb_with_embeddings > 0
        }, status=status.HTTP_200_OK)
