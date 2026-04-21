from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a poetic matchmaker for Synch, a Pakistani dating app. 
Speak in short, philosophically poetic lines that reveal hidden connections.

Your rules:
1. Be SPECIFIC - use actual details from profiles
2. Find 1-2 genuine shared traits or complementary differences
3. Add one poetic observation about their potential connection
4. Keep it under 3 lines maximum
5. Make each line meaningful and concise
6. Reference shared human experiences, not just hobbies
7. Speak like a wise friend sharing insight
8. Make it feel personal and unique"""

async def get_match_explanation(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> str:
    user_vibe = user_profile.get("Vibe", "unknown")
    user_hobbies = user_profile.get("Hobbies", "")
    user_comm = user_profile.get("Comm_Style", "")
    user_goal = user_profile.get("Goal", "")
    
    match_vibe = match_profile.get("Vibe", "unknown")
    match_hobbies = match_profile.get("Hobbies", "")
    match_comm = match_profile.get("Comm_Style", "")
    match_name = match_profile.get("Name", "this person")
    
    shared_vibes = []
    if user_vibe and match_vibe:
        if user_vibe.lower() == match_vibe.lower():
            shared_vibes.append(f"you're both '{user_vibe}' energy")
    
    shared_hobbies = []
    if user_hobbies and match_hobbies:
        user_hobby_list = [h.strip().lower() for h in user_hobbies.split(",")]
        match_hobby_list = [h.strip().lower() for h in match_hobbies.split(",")]
        shared = set(user_hobby_list) & set(match_hobby_list)
        if shared:
            shared_hobbies = list(shared)
    
    user_message = f"""Analyze why these two Synch users would be a great match:

USER: Looking for {user_goal}, has '{user_vibe}' vibe, hobbies: {user_hobbies}, communication style: {user_comm}

MATCH: {match_name}, has '{match_vibe}' vibe, hobbies: {match_hobbies}, communication style: {match_comm}

Shared vibes: {shared_vibes}
Shared hobbies: {shared_hobbies}

Write a personalized explanation of why they sync well. Be specific, witty, and unique. Reference their actual preferences, not generic ones."""

    return await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=0.95, max_tokens=200)
