from groq_client import generate_ai_response
from typing import Dict, Any
import random
import math

SYSTEM_PROMPT = """You are a compatibility analyst for Synch, a Pakistani dating app.
You analyze match dimensions and provide a detailed "wavelength breakdown" - like a radar chart of compatibility.

Your rules:
1. Score 5 dimensions: Vibe Sync, Lifestyle, Communication, Goals, Curiosity
2. Each score should be 60-98% (realistic, not 100%)
3. Provide short explanations for each dimension
4. Calculate an overall weighted score
5. Make it feel like a fun compatibility test, not a clinical analysis
6. Keep explanations punchy - 1-2 sentences each
7. Reference actual profile details"""

async def calculate_wavelength(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> Dict[str, Any]:
    user_vibe = user_profile.get("Vibe", "")
    match_vibe = match_profile.get("Vibe", "")
    user_comm = user_profile.get("Comm_Style", "")
    match_comm = match_profile.get("Comm_Style", "")
    user_goal = user_profile.get("Goal", "")
    match_goal = match_profile.get("Goal", "")
    user_city = user_profile.get("City", "")
    match_city = match_profile.get("City", "")
    
    base_vibe_score = 75
    if user_vibe.lower() == match_vibe.lower():
        base_vibe_score = random.randint(88, 96)
    else:
        complementary_vibes = {
            ("Gamer", "Techie"): True,
            ("GymBro", "Techie"): True,
            ("Artist", "Gamer"): True,
            ("Foodie", "Traveler"): True,
            ("Bookworm", "Techie"): True,
        }
        if (user_vibe, match_vibe) in complementary_vibes or (match_vibe, user_vibe) in complementary_vibes:
            base_vibe_score = random.randint(82, 92)
        else:
            base_vibe_score = random.randint(70, 82)
    
    lifestyle_score = random.randint(72, 88)
    if user_city.lower() == match_city.lower():
        lifestyle_score = random.randint(80, 92)
    
    comm_scores = {
        ("Direct", "Direct"): (85, "Both direct - no mind games here"),
        ("Direct", "Empathetic"): (88, "Perfect balance - she leads, you support"),
        ("Empathetic", "Direct"): (88, "Complementary communication styles"),
        ("Humorous", "Humorous"): (90, "Both bring the banter"),
        ("Analytical", "Analytical"): (82, "Deep discussions guaranteed"),
    }
    comm_key = (user_comm, match_comm)
    comm_key_rev = (match_comm, user_comm)
    
    if comm_key in comm_scores:
        comm_score, comm_desc = comm_scores[comm_key]
    elif comm_key_rev in comm_scores:
        comm_score, comm_desc = comm_scores[comm_key_rev]
    else:
        comm_score = random.randint(75, 85)
        comm_desc = "Different styles - you'll learn from each other"
    
    goals_match = 100 if (user_goal == match_goal or user_goal == "Both" or match_goal == "Both") else 75
    
    curiosity_score = random.randint(78, 92)
    
    user_message = f"""Analyze the wavelength between these two Synch users:

USER: Vibe={user_vibe}, Comm={user_comm}, Goal={user_goal}, City={user_city}
MATCH: Vibe={match_vibe}, Comm={match_comm}, Goal={match_goal}, City={match_city}

Give short, punchy explanations (1 sentence each) for why they score:

1. Vibe Sync: [score]% - [1 sentence explanation]
2. Lifestyle: [score]% - [1 sentence explanation] 
3. Communication: [score]% - [1 sentence explanation]
4. Goals: [score]% - [1 sentence explanation]
5. Curiosity: [score]% - [1 sentence explanation]

Keep it fun, specific, and witty."""

    explanations = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=0.9, max_tokens=300)
    
    overall = int((base_vibe_score * 0.25 + lifestyle_score * 0.20 + comm_score * 0.25 + goals_match * 0.15 + curiosity_score * 0.15))
    
    dimensions = {
        "vibe_sync": {
            "score": base_vibe_score,
            "label": "Vibe Sync",
            "desc": f"Same {user_vibe} wavelength" if user_vibe == match_vibe else "Complementary energies"
        },
        "lifestyle": {
            "score": lifestyle_score,
            "label": "Lifestyle",
            "desc": "Same city advantage" if user_city == match_city else "Different schedules could work"
        },
        "communication": {
            "score": comm_score,
            "label": "Communication",
            "desc": comm_desc
        },
        "goals": {
            "score": goals_match,
            "label": "Goals",
            "desc": "Perfectly aligned" if goals_match == 100 else "Might need to discuss"
        },
        "curiosity": {
            "score": curiosity_score,
            "label": "Curiosity",
            "desc": "Both love exploring"
        }
    }
    
    return {
        "overall": overall,
        "dimensions": dimensions,
        "summary": explanations
    }