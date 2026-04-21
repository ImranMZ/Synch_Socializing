import numpy as np
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class QuizAnswer(BaseModel):
    question_id: str
    answer: str

class PsychographicProfile(BaseModel):
    nocturnality: float = 0.5
    social_energy: float = 0.5
    spontaneity: float = 0.5
    depth: float = 0.5
    assertiveness: float = 0.5
    
    def to_weight_vector(self) -> Dict[str, float]:
        return {
            "nocturnality": self.nocturnality,
            "social_energy": self.social_energy,
            "spontaneity": self.spontaneity,
            "depth": self.depth,
            "assertiveness": self.assertiveness
        }

QUIZ_QUESTIONS = [
    {
        "id": "energy",
        "question": "When are you most productive?",
        "options": [
            {"id": "a", "text": "Late night - code runs better when the world sleeps", "nocturnality": 0.9, "spontaneity": 0.3},
            {"id": "b", "text": "Early morning - 5 AM is my peak time", "nocturnality": 0.1, "spontaneity": 0.7},
            {"id": "c", "text": "Whenever inspiration hits - I'm flexible", "nocturnality": 0.5, "spontaneity": 0.9},
        ]
    },
    {
        "id": "social",
        "question": "Your ideal social setup?",
        "options": [
            {"id": "a", "text": "House party with 50+ people - more the merrier", "social_energy": 0.9, "depth": 0.3},
            {"id": "b", "text": "One-on-one deep conversation", "social_energy": 0.2, "depth": 0.9},
            {"id": "c", "text": "Small group of 4-5 close friends", "social_energy": 0.5, "depth": 0.6},
        ]
    },
    {
        "id": "decision",
        "question": "How do you make decisions?",
        "options": [
            {"id": "a", "text": "Go with the flow - plans are suggestions", "spontaneity": 0.9, "assertiveness": 0.3},
            {"id": "b", "text": "Research everything - informed decisions only", "spontaneity": 0.1, "assertiveness": 0.7},
            {"id": "c", "text": "Trust my gut and decide fast", "spontaneity": 0.8, "assertiveness": 0.8},
        ]
    },
    {
        "id": "depth",
        "question": "Conversation style?",
        "options": [
            {"id": "a", "text": "Keep it light - surface level is fine", "depth": 0.2, "social_energy": 0.7},
            {"id": "b", "text": "I love deep talks about anything and everything", "depth": 0.9, "social_energy": 0.3},
            {"id": "c", "text": "Depends on the person and mood", "depth": 0.5, "social_energy": 0.5},
        ]
    },
    {
        "id": "risk",
        "question": "Your approach to new experiences?",
        "options": [
            {"id": "a", "text": "Adventurous - try everything once", "spontaneity": 0.95, "assertiveness": 0.6},
            {"id": "b", "text": "Calculated risks only - need to plan", "spontaneity": 0.15, "assertiveness": 0.8},
            {"id": "c", "text": "Depends on my mood and the stakes", "spontaneity": 0.5, "assertiveness": 0.5},
        ]
    },
]

def process_quiz_answers(answers: List[QuizAnswer]) -> PsychographicProfile:
    scores = {
        "nocturnality": [],
        "social_energy": [],
        "spontaneity": [],
        "depth": [],
        "assertiveness": []
    }
    
    for answer in answers:
        q = next((q for q in QUIZ_QUESTIONS if q["id"] == answer.question_id), None)
        if q:
            option = next((o for o in q["options"] if o["id"] == answer.answer), None)
            if option:
                if "nocturnality" in option:
                    scores["nocturnality"].append(option["nocturnality"])
                if "social_energy" in option:
                    scores["social_energy"].append(option["social_energy"])
                if "spontaneity" in option:
                    scores["spontaneity"].append(option["spontaneity"])
                if "depth" in option:
                    scores["depth"].append(option["depth"])
                if "assertiveness" in option:
                    scores["assertiveness"].append(option["assertiveness"])
    
    profile = PsychographicProfile(
        nocturnality=np.mean(scores["nocturnality"]) if scores["nocturnality"] else 0.5,
        social_energy=np.mean(scores["social_energy"]) if scores["social_energy"] else 0.5,
        spontaneity=np.mean(scores["spontaneity"]) if scores["spontaneity"] else 0.5,
        depth=np.mean(scores["depth"]) if scores["depth"] else 0.5,
        assertiveness=np.mean(scores["assertiveness"]) if scores["assertiveness"] else 0.5,
    )
    
    return profile

def get_quiz_questions() -> List[Dict[str, Any]]:
    return QUIZ_QUESTIONS

def apply_psychographic_weights(base_scores: np.ndarray, profile: PsychographicProfile, weight_strength: float = 0.15) -> np.ndarray:
    weights = np.array([
        profile.nocturnality,
        profile.social_energy,
        profile.spontaneity,
        profile.depth,
        profile.assertiveness
    ])
    
    normalized_weights = (weights - 0.5) * weight_strength + 1.0
    
    if len(base_scores) >= 5:
        normalized_weights = np.pad(normalized_weights, (0, len(base_scores) - 5), mode='edge')
    elif len(base_scores) < 5:
        normalized_weights = normalized_weights[:len(base_scores)]
    
    return base_scores * normalized_weights
