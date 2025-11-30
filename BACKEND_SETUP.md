# Backend Setup Instructions

## 1. Get Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key" in the top-right
3. Create a new API key (free tier available)
4. Copy your API key

## 2. Update .env File

Update `/backend/.env` with your API key:

```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
GEMINI_API_KEY="your-actual-api-key-here"
```

## 3. Backend is Ready!

The backend now has the following LLM-integrated endpoints:

### Endpoints

#### 1. Generate Video Script
**POST** `/api/generate-script`

Input:
```json
{
  "product_name": "Spicy Mango Pickle",
  "target_audience": "College students",
  "tone": "Funny"
}
```

Output:
```json
{
  "script": "Full 30-second script",
  "visual_hook": "Close-up of jar opening",
  "hook": "First 2-3 seconds",
  "body": "Main message",
  "cta": "Call to action",
  "estimated_duration": 30
}
```

#### 2. Generate Complete Job Posting
**POST** `/api/generate-job`

Input:
```json
{
  "job_title": "Content Creator",
  "company": "BrandX",
  "target_profile": "Experienced video creator",
  "tone": "Professional",
  "product_name": "Spicy Mango Pickle",
  "target_audience": "College students",
  "script_tone": "Funny"
}
```

Output: Complete job posting with all details + optional marketing script

#### 3. Get All Jobs
**GET** `/api/jobs`

#### 4. Get Single Job
**GET** `/api/jobs/{job_id}`

## 4. Test with Curl

```bash
curl -X POST http://localhost:8000/api/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Spicy Mango Pickle",
    "target_audience": "College students",
    "tone": "Funny"
  }'
```

## Files Changed
- `backend/llm_service.py` - New LLM service
- `backend/server.py` - Updated with new endpoints
- `backend/.env` - Added GEMINI_API_KEY
- `backend/requirements.txt` - Added google-generativeai

Backend is ready for integration!
