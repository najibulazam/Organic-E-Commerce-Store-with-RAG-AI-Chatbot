# 🔧 Quick Deployment Reference

## 📝 Pre-Deployment Checklist

### ✅ Files Created/Modified for Deployment
- ✅ [backend/ecommerce_backend/settings.py](backend/ecommerce_backend/settings.py) - Production config
- ✅ [backend/requirements.txt](backend/requirements.txt) - Added gunicorn, dj-database-url, whitenoise, psycopg2-binary
- ✅ [backend/build.sh](backend/build.sh) - Render build script
- ✅ [backend/.env.example](backend/.env.example) - Environment variables template
- ✅ [render.yaml](render.yaml) - Render infrastructure as code
- ✅ [frontend/src/services/api.js](frontend/src/services/api.js) - Environment-based API URL
- ✅ [frontend/.env.example](frontend/.env.example) - Frontend env template
- ✅ [netlify.toml](netlify.toml) - Netlify configuration
- ✅ [frontend/_redirects](frontend/_redirects) - SPA routing fix
- ✅ [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide

---

## 🚀 One-Minute Deployment Summary

### Backend (Render)
```bash
# 1. Create PostgreSQL database (free tier)
# 2. Create Web Service:
Root Directory: backend
Build Command: chmod +x build.sh && ./build.sh
Start Command: gunicorn ecommerce_backend.wsgi:application --bind 0.0.0.0:$PORT

# 3. Environment Variables:
SECRET_KEY=<generate>
DEBUG=False
ALLOWED_HOSTS=<your-app>.onrender.com,localhost,127.0.0.1
FRONTEND_URL=https://<your-app>.netlify.app
DATABASE_URL=<link-postgresql>
CLOUDINARY_CLOUD_NAME=<your-value>
CLOUDINARY_API_KEY=<your-value>
CLOUDINARY_API_SECRET=<your-value>
GROQ_API_KEY=<your-value>
```

### Frontend (Netlify)
```bash
# 1. Connect GitHub repository
# 2. Build settings:
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist

# 3. Environment Variable:
VITE_API_URL=https://<your-backend>.onrender.com/api
```

---

## 🔑 Required API Keys

### 1. Cloudinary (Media Storage)
- Sign up: https://cloudinary.com/users/register_free
- Dashboard: https://cloudinary.com/console
- Get: Cloud Name, API Key, API Secret

### 2. Groq (LLM API)
- Sign up: https://console.groq.com
- Create API Key: https://console.groq.com/keys
- Free tier: 14,400 requests/day

---

## 🧪 Testing After Deployment

### Backend Health Check
```bash
curl https://your-backend.onrender.com/api/products/
# Should return JSON with products
```

### Frontend Check
```
https://your-frontend.netlify.app
# Should load homepage with products
```

### Chatbot Test
1. Open frontend
2. Click chatbot icon
3. Ask: "What organic products do you have?"
4. Verify: Gets specific product names and prices

---

## ⚠️ Common Issues & Fixes

### Backend
| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | Wait 60 seconds (cold start) |
| ALLOWED_HOSTS error | Add Render URL to ALLOWED_HOSTS |
| Database error | Verify DATABASE_URL is linked |
| Static files missing | Run collectstatic in build.sh |

### Frontend
| Issue | Fix |
|-------|-----|
| API calls fail | Check VITE_API_URL has /api at end |
| 404 on refresh | Verify _redirects file exists |
| CORS error | Update FRONTEND_URL in backend |
| Images not loading | Verify Cloudinary credentials |

### Chatbot
| Issue | Fix |
|-------|-----|
| Not responding | Check GROQ_API_KEY is set |
| Generic responses | Run build_knowledge_base command |
| Slow first response | Cold start - normal on free tier |

---

## 📊 Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| **Render (Backend)** | 750 hrs/month | Sleeps after 15 min inactivity |
| **Render (PostgreSQL)** | 1 GB storage | ~10,000 products |
| **Netlify** | 100 GB bandwidth | Very generous |
| **Cloudinary** | 25 GB storage | Sufficient for images |
| **Groq** | 14,400 req/day | Excellent for portfolio |

---

## 🔄 Update Deployment

### Backend Updates
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-deploys from GitHub
```

### Frontend Updates
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Netlify auto-deploys from GitHub
```

---

## 📱 Portfolio Presentation

**Recruiter Demo Script:**

1. **Show the live site** (Netlify URL)
2. **Demonstrate chatbot**:
   - "What vegan products do you have?"
   - Show how it uses RAG to give specific answers
3. **Explain architecture**:
   - "Frontend on Netlify CDN for fast global access"
   - "Backend on Render with PostgreSQL database"
   - "RAG chatbot with Groq's Llama 3.3 70B model"
   - "Cloudinary for scalable image storage"
4. **Show code**:
   - Point to RAG implementation in `chatbot/rag_engine.py`
   - Explain embeddings and cosine similarity
5. **Mention production considerations**:
   - "Aware of cold start trade-offs on free tier"
   - "Configured for security with HTTPS, CORS, environment variables"

---

## 🎯 Next Steps

### For Production
- [ ] Add custom domain
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add Google Analytics
- [ ] Implement caching (Redis)
- [ ] Set up CI/CD pipelines
- [ ] Add automated testing

### For Portfolio
- [ ] Add project to resume
- [ ] Create demo video
- [ ] Write blog post about RAG implementation
- [ ] Share on LinkedIn
- [ ] Add to GitHub profile README

---

**Need help?** See the full [DEPLOYMENT.md](DEPLOYMENT.md) guide for detailed instructions.
