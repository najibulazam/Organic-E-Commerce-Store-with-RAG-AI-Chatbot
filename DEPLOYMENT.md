# 🚀 Deployment Guide - Organic E-Commerce Store with RAG AI Chatbot

Complete step-by-step guide to deploy your full-stack application:
- **Backend**: Django 5 + DRF + RAG Chatbot → **Render** (Free Tier)
- **Frontend**: React 18 + Vite → **Netlify** (Free Tier)
- **Database**: PostgreSQL → **Render** (Free Tier)
- **Media Storage**: Cloudinary (Free Tier)
- **AI LLM**: Groq API (Free Tier)

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Backend Deployment (Render)](#part-1-backend-deployment-render)
3. [Part 2: Frontend Deployment (Netlify)](#part-2-frontend-deployment-netlify)
4. [Part 3: Final Configuration](#part-3-final-configuration)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)
7. [Free Tier Limitations](#free-tier-limitations)

---

## Prerequisites

### 1. Required Accounts (All Free)
- ✅ [GitHub Account](https://github.com) - for code repository
- ✅ [Render Account](https://render.com) - for backend hosting
- ✅ [Netlify Account](https://netlify.com) - for frontend hosting
- ✅ [Cloudinary Account](https://cloudinary.com) - for media storage
- ✅ [Groq Account](https://console.groq.com) - for AI chatbot LLM

### 2. Get API Keys

#### **Cloudinary Setup**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy these values:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

#### **Groq API Setup**
1. Go to [Groq Console](https://console.groq.com)
2. Create new API Key
3. Copy the `API Key`

### 3. Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## Part 1: Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. **Log in to Render** → https://dashboard.render.com
2. Click **"New +"** → Select **"PostgreSQL"**
3. Configure:
   - **Name**: `ecommerce-db`
   - **Database**: `ecommerce`
   - **User**: `ecommerce`
   - **Region**: `Oregon (US West)` (recommended for free tier)
   - **Plan**: **Free**
4. Click **"Create Database"**
5. ⏳ Wait 1-2 minutes for database to provision
6. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 2: Create Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. **Connect Repository**:
   - Click **"Connect account"** → Authorize GitHub
   - Select your repository: `Organic-E-Commerce-Store-with-RAG-AI-Chatbot`
3. Configure Service:
   - **Name**: `ecommerce-backend` (or your preferred name)
   - **Region**: `Oregon (US West)` (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     chmod +x build.sh && ./build.sh
     ```
   - **Start Command**: 
     ```bash
     gunicorn ecommerce_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - **Plan**: **Free**

4. Click **"Advanced"** to add Environment Variables

### Step 3: Configure Environment Variables

Add these environment variables in Render:

```bash
# Django Configuration
SECRET_KEY=<click "Generate" to auto-generate>
DEBUG=False
PYTHON_VERSION=3.11.0

# Allowed Hosts (IMPORTANT: Update after deployment)
ALLOWED_HOSTS=ecommerce-backend.onrender.com,localhost,127.0.0.1

# Frontend URL (IMPORTANT: Update after Netlify deployment)
FRONTEND_URL=https://your-app-name.netlify.app

# Database (select from dropdown)
DATABASE_URL=[Select: ecommerce-db → Internal Database URL]

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Groq API for RAG Chatbot
GROQ_API_KEY=<your-groq-api-key>
```

**⚠️ Important Notes:**
- For `SECRET_KEY`: Click **"Generate"** button in Render
- For `DATABASE_URL`: Use dropdown to select your `ecommerce-db` database
- For `ALLOWED_HOSTS`: You'll update this after deployment with your actual Render URL
- For `FRONTEND_URL`: You'll update this after Netlify deployment

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. ⏳ **Wait 5-10 minutes** for first deployment (includes):
   - Installing Python dependencies
   - Collecting static files
   - Running migrations
   - Building RAG knowledge base
3. **Monitor deployment logs** for any errors
4. Once deployed, you'll get a URL like: `https://ecommerce-backend.onrender.com`

### Step 5: Update ALLOWED_HOSTS

1. After deployment, copy your backend URL
2. Go to **Environment** tab
3. Update `ALLOWED_HOSTS`:
   ```
   ALLOWED_HOSTS=ecommerce-backend.onrender.com,localhost,127.0.0.1
   ```
   (Replace `ecommerce-backend` with your actual service name)
4. Service will auto-redeploy

---

## Part 2: Frontend Deployment (Netlify)

### Step 1: Connect Repository to Netlify

1. **Log in to Netlify** → https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. **Connect to Git**:
   - Click **"GitHub"**
   - Authorize Netlify
   - Select repository: `Organic-E-Commerce-Store-with-RAG-AI-Chatbot`

### Step 2: Configure Build Settings

1. Configure deployment:
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
2. Click **"Show advanced"** → **"New variable"**

### Step 3: Add Environment Variable

Add this environment variable:

```bash
VITE_API_URL=https://ecommerce-backend.onrender.com/api
```

**⚠️ Important**: Replace `ecommerce-backend` with your actual Render service name

### Step 4: Deploy Frontend

1. Click **"Deploy site"**
2. ⏳ Wait 2-3 minutes for build
3. You'll get a random URL like: `https://random-name-12345.netlify.app`

### Step 5: Customize Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `your-ecommerce-store` (or preferred name)
4. Your URL becomes: `https://your-ecommerce-store.netlify.app`

---

## Part 3: Final Configuration

### Update Backend with Frontend URL

1. **Go back to Render** → Your backend service
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-ecommerce-store.netlify.app
   ```
4. Service will auto-redeploy
5. ⏳ Wait 2-3 minutes

### Verify CORS Configuration

Your backend [settings.py](backend/ecommerce_backend/settings.py) already includes:
```python
FRONTEND_URL = os.getenv('FRONTEND_URL')
if FRONTEND_URL:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)
```

This ensures your Netlify frontend can communicate with Render backend.

---

## Testing & Verification

### 1. Test Backend API

Open in browser:
```
https://ecommerce-backend.onrender.com/api/products/
```

You should see:
- ✅ JSON list of products
- ✅ Status 200

### 2. Test Frontend

Open your Netlify URL:
```
https://your-ecommerce-store.netlify.app
```

Verify:
- ✅ Homepage loads
- ✅ Products display
- ✅ Navigation works
- ✅ Cart functionality
- ✅ **Chatbot works** (test with questions like "Show me organic products")

### 3. Test Chatbot Specifically

1. Click chatbot icon on website
2. Ask: "What organic products do you have?"
3. Verify:
   - ✅ Response uses RAG context
   - ✅ Mentions specific products
   - ✅ Includes prices

### 4. Test Image Uploads (Admin)

1. Access Django admin:
   ```
   https://ecommerce-backend.onrender.com/admin
   ```
2. Create superuser (if not done):
   ```bash
   # In Render Shell (Dashboard → Shell tab)
   python manage.py createsuperuser
   ```
3. Upload product image
4. Verify image stored in Cloudinary

---

## Troubleshooting

### Backend Issues

#### ❌ "Application failed to respond"
**Cause**: Service starting (cold start on free tier)
**Solution**: Wait 30-60 seconds and refresh

#### ❌ "502 Bad Gateway"
**Causes**:
1. Build failed - Check **Logs** tab
2. Database not connected - Verify `DATABASE_URL` in Environment
3. Missing environment variables

**Solutions**:
```bash
# Check logs in Render Dashboard
# Verify all environment variables are set
# Ensure build.sh has execute permissions
```

#### ❌ "ALLOWED_HOSTS validation error"
**Solution**: Update `ALLOWED_HOSTS` to include your Render domain

#### ❌ "CORS policy error"
**Solution**: 
1. Verify `FRONTEND_URL` is set in backend environment
2. Must include `https://` protocol
3. No trailing slash

### Frontend Issues

#### ❌ "404 on page refresh"
**Cause**: SPA routing not configured
**Solution**: `_redirects` file already created in `frontend/` folder

#### ❌ "API calls failing"
**Cause**: Incorrect `VITE_API_URL`
**Solution**:
1. Go to Netlify → Site settings → Environment variables
2. Verify `VITE_API_URL=https://your-backend.onrender.com/api`
3. **Must include `/api` at the end**
4. Trigger redeploy

#### ❌ "Mixed Content" errors (HTTP/HTTPS)
**Cause**: Frontend (HTTPS) trying to call backend (HTTP)
**Solution**: Render uses HTTPS by default - verify your `VITE_API_URL` uses `https://`

### RAG Chatbot Issues

#### ❌ "Chatbot not responding"
**Causes**:
1. `GROQ_API_KEY` not set
2. Knowledge base not built
3. API rate limit exceeded

**Solutions**:
```bash
# Verify Groq API key is set in Render Environment
# Rebuild knowledge base (in Render Shell):
python manage.py build_knowledge_base

# Check Groq API usage at console.groq.com
```

#### ❌ "Generic responses (not using product data)"
**Cause**: Knowledge base empty or not loaded
**Solution**:
```bash
# In Render Shell:
python manage.py build_knowledge_base

# Verify products exist in database:
python manage.py shell
>>> from products.models import Product
>>> Product.objects.count()
```

### Database Issues

#### ❌ "Database connection failed"
**Solution**:
1. Verify PostgreSQL database is running (green dot in Render)
2. Check `DATABASE_URL` environment variable is connected
3. Free tier databases sleep after inactivity - first request may be slow

---

## Free Tier Limitations

### Render (Backend)
- ⏱️ **Cold Starts**: Service sleeps after 15 minutes of inactivity
  - First request after sleep: **30-60 seconds** to wake up
  - Subsequent requests: Normal speed
- 💾 **PostgreSQL**: 1 GB storage (sufficient for ~10,000 products)
- 🔄 **Free tier**: 750 hours/month (enough for always-on with 1 service)
- 📉 **Performance**: Shared CPU, may be slower under load

### Netlify (Frontend)
- 📦 **Bandwidth**: 100 GB/month (very generous)
- 🏗️ **Build Minutes**: 300/month (sufficient for most projects)
- ⚡ **Performance**: Global CDN, fast loading

### Cloudinary (Media)
- 📸 **Storage**: 25 GB
- 🔄 **Transformations**: 25 monthly credits
- 🌐 **Bandwidth**: 25 GB/month

### Groq (AI Chatbot)
- 🤖 **Requests**: 14,400 requests/day (very generous)
- ⚡ **Speed**: Extremely fast inference (~100 tokens/sec)
- 🆓 **Free tier is very generous for portfolio projects**

### Production Optimization Tips

1. **Reduce Cold Starts**:
   ```python
   # Consider using a free uptime monitor:
   # - UptimeRobot (https://uptimerobot.com)
   # - Ping every 14 minutes to keep service warm
   ```

2. **Optimize Images**:
   - Use Cloudinary's automatic optimization
   - Serve WebP format when possible
   - Lazy load images

3. **Cache Static Assets**:
   - Already configured in `netlify.toml`
   - Browser caching: 1 year for static files

4. **Database Optimization**:
   ```python
   # Use select_related and prefetch_related in Django
   # Example in views.py:
   Product.objects.select_related('category').all()
   ```

---

## 🎉 Success Checklist

After deployment, verify:

- ✅ Backend API accessible at `https://your-backend.onrender.com/api/products/`
- ✅ Frontend loads at `https://your-app.netlify.app`
- ✅ Products display with images from Cloudinary
- ✅ Cart functionality works
- ✅ Checkout process functional
- ✅ **RAG Chatbot responds with product-specific information**
- ✅ No CORS errors in browser console
- ✅ Navigation and routing work correctly
- ✅ Mobile responsive design

---

## Environment Variables Summary

### Backend (Render)
```bash
SECRET_KEY=<auto-generated>
DEBUG=False
PYTHON_VERSION=3.11.0
ALLOWED_HOSTS=<your-render-url>.onrender.com,localhost,127.0.0.1
FRONTEND_URL=https://<your-netlify-url>.netlify.app
DATABASE_URL=<auto-linked-from-postgresql>
CLOUDINARY_CLOUD_NAME=<your-value>
CLOUDINARY_API_KEY=<your-value>
CLOUDINARY_API_SECRET=<your-value>
GROQ_API_KEY=<your-value>
```

### Frontend (Netlify)
```bash
VITE_API_URL=https://<your-render-url>.onrender.com/api
```

---

## Monitoring & Maintenance

### Daily Checks
- Monitor Render logs for errors
- Check Cloudinary usage
- Verify chatbot responses are accurate

### Weekly Maintenance
- Review Groq API usage
- Monitor database size
- Check for Django security updates

### Monthly Tasks
- Update dependencies
- Review and optimize database queries
- Test all critical user flows

---

## Next Steps

### Enhance for Production
1. **Custom Domain**: Connect your own domain to Netlify
2. **SSL Certificate**: Auto-provisioned by both Render and Netlify
3. **Monitoring**: Set up error tracking (Sentry)
4. **Analytics**: Add Google Analytics or privacy-focused alternative
5. **SEO**: Optimize meta tags, sitemap, robots.txt

### Scale Beyond Free Tier
When you need more:
- **Render**: Upgrade to Starter ($7/month) for no cold starts
- **PostgreSQL**: More storage and connections
- **Cloudinary**: More transformations and bandwidth

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Django Deployment**: https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## 🎓 Portfolio Presentation Tips

When showing to recruiters:

1. **Demonstrate the architecture**:
   - "Backend deployed on Render using PostgreSQL"
   - "Frontend on Netlify with global CDN"
   - "RAG chatbot using Groq API for LLM inference"
   - "Cloudinary for scalable media storage"

2. **Highlight technical decisions**:
   - "Chose Render for free PostgreSQL database"
   - "WhiteNoise for efficient static file serving"
   - "CORS configured for secure API access"
   - "Environment-based configuration for easy deployment"

3. **Show the chatbot**:
   - "RAG system uses embeddings for semantic search"
   - "Cosine similarity matches user queries to products"
   - "Groq provides fast LLM inference"

4. **Address free tier trade-offs**:
   - "Aware of cold start limitations on free tier"
   - "Optimized for production with WhiteNoise and caching"
   - "Can scale to paid tiers as needed"

---

**✨ Congratulations! Your e-commerce store with RAG AI chatbot is now live!**

Share your deployment:
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-app.netlify.app`
- Add to your resume and portfolio! 🚀
