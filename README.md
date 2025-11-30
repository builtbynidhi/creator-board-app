# Creator Board App 🚀

A modern job board application with AI-powered job posting and marketing script generation. Built for content creators and hiring managers to streamline their workflow.

## 🌐 Live Demo

- **Frontend**: [https://creator-board-app-cfp3.vercel.app/](https://creator-board-app-cfp3.vercel.app/)
- **Backend API**: [https://creator-board-backend.onrender.com](https://creator-board-backend.onrender.com)

## ✨ Features

### 🎯 Job Board Management
- **Browse Job Postings**: View all available creator job opportunities
- **Filter & Sort**: Filter by job type, location, and sort by various criteria
- **Detailed Job View**: Click any job card to see full details
- **Apply to Jobs**: Quick apply functionality with toast notifications

### 🤖 AI-Powered Tools

#### AI Job Generator
- Generate comprehensive job postings using AI
- Input: Job title, company name, target profile, and tone
- Output: Complete job description with:
  - Key responsibilities
  - Required skills
  - Nice-to-have qualifications
  - Why join us section
  - Salary range and location
- One-click to add generated jobs to the board

#### AI Script Generator
- Create marketing scripts for social media content
- Input: Product name, target audience, and tone
- Output: Complete marketing script with:
  - Visual hook suggestions
  - Hook, body, and CTA sections
  - Estimated video duration
- Copy to clipboard functionality

### 🎨 User Experience
- Modern, responsive design with Tailwind CSS
- Dark/light mode compatible
- Toast notifications for user feedback
- Smooth animations and transitions
- Mobile-friendly interface

## 📖 User Guide

### How to Browse Jobs

1. **View All Jobs**: The homepage displays all available job postings as cards
2. **Filter Jobs**: 
   - Use the "Filter by Type" dropdown to filter (Full-time, Part-time, Contract, Freelance)
   - Use the "Filter by Location" dropdown to filter by location
3. **Sort Jobs**: Choose from "Most Recent", "Highest Paid", or "Alphabetical"
4. **View Details**: Click on any job card to open a detailed modal view
5. **Apply**: Click the "Apply Now" button in the job details modal

### How to Generate Jobs with AI

1. **Open Generator**: Click the "✨ AI Job Generator" button in the navbar
2. **Fill Details**:
   - Enter job title (e.g., "Senior Content Creator")
   - Enter company name
   - Describe target profile
   - Select tone (Professional, Casual, Exciting, Formal, Friendly)
3. **Generate**: Click "Generate Job" and wait for AI to create the posting
4. **Review**: Review the generated job description
5. **Add to Board**: Click "Done" to add the job to the main board, or "Generate Another" for a new one

### How to Generate Marketing Scripts

1. **Open Generator**: Click the "✨ AI Script Generator" button in the navbar
2. **Fill Details**:
   - Enter product name
   - Describe target audience
   - Select tone
3. **Generate**: Click "Generate Script" and wait for AI
4. **Copy**: Use the copy buttons to copy individual sections or the entire script
5. **Use**: Use the generated script for your content creation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Navigation
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Motor** - MongoDB async driver
- **Google Gemini AI** - AI text generation
- **Uvicorn** - ASGI server

### Database
- **MongoDB Atlas** - Cloud database

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 🚀 Local Development

### Prerequisites
- Node.js 16+
- Python 3.9+
- MongoDB (or MongoDB Atlas account)
- Google Gemini API key

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload
```

The API will run on `http://localhost:8000`

### Environment Variables

#### Frontend (`.env`)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### Backend (`backend/.env`)
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
CORS_ORIGINS=*
GEMINI_API_KEY=your_gemini_api_key
```

## 📁 Project Structure

```
creator-board-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FilterBar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobGrid.jsx
│   │   │   ├── JobModal.jsx
│   │   │   ├── JobGeneratorModal.jsx
│   │   │   ├── ScriptGeneratorModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ui/        # Reusable UI components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── backend/               # FastAPI backend
│   ├── server.py         # Main API server
│   ├── llm_service.py    # AI generation service
│   └── requirements.txt
└── README.md
```

## 🌍 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `REACT_APP_BACKEND_URL`
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables:
   - `MONGO_URL`
   - `DB_NAME`
   - `CORS_ORIGINS`
   - `GEMINI_API_KEY`
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or feedback, reach out to:
- GitHub: [@builtbynidhi](https://github.com/builtbynidhi)
- Email: builtbynidhi@gmail.com

---

Built with ❤️ by Nidhi
