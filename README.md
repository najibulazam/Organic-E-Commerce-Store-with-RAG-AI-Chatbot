# 🛒 Organic E-Commerce Store with RAG AI Chatbot

A modern full-stack e-commerce platform featuring an **AI-powered RAG (Retrieval-Augmented Generation) chatbot assistant** built with **React (Vite)** and **Django REST Framework**. Shop for organic products while getting instant help from an intelligent chatbot that understands your questions about products, pricing, and store policies.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Django](https://img.shields.io/badge/Django-5.0-green?logo=django)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![DRF](https://img.shields.io/badge/DRF-3.16-red)
![AI](https://img.shields.io/badge/AI-RAG%20Powered-orange?logo=openai)
![Groq](https://img.shields.io/badge/LLM-Groq%20Llama%203.3-blueviolet)

> **🚀 Ready to Deploy?** Check out the complete [**DEPLOYMENT GUIDE**](DEPLOYMENT.md) for step-by-step instructions to deploy on Render (backend) and Netlify (frontend) - **100% FREE TIER!**

---

## 🌟 Highlights

**⚡ RAG-Powered Chatbot** - Ask natural language questions and get accurate answers from your product catalog
**🛍️ Complete E-Commerce** - Browse 40+ organic products across 17 categories with pagination
**🔍 Semantic Search** - AI understands "vegan protein" or "natural pain relief" and finds relevant products
**💬 Context-Aware Conversations** - Chatbot remembers previous messages for natural dialogue
**📱 Responsive Design** - Works beautifully on desktop, tablet, and mobile
**🔒 Secure Authentication** - Token-based auth with user profiles and order history

---

## ✨ Features

### 🤖 **AI Chatbot Assistant (RAG Architecture)**

The chatbot uses **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware responses:

**How RAG Works:**
1. **User asks a question** - "What vegan products do you have?"
2. **Semantic search** - Converts question to embedding vector, searches 70-entry knowledge base
3. **Context retrieval** - Finds top 5 most relevant products/FAQs using cosine similarity
4. **LLM generation** - Groq's Llama 3.3 70B model generates natural response using retrieved context
5. **Accurate answer** - Bot responds with specific product names, prices, and details

**Capabilities:**
- ✅ **Product Information** - Prices, stock levels, ratings, descriptions
- ✅ **Smart Recommendations** - "Best products for immunity?" → Suggests honey, turmeric, etc.
- ✅ **Natural Language** - Understands questions like "I have a headache, what should I take?"
- ✅ **Store FAQs** - Shipping, returns, payment methods, order tracking
- ✅ **Conversation Memory** - Maintains context across multiple messages
- ✅ **Markdown Support** - Formatted responses with bold text, lists, and structure
- ✅ **Auto-Knowledge Base** - Automatically generated from your product database

**Technical Implementation:**
- 🧠 **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2) - 384-dim vectors
- 🔍 **Vector Search**: NumPy cosine similarity (70 entries, sub-100ms searches)
- 🤖 **LLM**: Groq API with Llama 3.3 70B (1-2 second response times)
- 💾 **Knowledge Base**: 44 products + 11 categories + 15 FAQs with embeddings
- 📚 **Full Documentation**: [RAG Chatbot Technical Docs](backend/RAG_CHATBOT_DOCUMENTATION.md)

### 🛍️ **E-Commerce Platform**

**Product Catalog:**
- 📦 40+ organic products (fruits, vegetables, dairy, meat, grains, snacks)
- 🏷️ 17 categories with smart filtering
- 📄 **Pagination** - Navigate through all products (12 per page)
- 🔎 Search by name or description
- ⭐ Product ratings and reviews
- 💰 Price display with sale badges
- 📊 Stock availability tracking

**Shopping Experience:**
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, localStorage persistence
- 💳 **Checkout System** - Order summary, user details, payment flow
- 📜 **Order History** - View past orders with detailed invoices
- 🖨️ **Invoice Printing** - Printable order receipts

**User Management:**
- 👤 **Registration & Login** - Secure token-based authentication
- 🖼️ **Profile Pictures** - Upload and manage profile images via Cloudinary
- 📝 **Profile Management** - Update name, email, phone, address
- 🔐 **Secure Sessions** - Token authentication with Django REST Framework

### ⚙️ **Backend API**

- 🔌 **RESTful Endpoints** - Products, Categories, Orders, Users, Chatbot
- 🔑 **Token Authentication** - Secure API access
- 📊 **Django Admin Panel** - Manage products, orders, users
- ☁️ **Cloudinary Integration** - Cloud-based image storage
- 🚀 **CORS Enabled** - Frontend-backend communication
- 📖 **API Documentation** - Well-structured endpoints

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Modern UI library with hooks |
| **Vite 5** | Lightning-fast build tool |
| **React Router v6** | Client-side routing |
| **Bootstrap 5** | Responsive UI framework |
| **Axios** | HTTP requests to backend |
| **React Markdown** | Render formatted chatbot responses |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Django 5.0** | Python web framework |
| **Django REST Framework 3.16** | RESTful API creation |
| **SQLite** | Database (development) |
| **Token Authentication** | Secure user sessions |
| **django-cors-headers** | Cross-origin requests |

### AI/ML Stack
| Technology | Purpose |
|-----------|---------|
| **Sentence Transformers** | Text → vector embeddings (all-MiniLM-L6-v2) |
| **Groq API** | Fast LLM inference (Llama 3.3 70B) |
| **NumPy** | Vector operations & cosine similarity |
| **Python-dotenv** | Environment variable management |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Cloudinary** | Cloud image storage & CDN |
| **PowerShell Scripts** | Development server automation |

---

## 📁 Project Structure

```
e-commerce/
├── backend/                          # Django Backend
│   ├── ecommerce_backend/            # Django project settings
│   │   ├── settings.py              # Main configuration (with .env support)
│   │   ├── urls.py                  # URL routing
│   │   └── wsgi.py
│   │
│   ├── chatbot/                      # 🤖 AI Chatbot App (RAG)
│   │   ├── models.py                # ChatConversation, ChatMessage, KnowledgeBase
│   │   ├── views.py                 # Chat API endpoints
│   │   ├── serializers.py           # Request/response validation
│   │   ├── rag_engine.py            # RAG implementation (embeddings, search)
│   │   ├── chatbot_service.py       # Main chatbot logic & LLM integration
│   │   ├── urls.py                  # /api/chatbot/* routes
│   │   └── management/commands/
│   │       └── build_knowledge_base.py  # Auto-generate KB from products
│   │
│   ├── products/                     # Products app
│   │   ├── models.py                # Product & Category models
│   │   ├── views.py                 # Product API views
│   │   ├── serializers.py           # Product serializers
│   │   └── urls.py
│   │
│   ├── orders/                       # Orders app
│   │   ├── models.py                # Order & OrderItem models
│   │   ├── views.py                 # Order API views
│   │   └── serializers.py
│   │
│   ├── users/                        # Users app
│   │   ├── models.py                # UserProfile model
│   │   ├── views.py                 # Auth endpoints
│   │   └── serializers.py
│   │
│   ├── .env                          # Environment variables (API keys)
│   ├── .env.example                  # Template for environment setup
│   ├── db.sqlite3                    # SQLite database
│   ├── manage.py                     # Django management script
│   ├── requirements.txt              # Python dependencies
│   ├── RAG_CHATBOT_DOCUMENTATION.md  # 📚 Complete RAG guide
│   └── ENV_SETUP.md                  # Environment configuration guide
│
└── frontend/                         # React Frontend
    ├── src/
    │   ├── components/              # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Loading.jsx
    │   │   ├── ChatBot.jsx          # 🤖 AI Chat Widget
    │   │   └── ChatBot.css          # Chat styling
    │   ├── pages/                   # Page components
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx         # With pagination
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   └── OrderDetail.jsx
    │   ├── services/                # API services
    │   │   ├── api.js              # Product & Order APIs
    │   │   └── auth.js             # Authentication APIs
    │   ├── utils/
    │   │   └── cart.js             # Cart utilities
    │   ├── styles/
    │   │   ├── index.css           # Global styles
    │   │   └── invoice.css         # Print styles
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (Python 3.13 recommended)
- **Node.js 16+** and npm
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))
- **Cloudinary Account** (free at [cloudinary.com](https://cloudinary.com))

### ⚡ Fast Setup (2 Minutes)

#### Step 1: Clone & Setup Environment

```powershell
# Clone the repository
git clone https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot.git
cd Organic-E-Commerce-Store-with-RAG-AI-Chatbot

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\Activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

# Create .env file from template
Copy-Item .env.example .env
# Edit .env with your API keys (see below)
```

#### Step 2: Configure API Keys

Edit `backend/.env`:
```env
SECRET_KEY=django-insecure-your-secret-key-change-in-production
DEBUG=True

# Get from console.groq.com
GROQ_API_KEY=your-groq-api-key-here

# Get from cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Step 3: Build Knowledge Base & Start Servers

```powershell
# In backend directory (with venv activated)
python manage.py migrate
python manage.py build_knowledge_base  # Generates 70 AI knowledge entries
python manage.py runserver

# New terminal - Frontend
cd frontend
npm install
npm run dev
```

#### Step 4: Access the Application

- **🛍️ Store**: http://localhost:5173
- **🤖 Chat**: Click purple bubble (🌿) in bottom-right corner
- **⚙️ Admin**: http://localhost:8000/admin
  - Create superuser: `python manage.py createsuperuser`

---

## 📖 Detailed Setup Guide

### Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
Copy-Item .env.example .env
# Edit .env with your API keys

# Run migrations
python manage.py migrate

# Build AI knowledge base (70 entries from products + FAQs)
python manage.py build_knowledge_base

# Create superuser (admin account)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup

```powershell
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Access Points
- **🛍️ Store:** http://localhost:5173
- **🤖 Chatbot:** Click the 🌿 button in bottom-right corner
- **⚙️ Admin Panel:** http://localhost:8000/admin/
- **📡 API Docs:** http://localhost:8000/api/

---

## 💬 Chatbot Usage Examples

Try these questions to see the RAG chatbot in action:

**Product Discovery:**
- "What vegan protein options do you have?"
- "Show me organic products under $5"
- "What's good for a healthy breakfast?"

**Specific Information:**
- "What's the price of organic honey?"
- "Tell me about your almond milk"
- "Is the quinoa gluten-free?"

**Smart Recommendations:**
- "I have a headache, what should I take?"
- "What products help with immunity?"
- "Best items for weight loss?"

**Store FAQs:**
- "What's your shipping policy?"
- "How can I track my order?"
- "Do you accept returns?"

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### 🤖 Chatbot Endpoints

#### Send Chat Message
```http
POST /api/chatbot/chat/
Content-Type: application/json

{
  "message": "What vegan products do you have?",
  "session_id": null  // null for new conversation, or UUID for existing
}

Response:
{
  "session_id": "abc-123-def-456",
  "response": "We have several excellent vegan options:\n\n1. **Organic Tofu** - $4.99...",
  "timestamp": "2025-12-24T10:30:45Z"
}
```

#### Get Conversation History
```http
GET /api/chatbot/conversation/{session_id}/

Response:
{
  "session_id": "abc-123-def-456",
  "messages": [
    {
      "sender": "user",
      "message": "What vegan products do you have?",
      "created_at": "2025-12-24T10:30:00Z"
    },
    {
      "sender": "bot",
      "message": "We have several excellent vegan options...",
      "created_at": "2025-12-24T10:30:02Z"
    }
  ]
}
```

#### Health Check
```http
GET /api/chatbot/health/

Response:
{
  "status": "healthy",
  "knowledge_base_entries": 70,
  "timestamp": "2025-12-24T10:30:45Z"
}
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/users/me/
Authorization: Token <your-token>
```

#### Update Profile
```http
PATCH /api/auth/users/update_profile/
Authorization: Token <your-token>
Content-Type: multipart/form-data

FormData: {
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "profile_image": <file>
}
```

#### Logout
```http
POST /api/auth/logout/
Authorization: Token <your-token>
```

### Product Endpoints

#### List Products (Paginated)
```http
GET /api/products/                    # Page 1 (12 items)
GET /api/products/?page=2             # Page 2
GET /api/products/?search=apple       # Search
GET /api/products/?category=1         # Filter by category
GET /api/products/?ordering=-price    # Sort by price desc
GET /api/products/?featured=true      # Featured only
```

#### Get Product Details
```http
GET /api/products/<slug>/
```

#### Featured Products
```http
GET /api/products/featured/
```

#### Latest Products
```http
GET /api/products/latest/
```

### Category Endpoints

#### List Categories
```http
GET /api/products/categories/
```

### Order Endpoints

#### Create Order
```http
POST /api/orders/
Authorization: Token <your-token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "shipping_address": "123 Main St, City, Country"
}
```

#### List User Orders
```http
GET /api/orders/
Authorization: Token <your-token>
```

#### Get Order Details
```http
GET /api/orders/<id>/
Authorization: Token <your-token>
```

---

## 🎯 Key Features in Detail

### 🤖 1. RAG Chatbot System

**Architecture:**
- **Retrieval**: Semantic search using Sentence Transformers embeddings
- **Augmentation**: Top-5 relevant knowledge entries injected into prompt
- **Generation**: Groq's Llama 3.3 70B generates natural responses

**Knowledge Base:**
- 44 product entries with prices, stock, ratings, descriptions
- 11 category summaries with product listings
- 15 FAQ entries (shipping, returns, payments, etc.)
- Auto-generated from database with `build_knowledge_base` command

**Chat Features:**
- Real-time responses (1-2 seconds)
- Markdown formatting (bold, lists, links)
- Conversation context (maintains history)
- Session persistence across page reloads
- Mobile-responsive chat widget
- Quick question buttons
- Typing indicators

**Technical Specs:**
- Embedding Model: all-MiniLM-L6-v2 (384 dimensions)
- Similarity: Cosine similarity with 0.25 threshold
- Vector Storage: Django ORM with JSON fields
- Response Time: ~50-100ms retrieval + 1-2s LLM
- Scalability: 70 entries (can scale to 1000+)

### 2. User Authentication System
- Token-based authentication using Django REST Framework
- Secure registration with password confirmation
- Login with email or username
- User profile with extended fields (phone, address, profile picture)
- Profile picture upload via Cloudinary (5MB max, image formats only)
- Protected routes for authenticated users

### 3. Product Management
- **40+ Organic Products** across 17 categories:
  - Fruits, Vegetables, Dairy & Eggs, Meat & Seafood
  - Bakery, Beverages, Breakfast, Frozen Foods
  - Snacks, Pasta & Grains, Spices & Condiments
- Product images hosted on Cloudinary CDN
- Star ratings (4.4-4.9 out of 5)
- Stock management with availability tracking
- Featured products for homepage
- Sale prices with discount display
- **Pagination**: 12 products per page with navigation

### 4. Shopping Cart
- LocalStorage-based cart persistence
- Add/remove/update quantities
- Real-time total calculation
- Cart badge in navbar showing item count
- Cart summary with product images
- Responsive cart drawer

### 5. Order System
- Complete checkout flow
- Order history in user profile
- Order detail page with:
  - Product list with images
  - Order status tracking (Pending → Processing → Shipped → Delivered)
  - Customer information
  - Payment details
  - **Printable Invoice** with professional layout

### 6. Search & Filter
- Full-text search across product names and descriptions
- Filter by category (all 17 categories)
- Sort by price, date, rating
- Responsive product grid with card layout
- Paginated results with page numbers

---

## 📚 Documentation

- **[RAG Chatbot Technical Guide](backend/RAG_CHATBOT_DOCUMENTATION.md)** - Complete 700+ line documentation covering RAG architecture, code deep dive, and troubleshooting
- **[Environment Setup Guide](backend/ENV_SETUP.md)** - How to configure API keys and environment variables
- **[Cloudinary Setup](backend/CLOUDINARY_STATUS.md)** - Image storage configuration

---

## 🧪 Testing the Chatbot

Try these example conversations:

**Product Discovery:**
```
You: "What vegan protein options do you have?"
Bot: Lists tofu, nuts, plant-based products with prices

You: "Tell me more about the tofu"
Bot: Provides details about Organic Tofu - $4.99, 100 units, 4.6★
```

**Health Queries:**
```
You: "I have a headache, what should I take?"
Bot: Recommends natural products like green tea, suggests honey

You: "What's the price of green tea?"
Bot: "Organic Green Tea - $5.99, 90 units in stock, rated 4.7/5"
```

**Store Information:**
```
You: "What's your shipping policy?"
Bot: Explains shipping options, costs, and delivery times

You: "Do you accept returns?"
Bot: Details 30-day return policy
```

---

## 🔧 Configuration

### Backend Configuration

**Environment Variables (`.env`):**
```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True

# Groq AI
GROQ_API_KEY=your-groq-api-key  # Get from console.groq.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
```

**Settings (`backend/ecommerce_backend/settings.py`):**
- CORS origins configured for frontend (ports 5173, 5174)
- Cloudinary for media storage
- Token authentication enabled
- Pagination: 12 items per page
- Categories pagination disabled (show all)

### Frontend Configuration

**API Base URL (`frontend/src/services/api.js`):**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
```

**Vite Config (`frontend/vite.config.js`):**
```javascript
server: {
  port: 5173
}
```

---

## 📦 Database Models

### Chatbot Models

**KnowledgeBase:**
- content (TextField) - Product info, FAQs
- content_type (CharField) - 'product', 'category', 'faq'
- metadata (JSONField) - Product details (id, price, stock)
- embedding (JSONField) - 384-dim vector
- created_at, updated_at

**ChatConversation:**
- session_id (UUID) - Unique conversation identifier
- user (ForeignKey, optional)
- created_at, updated_at

**ChatMessage:**
- conversation (ForeignKey)
- role (CharField) - 'user' or 'assistant'
- content (TextField)
- created_at

### E-Commerce Models

**Product:**
- name, slug, description
- category (ForeignKey)
- price, discount_price
- image (Cloudinary URL), stock
- featured, available
- rating, created_at, updated_at

**Category:**
- name, slug, description
- image (Cloudinary URL)

**Order:**
- user (ForeignKey)
- status (pending/processing/shipped/delivered/cancelled)
- total_amount
- customer info (name, email, phone, address)
- created_at, updated_at

**OrderItem:**
- order (ForeignKey)
- product (ForeignKey)
- quantity, price

**UserProfile (extends User):**
- phone, profile_image
- address, city, state, zip_code, country

---

## 🧪 Testing

### Chatbot Testing

```powershell
cd backend
.\venv\Scripts\python.exe test_groq_chatbot.py
```

### API Testing

1. **Backend API Testing:**
   - DRF Browsable API: http://localhost:8000/api/products/
   - Admin panel: http://localhost:8000/admin/
   - Chatbot health: http://localhost:8000/api/chatbot/health/

2. **Frontend Testing:**
   - Register a new user
   - Browse products with pagination
   - Test chatbot with various questions
   - Add to cart and checkout
   - View order history
   - Update profile and upload picture
   - Test search, filters, and category dropdown

---

## 🚀 Performance

### Current Metrics (70 Knowledge Base Entries)

- **Chatbot Response Time**: 1.5-2.5 seconds total
  - Embedding generation: 10-20ms
  - Vector search: 50-100ms
  - LLM inference (Groq): 1-2 seconds
- **Product Page Load**: ~300ms
- **Search Performance**: <100ms
- **Memory Usage**: ~150MB (backend)

### Scaling Considerations

**For 1,000+ Products:**
- Consider FAISS for vector indexing (faster search)
- Implement caching for frequent queries
- Use PostgreSQL instead of SQLite
- Add Redis for session storage

**For High Traffic:**
- Deploy with Gunicorn + Nginx
- Use CDN for static files
- Implement database connection pooling
- Add rate limiting for chatbot API

---

## 🚢 Deployment

### Backend (Django)

**Recommended Platform**: Railway, Render, or PythonAnywhere

```bash
# Set environment variables
GROQ_API_KEY=your-key
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
SECRET_KEY=your-secret
DEBUG=False

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Build knowledge base
python manage.py build_knowledge_base

# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn ecommerce_backend.wsgi:application
```

### Frontend (React)

**Recommended Platform**: Vercel, Netlify, or Cloudflare Pages

```bash
# Update API URL in production
# Create .env file:
VITE_API_URL=https://your-backend.com/api

# Build
npm run build

# Deploy dist/ folder
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Md Najib Ul Azam Mahi**
- GitHub: [@najibulazam](https://github.com/najibulazam)
- LinkedIn: [najibulazam](https://linkedin.com/in/najibulazam)
- Project Repo: [Organic E-Commerce Store with RAG AI Chatbot](https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot)
- Email: azam.mdnajibul@gmail.com

---

## 🙏 Acknowledgments

- **Groq** - Fast LLM inference API
- **Sentence Transformers** - Pre-trained embedding models
- **Cloudinary** - Image hosting and CDN
- **Django & React Communities** - Excellent documentation and support
- **Bootstrap** - Beautiful UI components

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [RAG Chatbot Documentation](backend/RAG_CHATBOT_DOCUMENTATION.md)
2. Check the [Environment Setup Guide](backend/ENV_SETUP.md)
3. Open an issue on [GitHub](https://github.com/najibulazam/Organic-E-Commerce-Store-with-RAG-AI-Chatbot/issues)
4. Contact: azam.mdnajibul@gmail.com

---

## 🔮 Future Enhancements

- [ ] **Advanced RAG Features**
  - Product comparison functionality
  - Image-based product search
  - Multi-language support
  - Voice input for chatbot
  
- [ ] **E-Commerce Features**
  - Payment gateway integration (Stripe/PayPal)
  - Real-time inventory updates
  - Product recommendations based on purchase history
  - Wishlist functionality
  - Product reviews and ratings
  - Email notifications for orders
  
- [ ] **Technical Improvements**
  - FAISS integration for faster vector search at scale
  - Redis caching for frequent queries
  - PostgreSQL migration for production
  - Docker containerization
  - Comprehensive test suite
  - CI/CD pipeline

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

<p align="center">
  <strong>Built with ❤️ using Django, React, and AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-Python-blue?logo=python" />
  <img src="https://img.shields.io/badge/Made%20with-React-blue?logo=react" />
  <img src="https://img.shields.io/badge/Powered%20by-AI-orange?logo=openai" />
</p>


1. **Set environment variables:**
   ```bash
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   ```

2. **Use PostgreSQL/MySQL for production:**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'your_db_name',
           ...
       }
   }
   ```

3. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

4. **Deploy using:**
   - Heroku, Railway, Render
   - AWS EC2 + Nginx + Gunicorn
   - DigitalOcean App Platform

### Frontend (React)

1. **Update API URLs in `services/`:**
   ```javascript
   const API_BASE_URL = 'https://your-backend.com/api';
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder to:**
   - Vercel, Netlify, GitHub Pages
   - AWS S3 + CloudFront
   - Firebase Hosting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Md Najib Ul Azam Mahi**
- GitHub: [@najibulazam](https://github.com/najibulazam)
- LinkedIn: [najibulazam](https://linkedin.com/in/najibulazam)

---


**Happy Coding! 🚀**
