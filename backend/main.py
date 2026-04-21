from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from algo import MatchEngine

app = FastAPI(title="Synch API", description="Vibe-Matching Backend with AI Features")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "dataset.csv")

try:
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} profiles from dataset.")
    engine = MatchEngine(df)
    print("MatchEngine initialized successfully.")
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()
    engine = None

class UserProfile(BaseModel):
    Vibe: str = ""
    Goal: str = ""
    Hobbies: str = ""
    Smoking: str = ""
    Diet: str = ""
    Religiosity: str = ""
    Comm_Style: str = ""
    City: str = ""
    strict_city: bool = False

class QuizAnswer(BaseModel):
    question_id: str
    answer: str

class PsychographicRequest(BaseModel):
    profile: UserProfile
    quiz_answers: list[QuizAnswer]

class MatchRequest(BaseModel):
    user_profile: UserProfile
    match_profile: dict

class QuizWithProfileRequest(BaseModel):
    profile: UserProfile
    quiz_answers: list

@app.get("/")
def read_root():
    return {"message": "Welcome to Synch API", "total_profiles": len(df)}

@app.get("/api/stats")
def get_stats():
    if engine is None:
        return {"error": "Dataset or MatchEngine not loaded."}
    return engine.get_stats()

@app.post("/api/match")
def match_profiles(request: dict):
    if engine is None:
        return {"error": "Dataset or MatchEngine not loaded."}
    
    profile = UserProfile(**request)
    psycho_profile = None
    
    top_matches = engine.find_matches(profile.dict(), psychographic_profile=psycho_profile)
    return top_matches

from ml.quiz_engine import get_quiz_questions, process_quiz_answers

@app.get("/api/quiz/questions")
def get_quiz():
    return {"questions": get_quiz_questions()}

@app.post("/api/quiz/submit")
def submit_quiz(request: PsychographicRequest):
    profile = process_quiz_answers(request.quiz_answers)
    return {
        "psychographic_profile": profile.to_weight_vector(),
        "message": "Quiz completed! Your matching just got smarter."
    }

from services.explainer import get_match_explanation
from services.icebreakers import get_conversation_starters
from services.persona import generate_persona
from services.bio_gen import generate_bio
from services.detector import analyze_dealbreakers
from services.discovery import discover_interests
from services.wavelength import calculate_wavelength
from services.predictor import predict_match_future

@app.post("/api/explain-match")
async def explain_match(request: MatchRequest):
    explanation = await get_match_explanation(request.user_profile.dict(), request.match_profile)
    return {"explanation": explanation}

@app.post("/api/icebreakers")
async def get_icebreakers(request: MatchRequest):
    starters = await get_conversation_starters(request.user_profile.dict(), request.match_profile)
    return starters

@app.post("/api/persona")
async def get_persona(request: QuizWithProfileRequest):
    persona = await generate_persona(request.profile.dict(), request.quiz_answers)
    return persona

@app.post("/api/bio-generator")
async def create_bio(profile: UserProfile):
    bios = await generate_bio(profile.dict(), "warm")
    return bios

@app.post("/api/dealbreakers")
async def get_dealbreakers(profile: UserProfile):
    result = await analyze_dealbreakers(profile.dict(), df)
    return result

@app.post("/api/discover")
async def get_discovery(profile: UserProfile):
    result = await discover_interests(profile.dict())
    return result

@app.post("/api/wavelength")
async def get_wavelength(request: MatchRequest):
    result = await calculate_wavelength(request.user_profile.dict(), request.match_profile)
    return result

@app.post("/api/predict")
async def get_prediction(request: MatchRequest):
    result = await predict_match_future(request.user_profile.dict(), request.match_profile)
    return result
