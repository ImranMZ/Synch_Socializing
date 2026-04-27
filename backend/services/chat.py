from typing import Dict, Any, List
import random
import os

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
PERSONALITIES = ["Chill", "Enthusiastic", "Witty", "Supportive", "Curious", "Direct"]

MOCK_PERSONAS = [
    {"Name": "Ahmed Khan", "Vibe": "Techie", "University": "NUST", "UniversityName": "NUST", "City": "Islamabad", "Hobbies": "Coding, Gaming", "personality": "Chill"},
    {"Name": "Fatima Ali", "Vibe": "Bookworm", "University": "LU", "UniversityName": "Lahore University", "City": "Lahore", "Hobbies": "Reading, Writing", "personality": "Supportive"},
    {"Name": "Hassan Raza", "Vibe": "GymBro", "University": "PU", "UniversityName": "Punjab University", "City": "Lahore", "Hobbies": "Sports, Fitness", "personality": "Enthusiastic"},
    {"Name": "Ayesha Malik", "Vibe": "Foodie", "University": "UOK", "UniversityName": "University of Karachi", "City": "Karachi", "Hobbies": "Cooking, Travel", "personality": "Witty"},
    {"Name": "Ali Hassan", "Vibe": "Gamer", "University": "FAST", "UniversityName": "FAST-NU", "City": "Lahore", "Hobbies": "Gaming, Anime", "personality": "Curious"},
]

FALLBACK_MESSAGES = [
    "Hey everyone! How's it going?",
    "Just finished my midterm exams, so relieved!",
    "Anyone up for a coffee later?",
    "The new cafe near campus is amazing!",
    "Anyone going to the tech meetup next week?",
    "Studying for finals is killing me 😩",
    "Just discovered this amazing new series on Netflix!",
    "The weather is perfect today for a walk",
    "Who's coming to the game night this Friday?",
    "Can someone help me with this coding problem?",
]

PERSONA_RESPONSES = {
    "Techie": [
        "Just pushed my latest project to GitHub!",
        "Anyone interested in a hackathon this weekend?",
        "Python > JavaScript, fight me",
        "The AI hype is real this semester",
        "Finally fixed that bug that's been haunting me for days!",
    ],
    "Bookworm": [
        "Currently reading 'Atomic Habits' - highly recommend!",
        "The library is my second home these days",
        "Book club meeting next Tuesday, who's in?",
        "Nothing beats a good book on a rainy day",
        "Just finished the most beautiful story ever",
    ],
    "GymBro": [
        "Leg day tomorrow... wish me luck 😅",
        "Protein shake after every workout is the way!",
        "Who's coming to the gym at 6 AM?",
        "Gains are real this semester!",
        "Cardio? In this economy?",
    ],
    "Foodie": [
        "The biryani at the new place is *chef's kiss*",
        "Food hunting this weekend anyone?",
        "Cooking is my therapy tbh",
        "Street food > fancy restaurants",
        "Recipe sharing thread? I'm in!",
    ],
    "Gamer": [
        "Finally hit Diamond rank! 🎮",
        "Who's down for some Valorant tonight?",
        "The new game update is insane",
        "Gaming marathon this weekend, anyone?",
        "Controller or keyboard, let's settle this",
    ],
}

def get_mock_personas(count: int = 5) -> List[Dict[str, Any]]:
    return random.sample(MOCK_PERSONAS, min(count, len(MOCK_PERSONAS)))

def generate_local_response(persona: Dict[str, Any], chat_context: str) -> str:
    vibe = persona.get("Vibe", "Techie")
    personality = persona.get("personality", "Chill")
    
    if vibe in PERSONA_RESPONSES:
        return random.choice(PERSONA_RESPONSES[vibe])
    
    vibe_specific = [
        ("Techie", ["Just debugging some code, brain is fried 😅", "The new framework is actually pretty cool", "Who's working on side projects?"]),
        ("Bookworm", ["Currently obsessed with this book series!", "The library is packed these days", "Anyone else love reading more than sleeping?"]),
        ("GymBro", ["Leg day was brutal today! 💪", "Gym at 5 AM hits different", "Gains coming in nicely this semester"]),
        ("Foodie", ["The food here is amazing!", "Anyone tried that new restaurant?", "Cooked something awesome today!" ]),
        ("Gamer", ["GG easy!", "Anyone up for gaming later?", "That game was insane!" ]),
        ("Artist", ["Just finished a new piece!", "Art block is real these days", "Museum trip this weekend?"]),
        ("Traveler", ["Planning my next trip already!", "The views here are gorgeous", "Anyone wanna explore this weekend?"]),
        ("Fashionista", [" outfit of the day is fire!", "Thrift shopping finds were amazing!", "Style inspo thread?"]),
        ("Entrepreneur", ["Working on a new idea!", "Side hustle grind never stops", "Who's into startups?"]),
    ]
    
    for v, responses in vibe_specific:
        if vibe == v:
            return random.choice(responses)
    
    return random.choice(FALLBACK_MESSAGES)

def get_random_personas(df=None, count: int = 5) -> List[Dict[str, Any]]:
    return get_mock_personas(count)

async def generate_chat_round(personas: List[Dict[str, Any]], chat_history: List[Dict[str, Any]], user_participating: bool = False) -> List[Dict[str, Any]]:
    messages = []
    
    if not user_participating:
        chat_context = "This is the start of the conversation"
    else:
        chat_context = "\n".join([
            f"{m.get('name', 'Someone')}: {m.get('message', '')}" 
            for m in chat_history[-5:] if m.get("type") == "user"
        ])
        if not chat_context:
            chat_context = "A new user just joined"
    
    for i, persona in enumerate(personas):
        try:
            response = generate_local_response(persona, chat_context)
            messages.append({
                "id": i,
                "name": persona.get("Name", f"User_{i}"),
                "university": persona.get("University", ""),
                "university_name": persona.get("UniversityName", ""),
                "city": persona.get("City", ""),
                "vibe": persona.get("Vibe", ""),
                "message": response,
                "timestamp": "Just now"
            })
        except Exception as e:
            print(f"Error generating message for persona {i}: {e}")
            messages.append({
                "id": i,
                "name": persona.get("Name", f"User_{i}"),
                "university": persona.get("University", ""),
                "university_name": persona.get("UniversityName", ""),
                "city": persona.get("City", ""),
                "vibe": persona.get("Vibe", ""),
                "message": random.choice(FALLBACK_MESSAGES),
                "timestamp": "Just now"
            })
    
    return messages