# 🏗️ Architecture & Deployment Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                    (Any Device, Anywhere)                       │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NETLIFY CDN (Frontend)                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite                                       │   │
│  │  - Product browsing                                    │   │
│  │  - Shopping cart                                       │   │
│  │  - Checkout flow                                       │   │
│  │  - Chatbot UI                                          │   │
│  │  - User authentication                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Deployment: Automatic from GitHub push                        │
│  Build: npm run build → static files to CDN                    │
│  Location: Global edge network                                 │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS API calls
                              │ CORS configured
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RENDER.COM (Backend API)                      │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Django 5 + DRF                                        │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │  Products API                                 │     │   │
│  │  │  - List/detail/filter                         │     │   │
│  │  │  - Categories                                 │     │   │
│  │  │  - Pagination                                 │     │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │  Orders API                                   │     │   │
│  │  │  - Create/list/detail                         │     │   │
│  │  │  - User orders                                │     │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │  Users API                                    │     │   │
│  │  │  - Registration/login                         │     │   │
│  │  │  - Profile management                         │     │   │
│  │  │  - Token authentication                       │     │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │  ⭐ RAG Chatbot API                          │     │   │
│  │  │  - Chat endpoint                              │     │   │
│  │  │  - Conversation management                    │     │   │
│  │  │  - Context retrieval                          │     │   │
│  │  │  - LLM integration                            │     │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Server: Gunicorn WSGI                                         │
│  Static Files: WhiteNoise                                      │
│  Deployment: Automatic from GitHub push                        │
└─────────────────────────────────────────────────────────────────┘
              │                           │
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│  RENDER POSTGRESQL      │   │  CLOUDINARY CDN          │
│  (Free Tier)            │   │  (Image Storage)         │
│                         │   │                          │
│  - Products             │   │  - Product images        │
│  - Categories           │   │  - Profile pictures      │
│  - Orders               │   │  - Automatic CDN         │
│  - Users                │   │  - Image optimization    │
│  - Chat history         │   │  - Transformations       │
│  - Knowledge base       │   │  - Global delivery       │
│  - Embeddings           │   │                          │
│                         │   │  Free: 25GB storage      │
│  Free: 1GB storage      │   └──────────────────────────┘
└─────────────────────────┘
              │
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              RAG CHATBOT SYSTEM ARCHITECTURE                    │
│                                                                 │
│  1. USER QUERY                                                  │
│     "What vegan products do you have?"                          │
│                    ↓                                            │
│  2. EMBEDDING GENERATION                                        │
│     Sentence-Transformers (all-MiniLM-L6-v2)                   │
│     Text → 384-dim vector                                       │
│                    ↓                                            │
│  3. SEMANTIC SEARCH                                             │
│     ┌─────────────────────────────────────────────┐           │
│     │ Knowledge Base (70 entries)                 │           │
│     │ - 44 Products (with embeddings)             │           │
│     │ - 11 Categories (with embeddings)           │           │
│     │ - 15 FAQs (with embeddings)                 │           │
│     └─────────────────────────────────────────────┘           │
│     Cosine similarity → Top 5 matches                           │
│                    ↓                                            │
│  4. CONTEXT AUGMENTATION                                        │
│     Build prompt with:                                          │
│     - System instructions                                       │
│     - Retrieved context (top 5)                                 │
│     - Conversation history                                      │
│     - User question                                             │
│                    ↓                                            │
│  5. LLM GENERATION                                              │
│     ┌─────────────────────────────────────────────┐           │
│     │         GROQ API                            │           │
│     │   Llama 3.3 70B (Versatile)                │           │
│     │   - Fast inference (~100 tokens/sec)       │           │
│     │   - Free: 14,400 requests/day              │           │
│     └─────────────────────────────────────────────┘           │
│                    ↓                                            │
│  6. RESPONSE                                                    │
│     "We have several vegan options:                             │
│     - **Tofu** ($4.99) - High protein                          │
│     - **Almond Milk** ($5.99) - Dairy-free                     │
│     - **Quinoa** ($6.99) - Complete protein..."                │
│                                                                 │
│  Performance: < 2 seconds end-to-end                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Product Browsing
```
User → Netlify → Render API → PostgreSQL → Response
              ↓
         Cloudinary (images)
```

### Chatbot Interaction
```
User types query
    ↓
React sends to API
    ↓
Django RAG Engine:
    1. Generate embedding
    2. Search knowledge base
    3. Retrieve context
    ↓
Call Groq API
    ↓
Generate response
    ↓
Store conversation in PostgreSQL
    ↓
Return to React
    ↓
Display with markdown
```

### Order Processing
```
User places order
    ↓
React sends to API
    ↓
Django creates order
    ↓
Save to PostgreSQL
    ↓
Return order confirmation
    ↓
Display invoice
```

---

## Environment Variables Flow

### Development
```
Backend: .env file
├── DEBUG=True
├── ALLOWED_HOSTS=localhost
├── CLOUDINARY_* (from dashboard)
└── GROQ_API_KEY (from console)

Frontend: .env file (optional)
└── VITE_API_URL=http://localhost:8000/api
```

