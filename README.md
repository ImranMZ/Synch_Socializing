# Synch
Vibe-Matching App

## Quick Start

```bash
run_synch.bat
```

This will:
1. Clean up existing processes on ports 3000 and 8000
2. Start the backend server (FastAPI on port 8000)
3. Start the frontend server (Next.js on port 3000)
4. Open Chrome with the app

## Manual Setup

### Backend
```bash
cd backend
python -m venv ../venv
../venv/Scripts/python.exe -m pip install -r requirements.txt
../venv/Scripts/python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: FastAPI, scikit-learn, pandas
