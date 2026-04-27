from groq_client import generate_ai_response
from typing import Dict, Any, List
import random

UNIVERSITIES = [
    {"code": "LU", "name": "Lahore University", "city": "Lahore"},
    {"code": "UOK", "name": "University of Karachi", "city": "Karachi"},
    {"code": "PU", "name": "Punjab University", "city": "Lahore"},
    {"code": "NUST", "name": "NUST", "city": "Islamabad"},
    {"code": "GIFT", "name": "GIFT University", "city": "Islamabad"},
    {"code": "COMSATS", "name": "COMSATS", "city": "Islamabad"},
    {"code": "FAST", "name": "FAST-NU", "city": "Lahore"},
    {"code": "BUITEMS", "name": "BUITEMS", "city": "Karachi"},
    {"code": "MULTANUST", "name": "Multan University of Science & Technology", "city": "Multan"},
    {"code": "BZU", "name": "Bahauddin Zakariya University", "city": "Multan"},
    {"code": "USP", "name": "University of Southern Punjab", "city": "Multan"},
]

VIBES = ["GymBro", "Gamer", "Techie", "Artist", "Foodie", "Traveler", "Bookworm", "Fashionista", "Entrepreneur"]

SYSTEM_PROMPT = """You are a university student in Pakistan chatting in a group chat.
Your characteristics:
- University: {university} ({city})
- Vibe: {vibe}
- Personality: {personality}

Rules:
1. Keep messages SHORT (1-2 sentences max)
2. Be natural and conversational
3. Reference your university life when appropriate
4. Use appropriate emojis sparingly
5. Never break character
6. Respond to what others just said in the chat

Personality types: Chill, Enthusiastic, Witty, Supportive, Curious, Direct"""

PERSONALITIES = ["Chill", "Enthusiastic", "Witty", "Supportive", "Curious", "Direct"]

def generate_persona_message(persona: Dict[str, Any], chat_context: str) -> str:
    uni = next((u for u in UNIVERSITIES if u["code"] == persona.get("University", "")), UNIVERSITIES[0])
    
    system = SYSTEM_PROMPT.format(
        university=uni["name"],
        city=uni["city"],
        vibe=persona.get("Vibe", "Techie"),
        personality=persona.get("personality", "Chill")
    )
    
    user_message = f"""In the group chat, write your message responding to:

{chat_context}

Keep it brief and natural like a university student would text."""

    return generate_ai_response(system, user_message, temperature=0.8, max_tokens=50)

def get_random_personas(df, count: int = 5) -> List[Dict[str, Any]]:
    if df.empty:
        return []
    
    sampled = df.sample(min(count, len(df)))
    personas = []
    
    for _, row in sampled.iterrows():
        uni = random.choice(UNIVERSITIES)
        personas.append({
            "Name": row.get("Name", f"User_{row.name}"),
            "Vibe": row.get("Vibe", random.choice(VIBES)),
            "University": uni["code"],
            "UniversityName": uni["name"],
            "City": uni["city"],
            "Hobbies": row.get("Hobbies", ""),
            "personality": random.choice(PERSONALITIES)
        })
    
    return personas

async def generate_chat_round(personas: List[Dict[str, Any]], chat_history: List[Dict[str, Any]], user_participating: bool = False) -> List[Dict[str, Any]]:
    messages = []
    
    if not user_participating:
        chat_context = "This is the start of the conversation"
    else:
        chat_context = "\n".join([
            f"{m['name']}: {m['message']}" 
            for m in chat_history[-5:] if m.get("type") == "user"
        ])
        if not chat_context:
            chat_context = "A new user just joined and said hello"
    
    for i, persona in enumerate(personas):
        try:
            message = generate_persona_message(persona, chat_context)
            messages.append({
                "id": i,
                "name": persona["Name"],
                "university": persona["University"],
                "university_name": persona["UniversityName"],
                "city": persona["City"],
                "vibe": persona["Vibe"],
                "message": message,
                "timestamp": "Just now"
            })
        except Exception as e:
            messages.append({
                "id": i,
                "name": persona["Name"],
                "university": persona["University"],
                "university_name": persona["UniversityName"],
                "city": persona["City"],
                "vibe": persona["Vibe"],
                "message": f"Hey everyone! 👋",
                "timestamp": "Just now"
            })
    
    return messages