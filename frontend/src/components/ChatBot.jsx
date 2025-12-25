import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize session with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "👋 Hi! I'm your organic store assistant. I can help you with:\n\n• Product information (prices, stock, ratings)\n• Product recommendations\n• Shipping and delivery questions\n• Returns and refunds\n• Order tracking\n• Payment options\n\nWhat can I help you with today?",
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: "⚠️ **Note**: The AI chatbot may not work on the live demo due to 512MB RAM limitations on the free hosting tier. For full functionality, please clone and test locally:\n\n🔗 **GitHub**: [https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot](https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot)",
          timestamp: new Date(),
          isWarning: true
        }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e, messageToSend = null) => {
    e.preventDefault();
    
    // Use the provided message or the current input message
    const message = messageToSend || inputMessage;
    
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = { message: message };
      if (sessionId) {
        payload.session_id = sessionId;
      }
      
      const response = await axios.post(
        `${API_URL}/chatbot/chat/`, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Save session ID for conversation continuity
      if (response.data.session_id && !sessionId) {
        setSessionId(response.data.session_id);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = {
        role: 'assistant',
        content: "❌ **Connection Error**: The AI chatbot is currently unavailable due to 512MB RAM limitations on the free hosting tier.\n\n**To test the full AI chatbot functionality:**\n\n1. Clone the repository: [https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot](https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot)\n2. Follow the setup instructions in the README\n3. Run locally with your own API keys\n\nAll other features (shopping, cart, checkout) work perfectly on this live demo! 🛍️",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    // Clear input and send the question directly
    setInputMessage('');
    const event = { preventDefault: () => {} };
    handleSendMessage(event, question);
  };

  const quickQuestions = [
    "What organic products do you have?",
    "Tell me about shipping options",
    "What's your return policy?",
    "Show me products on sale"
  ];

  if (!isOpen) {
    return (
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="chatbot-badge">AI</span>
      </button>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-avatar">🌿</div>
          <div className="chatbot-title">
            <h3>Organic Store Assistant</h3>
            <span className="chatbot-status">● Online</span>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="chatbot-action-btn"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? '□' : '_'}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="chatbot-action-btn"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chatbot-message ${message.role} ${message.isError ? 'error' : ''} ${message.isWarning ? 'warning' : ''}`}
              >
                <div className="message-content">
                  <ReactMarkdown
                    components={{
                      // Custom rendering for better formatting
                      p: ({node, ...props}) => <p style={{margin: '0.5em 0'}} {...props} />,
                      strong: ({node, ...props}) => <strong style={{fontWeight: '600', color: 'inherit'}} {...props} />,
                      ul: ({node, ...props}) => <ul style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
                      ol: ({node, ...props}) => <ol style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
                      li: ({node, ...props}) => <li style={{margin: '0.25em 0'}} {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 2 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
              className="chatbot-send-btn"
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBot;
