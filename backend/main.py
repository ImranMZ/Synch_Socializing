import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
from algo import MatchEngine

app = FastAPI(title="Synch API", description="Vibe-Matching Backend with AI Features")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
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
    Gender: str = ""
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
def match_profiles(request: UserProfile, psychographic: str = None):
    if engine is None:
        return {"error": "Dataset or MatchEngine not loaded."}
    
    psycho_profile = None
    if psychographic:
        try:
            psycho_profile = json.loads(psychographic)
        except Exception as e:
            print(f"Error parsing psychographic: {e}")
    
    top_matches = engine.find_matches(request.dict(), psychographic_profile=psycho_profile)
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
from services.hidden_truth import generate_hidden_truth

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

@app.post("/api/hidden-truth")
async def get_hidden_truth(request: QuizWithProfileRequest):
    # Convert list of quiz answers to a dict for the prompt
    quiz_dict = {}
    questions = get_quiz_questions()
    
    for ans in request.quiz_answers:
        qid = None
        aid = None
        
        if isinstance(ans, dict):
            qid = ans.get("question_id")
            aid = ans.get("answer")
        elif hasattr(ans, "question_id"):
            qid = ans.question_id
            aid = ans.answer
            
        if qid and aid:
            # Find the question and option text
            q = next((q for q in questions if q["id"] == qid), None)
            if q:
                opt = next((o for o in q["options"] if o["id"] == aid), None)
                if opt:
                    quiz_dict[qid] = opt["text"]
                else:
                    quiz_dict[qid] = aid
            else:
                quiz_dict[qid] = aid
            
    result = await generate_hidden_truth(request.profile.dict(), quiz_dict)
    return result

@app.post("/api/chat/personas")
async def get_chat_personas():
    from services.chat import get_mock_personas
    personas = get_mock_personas(5)
    return personas

@app.post("/api/chat/initial")
async def get_initial_messages(request: dict):
    """Get initial intro messages from first 2 personas"""
    from services.chat import get_mock_personas, get_initial_messages
    
    try:
        personas = request.get("personas", [])
        if not personas or len(personas) == 0:
            personas = get_mock_personas(5)
        
        messages = get_initial_messages(personas)
        return {"messages": messages, "personas": personas, "success": True}
    except Exception as e:
        print(f"Initial messages error: {e}")
        return {"messages": [], "personas": [], "success": False, "error": str(e)}

@app.post("/api/chat/simulate")
async def simulate_chat_round(request: dict):
    """Get ONE response from the persona whose turn it is"""
    from services.chat import get_mock_personas, generate_chat_round
    
    try:
        personas = request.get("personas", [])
        if not personas or len(personas) == 0:
            personas = get_mock_personas(5)
        
        chat_history = request.get("history", [])
        user_participating = request.get("user_participating", False)
        user_message = request.get("user_message", "")
        turn_index = request.get("turn_index", 0)
        
        if user_message:
            chat_history.append({
                "type": "user",
                "name": "You",
                "message": user_message
            })
        
        # Generate ONE message for the current turn
        messages = generate_chat_round(personas, chat_history, user_participating, turn_index)
        
        # Calculate next turn index
        next_turn = (turn_index + 1) % len(personas)
        
        return {
            "messages": messages, 
            "personas": personas, 
            "success": True,
            "next_turn": next_turn
        }
    except Exception as e:
        print(f"Chat simulate error: {e}")
        return {"messages": [], "personas": [], "success": False, "error": str(e)}

@app.post("/api/chat/direct")
async def direct_chat(request: dict):
    from services.direct_chat import generate_direct_chat_response
    
    match_data = request.get("match_data", {})
    chat_history = request.get("chat_history", [])
    
    response = await generate_direct_chat_response(match_data, chat_history)
    return {"response": response}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8001)
