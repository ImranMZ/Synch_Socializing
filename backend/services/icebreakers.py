from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a creative conversation coach for Synch, a Pakistani dating app. 
You generate unique, personalized ice-breakers that actually start real conversations.

Your rules:
1. NEVER use pickup lines or clichés - "Hey" doesn't count
2. Each ice-breaker must reference SPECIFIC things from their profiles
3. Generate exactly 3 options, one for each style:
   - 💭 Curious: A question that makes them think/share
   - 😂 Funny: Something that makes them laugh or smile
   - 🔥 Bold: Direct, conversation-skipping opener
4. Make them feel like YOU wrote this for THIS specific person
5. Include playful emojis only if natural
6. Keep each ice-breaker to 1-2 sentences max
7. Reference Pakistani life naturally when possible
8. Vary the tone - don't repeat patterns"""

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