### Production
```
Backend (Render Environment)
├── SECRET_KEY (generated)
├── DEBUG=False
├── ALLOWED_HOSTS=app.onrender.com
├── FRONTEND_URL=https://app.netlify.app
├── DATABASE_URL (auto from PostgreSQL)
├── CLOUDINARY_* (from dashboard)
└── GROQ_API_KEY (from console)

Frontend (Netlify Environment)
└── VITE_API_URL=https://backend.onrender.com/api
```

---

## Deployment Pipeline

### Backend (Render)
```
1. Git push to GitHub
        ↓
2. Render detects change
        ↓
3. Pull latest code
        ↓
4. Run build.sh:
   - Install Python dependencies
   - Collect static files
   - Run migrations
   - Build knowledge base
        ↓
5. Start Gunicorn
        ↓
6. Health check
        ↓
7. Update DNS
        ↓
8. Service live ✅
```

### Frontend (Netlify)
```
1. Git push to GitHub
        ↓
2. Netlify detects change
        ↓
3. Pull latest code
        ↓
4. Install npm dependencies
        ↓
5. Run: npm run build
        ↓
6. Optimize assets
        ↓
7. Deploy to global CDN
        ↓
8. Update DNS
        ↓
9. Site live ✅
```

---

## Network Diagram

```
                    INTERNET
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   [Desktop]      [Mobile]       [Tablet]
        │              │              │
        └──────────────┼──────────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │  NETLIFY CDN    │
              │  (Global Edge)  │
              └─────────────────┘
                       │ HTTPS + CORS
                       ▼
              ┌─────────────────┐
              │  RENDER.COM     │
              │  (Oregon DC)    │
              └─────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ PostgreSQL │  │ Cloudinary │  │  Groq API  │
│  Database  │  │    CDN     │  │    LLM     │
└────────────┘  └────────────┘  └────────────┘
```

---

## Technology Stack Summary

| Layer | Technology | Purpose | Hosting |
|-------|-----------|---------|---------|
| **Frontend** | React 18 + Vite | UI/UX | Netlify CDN |
| **Backend** | Django 5 + DRF | REST API | Render.com |
| **Database** | PostgreSQL | Data persistence | Render.com |
| **Media** | Cloudinary | Image storage/CDN | Cloudinary |
| **AI Model** | Groq (Llama 3.3) | LLM inference | Groq API |
| **Embeddings** | Sentence-Transformers | Vector generation | Backend (CPU) |
| **Web Server** | Gunicorn | WSGI server | Render.com |
| **Static Files** | WhiteNoise | Static serving | Render.com |

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Transport Layer                     │
│     - HTTPS everywhere                  │
│     - SSL/TLS certificates              │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  2. Application Layer                   │
│     - CORS restrictions                 │
│     - CSRF protection                   │
│     - XSS prevention                    │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  3. Authentication                      │
│     - Token-based auth                  │
│     - Secure session cookies            │
│     - Password hashing                  │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  4. Infrastructure                      │
│     - Environment variables             │
│     - Secret management                 │
│     - Database connection pooling       │
└─────────────────────────────────────────┘
```

---

## Scaling Strategy

### Current (Free Tier)
- Backend: Single instance (sleeps after 15min)
- Database: 1GB PostgreSQL
- Frontend: Global CDN (unlimited scaling)

### Future (Paid Tiers)
- Backend: Auto-scaling instances
- Database: Larger storage + read replicas
- Redis: Caching layer
- Background workers: Celery for async tasks

---

## Performance Characteristics

| Metric | Development | Production |
|--------|------------|------------|
| Frontend Load | < 1s | < 500ms (CDN) |
| API Response | < 100ms | < 200ms |
| Chatbot Response | 1-2s | 1-2s |
| Cold Start | N/A | 30-60s (free tier) |
| Image Load | Varies | < 1s (Cloudinary CDN) |

---

## Monitoring Points

```
┌──────────────┐
│  User Device │
└──────┬───────┘
       │ Monitor: Page load time
       ▼
┌──────────────┐
│ Netlify CDN  │
└──────┬───────┘
       │ Monitor: Build success, bandwidth
       ▼
┌──────────────┐
│  Render API  │
└──────┬───────┘
       │ Monitor: Uptime, response time, errors
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  PostgreSQL  │     │  Cloudinary  │     │   Groq API   │
└──────────────┘     └──────────────┘     └──────────────┘
Monitor: Queries      Monitor: Storage     Monitor: Usage
         Connections           Bandwidth            Rate limits
```

---

This architecture provides:
- ✅ High availability (CDN for frontend)
- ✅ Scalability (can upgrade tiers as needed)
- ✅ Security (HTTPS, CORS, auth)
- ✅ Performance (CDN, optimized images)
- ✅ Cost-effective (100% free tier for portfolio)
- ✅ Production-ready (proper separation of concerns)
