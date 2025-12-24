# ✅ Pre-Deployment Checklist

Use this checklist before deploying to production.

## 📋 Before You Start

### 1. API Keys Ready
- [ ] Cloudinary account created
  - [ ] Cloud Name copied
  - [ ] API Key copied
  - [ ] API Secret copied
- [ ] Groq API account created
  - [ ] API Key generated and copied
- [ ] Django SECRET_KEY generated
  - [ ] Run: `python backend/generate_secret_key.py`
  - [ ] Copy the generated key

### 2. GitHub Repository
- [ ] All code committed to GitHub
- [ ] Repository is public or accessible to Render/Netlify
- [ ] Latest changes pushed to `main` branch

### 3. Accounts Created
- [ ] Render.com account (free)
- [ ] Netlify account (free)
- [ ] Both connected to GitHub

---

## 🗄️ Backend Deployment (Render)

### Database Setup
- [ ] PostgreSQL database created on Render
- [ ] Database name: `ecommerce-db` (or your choice)
- [ ] Internal Database URL copied

### Web Service Configuration
- [ ] Web service created
- [ ] GitHub repository connected
- [ ] Root directory set to: `backend`
- [ ] Build command: `chmod +x build.sh && ./build.sh`
- [ ] Start command: `gunicorn ecommerce_backend.wsgi:application --bind 0.0.0.0:$PORT`

### Environment Variables Set
- [ ] `SECRET_KEY` = (generated key)
- [ ] `DEBUG` = False
- [ ] `PYTHON_VERSION` = 3.11.0
- [ ] `ALLOWED_HOSTS` = (your Render URL)
- [ ] `FRONTEND_URL` = (will update after Netlify)
- [ ] `DATABASE_URL` = (linked to PostgreSQL)
- [ ] `CLOUDINARY_CLOUD_NAME` = (your value)
- [ ] `CLOUDINARY_API_KEY` = (your value)
- [ ] `CLOUDINARY_API_SECRET` = (your value)
- [ ] `GROQ_API_KEY` = (your value)

### Deployment Status
- [ ] First deployment triggered
- [ ] Build logs show no errors
- [ ] Service is "Live" (green status)
- [ ] Backend URL copied (e.g., https://ecommerce-backend.onrender.com)

---

## 🌐 Frontend Deployment (Netlify)

### Site Configuration
- [ ] New site created from GitHub
- [ ] Repository connected
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variable Set
- [ ] `VITE_API_URL` = https://(your-backend).onrender.com/api
  - [ ] Includes `/api` at the end
  - [ ] Uses `https://` protocol

### Deployment Status
- [ ] Build successful
- [ ] Site is published
- [ ] Frontend URL copied (e.g., https://your-app.netlify.app)
- [ ] (Optional) Custom site name configured

---

## 🔗 Final Configuration

### Update Backend with Frontend URL
- [ ] Go back to Render
- [ ] Update `FRONTEND_URL` with Netlify URL
- [ ] Wait for automatic redeployment

### Update ALLOWED_HOSTS
- [ ] Verify `ALLOWED_HOSTS` includes your Render domain
- [ ] Format: `your-app.onrender.com,localhost,127.0.0.1`

---

## 🧪 Testing

### Backend Tests
- [ ] Visit: https://your-backend.onrender.com/api/products/
- [ ] Response shows JSON list of products
- [ ] No errors in response
- [ ] Status code 200

### Frontend Tests
- [ ] Visit: https://your-app.netlify.app
- [ ] Homepage loads without errors
- [ ] Products display with images
- [ ] Navigation works (Products, Cart, etc.)
- [ ] No CORS errors in browser console (F12)

### Chatbot Tests
- [ ] Chatbot icon visible
- [ ] Click chatbot opens chat window
- [ ] Send message: "What organic products do you have?"
- [ ] Chatbot responds with specific product names
- [ ] Chatbot mentions prices
- [ ] Response time < 5 seconds

### Cart & Checkout Tests
- [ ] Add product to cart
- [ ] Cart count updates
- [ ] View cart page
- [ ] Proceed to checkout
- [ ] Place order
- [ ] Order confirmation received

### Image Upload Test (Admin)
- [ ] Access admin: https://your-backend.onrender.com/admin
- [ ] Create superuser if needed (Render Shell)
- [ ] Upload product image
- [ ] Image appears in Cloudinary dashboard
- [ ] Image loads on frontend

---

## 🔍 Browser Console Check

Open browser console (F12) and verify:
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] API calls use HTTPS
- [ ] Images load from Cloudinary CDN

---

## 📱 Mobile Testing

Test on mobile device or browser responsive mode:
- [ ] Homepage responsive
- [ ] Products grid adjusts
- [ ] Navigation menu works
- [ ] Chatbot accessible
- [ ] Cart functions properly

---

## 🐛 Troubleshooting

If something doesn't work, check:

### Backend Issues
- [ ] All environment variables set correctly
- [ ] DATABASE_URL linked to PostgreSQL
- [ ] Build logs show successful completion
- [ ] No red errors in Render logs

### Frontend Issues
- [ ] VITE_API_URL has `/api` at end
- [ ] VITE_API_URL uses `https://` (not `http://`)
- [ ] _redirects file exists in frontend folder
- [ ] Build logs show successful completion

### CORS Issues
- [ ] FRONTEND_URL set in backend environment
- [ ] FRONTEND_URL matches actual Netlify URL
- [ ] No trailing slash in FRONTEND_URL

### Chatbot Issues
- [ ] GROQ_API_KEY set and valid
- [ ] Knowledge base built during deployment
- [ ] Check Render logs for chatbot errors

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Products display with images
- ✅ Chatbot responds accurately
- ✅ Cart and checkout work
- ✅ No CORS errors
- ✅ Mobile responsive
- ✅ All API calls use HTTPS
- ✅ Images load from Cloudinary

---

## 📊 Monitoring

After deployment, monitor:
- [ ] Render service status (should stay green)
- [ ] Netlify deployment status
- [ ] Cloudinary usage (storage, bandwidth)
- [ ] Groq API usage (requests per day)

Set up optional monitoring:
- [ ] UptimeRobot for uptime monitoring
- [ ] Sentry for error tracking
- [ ] Google Analytics for traffic

---

## 📝 Documentation

After successful deployment:
- [ ] Add deployment URLs to README
- [ ] Update portfolio with project
- [ ] Create demo video (optional)
- [ ] Write blog post about RAG implementation (optional)
- [ ] Share on LinkedIn

---

## 🚀 Next Steps

Once everything works:
1. [ ] Test all features thoroughly
2. [ ] Get feedback from friends/colleagues
3. [ ] Add to resume and portfolio
4. [ ] Apply to jobs with live demo link!

---

## 📞 Getting Help

If you encounter issues:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. Review [DEPLOYMENT_QUICKREF.md](DEPLOYMENT_QUICKREF.md)
3. Check Render logs (Dashboard → Logs tab)
4. Check Netlify logs (Site → Deploys → Deploy log)
5. Search GitHub issues for similar problems

---

**Remember**: First deployment can take 5-10 minutes for backend due to:
- Installing Python dependencies (including ML libraries)
- Building knowledge base with embeddings
- Database migrations

Be patient and monitor the logs! 🎯
