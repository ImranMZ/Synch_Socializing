from groq_client import generate_ai_response
from typing import Dict, Any, List

SYSTEM_PROMPT = """You are a hobby discovery specialist for Synch, a Pakistani dating app.
You suggest NEW hobbies based on user's vibe and current interests.

Your rules:
1. Suggest hobbies the user might not already have
2. Explain WHY it fits their vibe - make it relevant
3. Include specific Pakistani/local context when possible
4. Be specific, not generic - "join a club" doesn't count
5. Keep suggestions achievable in Pakistani context
6. Suggest 3-5 activities maximum
7. Make it sound exciting, not like a lecture"""

HOBBY_CLUSTERS = {
    "Gamer": ["LAN gaming cafes", "Esports tournaments", "Board game cafes", "Speedrunning communities", "Game dev workshops"],
    "Techie": ["Hackathons", "Tech meetups", "Open source contributions", "Startup weekends", "Maker spaces"],
    "GymBro": ["Rock climbing", "Hiking groups", "CrossFit communities", "Sports clubs", "Dance classes"],
    "Foodie": ["Food tours", "Cooking classes", "Restaurant hopping", "Food blogging", "Culinary workshops"],
    "Artist": ["Art galleries", "Street art walks", "Pottery classes", "Photography walks", "Art festivals"],
    "Traveler": ["Travel blogging", "Road trip groups", "Heritage walks", "Weekend getaways", "Backpacking communities"],
    "Bookworm": ["Book clubs", "Poetry slams", "Writing workshops", "Literary festivals", "Podcast listening"],
    "Fashionista": ["Fashion events", "Thrift shopping", "Style workshops", "Fashion photography", "Designer meetups"],
    "Entrepreneur": ["Networking events", "Startup incubators", "Business masterminds", "Pitch competitions", "Co-working spaces"],
}

async def discover_interests(profile: Dict[str, Any]) -> Dict[str, Any]:
    vibe = profile.get("Vibe", "")
    hobbies = profile.get("Hobbies", "")
    city = profile.get("City", "")
    comm = profile.get("Comm_Style", "")
    
    current_hobbies = [h.strip().lower() for h in hobbies.split(",")] if hobbies else []
    
    vibe_hobbies = HOBBY_CLUSTERS.get(vibe, [])
    suggested = [h for h in vibe_hobbies if not any(g in h.lower() for g in current_hobbies)][:4]
    
    user_message = f"""As a hobby discovery specialist, suggest NEW activities for this Synch user:

CURRENT PROFILE:
- Vibe: {vibe}
- Current Hobbies: {hobbies}
- City: {city}
- Communication: {comm}

Based on their vibe and personality, suggest 4-5 activities or hobbies they might love. 

Format your response like this (one per line):
1. [HOBBY NAME] - [why it fits them specifically]
2. [HOBBY NAME] - [why it fits them specifically]
...

Be specific. "Join a gym" doesn't work. "CrossFit at [specific gym]" works better.
Make it about Pakistani context where possible."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=0.95, max_tokens=400)
    
    suggestions = []
    for i, line in enumerate(response.split("\n")):
        if line.strip() and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
            clean = line.lstrip("0123456789.-• ").strip()
            if clean and len(clean) > 5:
                suggestions.append(clean)
    
    if not suggestions:
        fallback = [
            f"{vibe_hobbies[0] if vibe_hobbies else 'Local meetups'} - Perfect for your {vibe} energy",
            "Weekend road trips - Escape the city chaos together",
            "Food hunting in {city} - Karachi's street food scene is unmatched",
            "Hackathon or gaming LAN - Find your tribe",
        ]
        suggestions = [f.format(city=city, vibe=vibe) if '{city}' in f or '{vibe}' in f else f for f in fallback[:4]]
    
    return {
        "suggestions": suggestions[:5],
        "vibe_matched": vibe,
        "personalized_reasoning": response[:200] if len(response) > 200 else response
    }