# ⚠️ Important: Render Free Tier Memory Optimization

## Problem
The RAG chatbot uses PyTorch and Sentence-Transformers, which are heavy ML libraries. On Render's free tier (512MB RAM), these can cause:
- Worker timeouts during startup
- Out of memory (OOM) errors
- Slow first response times

## Solutions Implemented

### 1. **CPU-Only PyTorch**
Changed from full PyTorch (with CUDA) to CPU-only version:
- **Before**: ~2GB with GPU dependencies
- **After**: ~500MB CPU-only
- **Benefits**: Faster installation, lower memory usage

### 2. **Lazy Loading**
RAG engine now loads **on first use**, not at startup:
- Django starts fast (no ML loading)
- First chatbot request loads the model (takes 10-30 seconds)
- Subsequent requests are fast

### 3. **Increased Timeout**
Gunicorn timeout increased to 120 seconds:
```bash
--timeout 120 --workers 1 --preload
```

### 4. **Single Worker**
Using 1 worker to conserve memory on free tier

## Expected Behavior

### First Deployment
- Build: 5-10 minutes (installing dependencies)
- First startup: Normal (~10 seconds)
- First chatbot request: **10-30 seconds** (loading ML model)
- After that: 1-2 seconds per request

### After Cold Start (15+ min idle)
- Startup: 30-60 seconds (normal for free tier)
- First chatbot request: 10-30 seconds (reloading model)
- Subsequent: Fast

## If Still Having Issues

### Option 1: Remove Knowledge Base Build from Startup
If build still times out, comment out this line in `build.sh`:
```bash
# python manage.py build_knowledge_base
```

Run it manually in Render Shell after deployment:
```bash
python manage.py build_knowledge_base
```

### Option 2: Pre-compute Embeddings
Instead of loading model on each startup, save embeddings to database.

### Option 3: Use Lighter Alternative
Replace sentence-transformers with API-based embeddings:
- Cohere API (free tier)
- Voyage AI (free tier)
- OpenAI embeddings

## Monitoring

Check if ML libraries are causing issues:
```bash
# In Render Shell
python -c "import torch; print('PyTorch OK')"
python -c "from sentence_transformers import SentenceTransformer; print('ST OK')"
```

## Memory Usage Breakdown

| Component | Memory |
|-----------|--------|
| Django + DRF | ~80MB |
| PostgreSQL client | ~20MB |
| Sentence-Transformers | ~150MB |
| PyTorch (CPU) | ~200MB |
| Model (all-MiniLM-L6-v2) | ~80MB |
| **Total** | **~530MB** |

Free tier: 512MB - **This is tight but should work with optimizations**

## Alternative: Upgrade Plan

If free tier continues to have issues:
- **Render Starter**: $7/month, 512MB → no cold starts
- **Render Standard**: $25/month, 2GB → comfortable for ML workloads

---

**Note**: These optimizations make the chatbot work on free tier, but first request will be slower. This is acceptable for a portfolio project. For production, consider paid tier or lighter embedding solution.
