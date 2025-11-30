# Creator Board - Deployment Guide

## Prerequisites
- GitHub account with repository: https://github.com/builtbynidhi/Creator-Board
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)

## 1. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user (username + password)
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Keep this handy for Render configuration

## 2. Backend Deployment (Render)

### Steps:
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `builtbynidhi/Creator-Board`
4. Configure:
   - **Name**: `creator-board-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   
5. Add Environment Variables:
   ```
   MONGO_URL=<your-mongodb-atlas-connection-string>
   DB_NAME=test_database
   CORS_ORIGINS=*
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://creator-board-backend.onrender.com`)

## 3. Frontend Deployment (Vercel)

### Steps:
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `builtbynidhi/Creator-Board`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   ```
   REACT_APP_BACKEND_URL=<your-render-backend-url>
   ```
   Example: `https://creator-board-backend.onrender.com`

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app is live at: `https://your-project.vercel.app`

## 4. Update Frontend API URL

After backend deployment, update the frontend to use the production backend URL:

1. In Vercel dashboard → Settings → Environment Variables
2. Add: `REACT_APP_BACKEND_URL` = `<your-render-backend-url>`
3. Redeploy from Vercel dashboard

## 5. Test Your Deployment

1. Visit your Vercel URL
2. Test "Mini Ad-Script Generator" button
3. Test "AI Job Generator" button
4. Verify generated jobs appear on the board

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure GEMINI_API_KEY is set

### Frontend Issues:
- Check browser console for CORS errors
- Verify REACT_APP_BACKEND_URL is correct
- Check Vercel deployment logs

### CORS Issues:
If you see CORS errors, update backend CORS_ORIGINS to:
```
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

## URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://creator-board-backend.onrender.com`
- **GitHub**: `https://github.com/builtbynidhi/Creator-Board`

## Auto-Deploy

Both Vercel and Render are configured for auto-deploy:
- Push to GitHub → Automatic deployment on both platforms
- No manual intervention needed

## Free Tier Limits

- **Vercel**: Unlimited bandwidth, 100GB/month
- **Render**: 750 hours/month (always-on with free tier)
- **MongoDB Atlas**: 512MB storage

---

🎉 Your Creator Board is now live and production-ready!
