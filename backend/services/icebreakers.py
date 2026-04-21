from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a conversation poet for Synch, creating ice-breakers that feel like haikus of human connection.

Your rules:
1. Generate 3 ultra-concise options (max 8 words each)
2. Each must reference SPECIFIC profile details
3. Styles:
   - 💭 Curious: A thoughtful question that invites sharing
   - 😂 Warm: A light-hearted observation that brings smiles  
   - 🔥 Brave: A direct but kind opener that sparks dialogue
4. Make each feel like it was crafted for THIS specific person
5. Reference actual Pakistani/desi life when relevant
6. Every word must carry weight - no fluff"""

async def get_conversation_starters(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> Dict[str, str]:
    user_hobbies = user_profile.get("Hobbies", "")
    user_vibe = user_profile.get("Vibe", "")
    user_comm = user_profile.get("Comm_Style", "")
    
    match_name = match_profile.get("Name", "them")
    match_vibe = match_profile.get("Vibe", "")
    match_hobbies = match_profile.get("Hobbies", "")
    match_comm = match_profile.get("Comm_Style", "")
    match_location = match_profile.get("City", "")
    match_relig = match_profile.get("Religiosity", "")
    match_diet = match_profile.get("Diet", "")
    
    shared_hobbies = []
    if user_hobbies and match_hobbies:
        user_list = [h.strip().lower() for h in user_hobbies.split(",")]
        match_list = [h.strip().lower() for h in match_hobbies.split(",")]
        shared = set(user_list) & set(match_list)
        shared_hobbies = list(shared)
    
    user_message = f"""Generate 3 unique conversation starters for Synch users who just matched:

USER: Vibe: {user_vibe}, Hobbies: {user_hobbies}, Communication: {user_comm}

MATCH: {match_name} from {match_location}
- Vibe: {match_vibe}
- Hobbies: {match_hobbies}
- Communication: {match_comm}
- Religiosity: {match_relig}
- Diet: {match_diet}

Shared interests: {shared_hobbies}

Format your response EXACTLY like this (3 lines, labeled):
💭 CURIOUS: [first ice-breaker]
😂 FUNNY: [second ice-breaker]
🔥 BOLD: [third ice-breaker]

Each must be unique, personalized, and conversation-worthy."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.0, max_tokens=300)
    
    starters = {"curious": "", "funny": "", "bold": ""}
    
    for line in response.split("\n"):
        line = line.strip()
        if line.startswith("💭") or line.startswith("CURIOUS:"):
            starters["curious"] = line.split(":", 1)[-1].strip() if ":" in line else line
        elif line.startswith("😂") or line.startswith("FUNNY:"):
            starters["funny"] = line.split(":", 1)[-1].strip() if ":" in line else line
        elif line.startswith("🔥") or line.startswith("BOLD:"):
            starters["bold"] = line.split(":", 1)[-1].strip() if ":" in line else line
    
    if not any(starters.values()):
        starters["curious"] = f"What's something about {match_vibe} culture you've been curious about?"
        starters["funny"] = "Be honest: is your current playlist embarrassing?"
        starters["bold"] = f"If you could change one thing about dating culture here, what would it be?"
    
    return starters