# Synch
Vibe-Matching App with AI-Powered Features

## Quick Start (New PC / Fresh Setup)

```bash
setup_and_run.bat
```

This master script will:
1. **Auto-detect** Python and Node.js
2. **Setup Backend**: Create virtual environment and install requirements
3. **Setup Frontend**: Install npm dependencies
4. **Initialize Security**: Create `.env` placeholders
5. **Launch**: Start both servers on ports 8001 (API) and 3000 (UI)

> [!IMPORTANT]
> After running the script for the first time, open `backend/.env` and paste your **Groq API Key** to enable AI features!

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

## Features

### Core Matching
- **Vibe Selection**: Choose from GymBro, Gamer, Techie, Artist, Foodie, Traveler, Bookworm, Fashionista, Entrepreneur
- **Hobbies Selection**: Multiple selection with visual feedback
- **City Filter**: 10 major Pakistani cities
- **Lifestyle Preferences**: Religiosity, Diet, Smoking, Communication Style
- **ML-Powered Matching**: Compatibility scoring based on 30,000+ profiles

### AI Features (Toggle ON/OFF)
- **Vibe Quiz**: 5-question psychographic quiz for smarter matching
- **Why Match?**: AI-generated explanation of compatibility
- **Wavelength**: Radar chart visualization of 5 dimensions (Vibe Sync, Lifestyle, Communication, Goals, Curiosity)
- **Predict**: Philosophically poetic 3-line destiny prediction
- **Icebreakers**: AI-generated conversation starters (Curious/Warm/Brave styles)

### UI/UX
- iOS-inspired design with glassmorphism
- Dark/Light mode support
- Smooth animations with Framer Motion
- Responsive layout

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats` | Community insights (top hobbies, vibes) |
| `POST /api/match` | Find compatible profiles |
| `POST /api/quiz/submit` | Submit quiz answers for psychographic profile |
| `POST /api/explain-match` | AI explanation of why you match |
| `POST /api/icebreakers` | AI-generated conversation starters |
| `POST /api/wavelength` | Compatibility radar chart data |
| `POST /api/predict` | AI destiny prediction |

## Tech Stack
- **Frontend**: Next.js 16, React 19, TailwindCSS 4, Framer Motion, Recharts
- **Backend**: FastAPI, scikit-learn, pandas, Groq AI
- **Database**: CSV-based (30,000 profiles)

## Environment Variables

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Project Structure

```
Synch/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── algo.py           # Matching algorithm
│   ├── groq_client.py    # Groq AI client
│   ├── services/         # AI services
│   │   ├── explainer.py
│   │   ├── icebreakers.py
│   │   ├── predictor.py
│   │   └── wavelength.py
│   ├── ml/               # ML components
│   └── data/             # Dataset
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # API utilities
│   └── package.json
├── run_synch.bat         # Quick start script
└── README.md
```