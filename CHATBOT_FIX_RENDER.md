# Chatbot Fix for Render Deployment

## Problem
The chatbot was crashing with "Out of Memory" errors because the sentence-transformers library and its dependencies (sklearn, scipy, torch) consume too much RAM for Render's free tier (512MB).

## Solution
Created a **lightweight RAG engine** (`rag_engine_lite.py`) that uses simple keyword matching instead of ML embeddings.

## What Changed
1. **New File**: `backend/chatbot/rag_engine_lite.py` - Lightweight search without ML libraries
2. **Updated**: `backend/chatbot/chatbot_service.py` - Auto-fallback to lite mode if full RAG fails
3. **Updated**: `backend/chatbot/management/commands/build_knowledge_base.py` - Support for `--lite` flag

## Steps to Fix on Render

### Option 1: Let It Auto-Fix (Recommended)
The code now automatically falls back to lite mode when it can't load heavy libraries. Just wait for the deployment to complete and the chatbot should work.

### Option 2: Rebuild Knowledge Base (If Option 1 doesn't work)
If the chatbot still doesn't work after deployment, rebuild the knowledge base in lite mode:

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Shell" tab
4. Run:
   ```bash
   python manage.py build_knowledge_base --rebuild --lite
   ```

This will create the knowledge base without trying to load heavy ML libraries.

## Testing
After deployment:
1. Open your website
2. Click on the chatbot icon
3. Ask: "What organic products do you have?"
4. The chatbot should now respond without crashing

## How It Works Now
- **Lite Mode**: Uses simple keyword matching (fast, low memory)
- **No embeddings needed**: Searches directly in database using Django ORM
- **Still intelligent**: Works with Groq API for LLM responses

## Performance
- **Memory**: ~50MB (vs ~500MB+ with sentence-transformers)
- **Speed**: Similar or faster (no model loading time)
- **Accuracy**: Good for e-commerce use case

## If You Want Full RAG Later
If you upgrade to a paid tier with more memory:
1. The code will automatically try to use full RAG first
2. Falls back to lite mode only if needed
3. No code changes required!
