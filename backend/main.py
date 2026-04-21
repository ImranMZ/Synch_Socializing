from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from algo import MatchEngine

app = FastAPI(title="Synch API", description="Vibe-Matching Backend")

# Allow CORS for Next.js frontend
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Synch API", "total_profiles": len(df)}

@app.get("/api/stats")
def get_stats():
    if engine is None:
        return {"error": "Dataset or MatchEngine not loaded."}
    return engine.get_stats()

@app.post("/api/match")
def match_profiles(profile: UserProfile):
    if engine is None:
        return {"error": "Dataset or MatchEngine not loaded."}
    
    top_matches = engine.find_matches(profile.dict())
    return top_matches
