from django.urls import path
from .views import ChatView, ConversationHistoryView, ChatHealthView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('conversation/<str:session_id>/', ConversationHistoryView.as_view(), name='conversation-history'),
    path('health/', ChatHealthView.as_view(), name='chat-health'),
]
