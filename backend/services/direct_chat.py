from groq_client import generate_ai_response
from typing import Dict, Any, List

VIBES = ["GymBro", "Gamer", "Techie", "Artist", "Foodie", "Traveler", "Bookworm", "Fashionista", "Entrepreneur"]

SYSTEM_PROMPT = """You are {name}, a {age} year old {gender} from {city}, Pakistan.
You're chatting with someone new for the first time on Synch, a Pakistani dating app.

About you:
- University: {university}
- Vibe: {vibe}
- Profession: {profession}
- Education: {education}
- Hobbies: {hobbies}
- Lifestyle: {lifestyle}
- Communication style: {comm_style}

Rules:
1. Keep responses SHORT and conversational (1-3 sentences)
2. Be natural, friendly, and slightly flirty but respectful
3. Reference your background naturally when appropriate
4. Ask questions to keep conversation flowing
5. NEVER break character
6. Response as if meeting for the first time - be curious about them
7. Use appropriate emojis sparingly

Start with a warm, genuine response to their message."""

def get_lifestyle_summary(match_data: Dict[str, Any]) -> str:
    lifestyle = []
    if match_data.get("Smoking"):
        lifestyle.append(f"smokes {match_data['Smoking']}")
    if match_data.get("Diet"):
        lifestyle.append(f"eats {match_data['Diet']}")
    if match_data.get("Religiosity"):
        lifestyle.append(match_data['Religiosity'])
    return ", ".join(lifestyle) if lifestyle else "casual"

async def generate_direct_chat_response(match_data: Dict[str, Any], chat_history: List[Dict[str, Any]]) -> str:
    name = match_data.get("Name", "Someone")
    age = match_data.get("Age", "someone")
    gender = match_data.get("Gender", "person")
    city = match_data.get("City", "a city")
    university = match_data.get("University", "a university")
    vibe = match_data.get("Vibe", "chill")
    profession = match_data.get("Profession", "student")
    education = match_data.get("Education", "educated")
    hobbies = match_data.get("Hobbies", "various stuff")
    comm_style = match_data.get("Comm_Style", "friendly")
    lifestyle = get_lifestyle_summary(match_data)
    
    system = SYSTEM_PROMPT.format(
        name=name,
        age=age,
        gender=gender,
        city=city,
        university=university,
        vibe=vibe,
        profession=profession,
        education=education,
        hobbies=hobbies,
        lifestyle=lifestyle,
        comm_style=comm_style
    )
    
    history_text = ""
    if chat_history:
        history_text = "\n".join([
            f"{'You' if msg.get('role') == 'user' else name}: {msg.get('content', '')}"
            for msg in chat_history[-6:]
        ])
    
    user_message = chat_history[-1].get("content", "") if chat_history else ""
    
    user_prompt = f"""Continue the conversation naturally. Here's the recent chat:

{history_text}

Your response:"""

    return generate_ai_response(system, user_prompt, temperature=0.7, max_tokens=80)