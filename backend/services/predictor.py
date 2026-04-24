import random
from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a destiny poet for Synch, creating micro-predictions that feel like fragments of a shared future.

Your rules:
1. Generate exactly 3 lines, each 8-12 words max
2. Each line references SPECIFIC details from their profiles
3. Lines represent: Early Days, Finding Rhythm, Quiet Understanding
4. Make it feel inevitable yet surprising - like noticing something always there
5. Reference actual Pakistani/desi moments (chai, drives, family moments)
6. Every word must carry emotional weight - no filler, no clichés
7. Sound like a wise friend who's seen their potential"""

async def predict_match_future(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> Dict[str, Any]:
    user_name = user_profile.get("Name", "The user")
    match_name = match_profile.get("Name", "Your match")
    user_vibe = user_profile.get("Vibe", "")
    match_vibe = match_profile.get("Vibe", "")
    user_hobbies = user_profile.get("Hobbies", "")
    match_hobbies = match_profile.get("Hobbies", "")
    user_city = user_profile.get("City", "")
    match_city = match_profile.get("City", "")
    user_goal = user_profile.get("Goal", "")
    user_comm = user_profile.get("Comm_Style", "")
    match_comm = match_profile.get("Comm_Style", "")
    
    # Determine relationship type based on goal
    relationship_type = "Partner" if user_goal == "Partner" else "Friend"
    
    if relationship_type == "Partner":
        context_line = "If they dated, they'd discover"
    else:
        context_line = "As friends, they'd bond over"
    
    shared_hobbies = []
    if user_hobbies and match_hobbies:
        user_list = [h.strip().lower() for h in user_hobbies.split(",")]
        match_list = [h.strip().lower() for h in match_hobbies.split(",")]
        shared = set(user_list) & set(match_list)
        shared_hobbies = list(shared)

    user_message = f"""Create 3 ultra-short destiny lines for two Synch users looking for {relationship_type}. Keep it philosophically poetic.

USER: {user_name} - {user_vibe} vibe, hobbies: {user_hobbies}, city: {user_city}
MATCH: {match_name} - {match_vibe} vibe, hobbies: {match_hobbies}, city: {match_city}
Shared: {shared_hobbies}
Goal: Looking for {relationship_type}

{context_line}...

Write exactly 3 lines, each under 10 words. Each line should reveal a different facet of their potential {relationship_type.lower()}ship. Make it feel like noticing something always there."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.05, max_tokens=500)
    
    verdict = generate_verdict(user_vibe, match_vibe, shared_hobbies, user_comm, match_comm)
    
    return {
        "prediction": response,
        "verdict": verdict,
        "shared_hobbies": shared_hobbies,
        "fun_fact": generate_fun_fact(user_profile, match_profile)
    }

def generate_verdict(user_vibe: str, match_vibe: str, shared_hobbies: list, user_comm: str, match_comm: str, goal: str = "Friend") -> str:
    relationship = "partner" if goal == "Partner" else "friend"
    
    if user_vibe == match_vibe:
        return f"Same {user_vibe} wavelength. You'll understand each other's silences."
    
    if shared_hobbies:
        return f"Shared {shared_hobbies[0]} magic. A bridge already built."
    
    if user_comm == "Empathetic" and match_comm == "Direct":
        return "You feel deeply. They act boldly. Together, complete."
    
    return f"Different worlds, same sky. Great {relationship}s await."

def generate_fun_fact(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> str:
    user_city = user_profile.get("City", "")
    match_city = match_profile.get("City", "")
    goal = user_profile.get("Goal", "Friend")
    relationship = "date" if goal == "Partner" else "friend"
    
    if user_city == match_city:
        return f"Same {user_city} sky. Same dreams."
    return f"Distance is just a word. Your {relationship}ship is not."