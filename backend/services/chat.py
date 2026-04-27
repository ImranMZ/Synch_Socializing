from typing import Dict, Any, List
import random
import json

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

# Pre-defined personas with rich profiles
MOCK_PERSONAS = [
    {
        "Name": "Ahmed Khan", "Vibe": "Techie", "University": "NUST", "UniversityName": "NUST", 
        "City": "Islamabad", "Hobbies": "Coding, Gaming", "personality": "Chill",
        "intro": "Hey everyone! Just finished a coding marathon. Anyone else working on side projects?"
    },
    {
        "Name": "Fatima Ali", "Vibe": "Bookworm", "University": "LU", "UniversityName": "Lahore University", 
        "City": "Lahore", "Hobbies": "Reading, Writing", "personality": "Supportive",
        "intro": "Hi guys! Just finished 'Atomic Habits' - absolutely loved it. Anyone else a book lover?"
    },
    {
        "Name": "Hassan Raza", "Vibe": "GymBro", "University": "PU", "UniversityName": "Punjab University", 
        "City": "Lahore", "Hobbies": "Sports, Fitness", "personality": "Enthusiastic",
        "intro": "What's up everyone! 💪 Just crushed leg day. Who's hitting the gym this evening?"
    },
    {
        "Name": "Ayesha Malik", "Vibe": "Foodie", "University": "UOK", "UniversityName": "University of Karachi", 
        "City": "Karachi", "Hobbies": "Cooking, Travel", "personality": "Witty",
        "intro": "Hey! Just discovered this amazing biryani place near campus. Foodies unite! 🍛"
    },
    {
        "Name": "Ali Hassan", "Vibe": "Gamer", "University": "FAST", "UniversityName": "FAST-NU", 
        "City": "Lahore", "Hobbies": "Gaming, Anime", "personality": "Curious",
        "intro": "GG! Just hit Diamond in Valorant. Anyone up for some gaming tonight? 🎮"
    },
]

# Context-aware response templates based on conversation topics
TOPIC_RESPONSES = {
    "coding": [
        "Speaking of coding, I just learned a new Python trick! Want to hear it?",
        "Oh I feel you on the debugging struggle! Took me 3 hours to find a missing semicolon 😅",
        "That reminds me - anyone going to the hackathon next month?",
    ],
    "book": [
        "That book sounds amazing! Adding it to my reading list 📚",
        "I just finished a psychological thriller - my mind is still blown!",
        "Nothing beats a good book on a rainy day, right?",
    ],
    "gym": [
        "Gym day was brutal today but worth it! 💪 Gains are coming nicely.",
        "Wait, what's your workout split? I'm doing PPL and seeing great results!",
        "Protein shake game is strong today! Who else tracks macros?",
    ],
    "food": [
        "OMG yes! That place is incredible. Their nihari is *chef's kiss* 🤤",
        "Now I'm craving biryani! Anyone want to do a food crawl this weekend?",
        "Cooking experiment today: tried making sushi. It... didn't go well 😂",
    ],
    "gaming": [
        "That game is insane! Just finished the new update, the graphics are 🔥",
        "I'm more of a cozy gamer personally, but respect the grind! 🎮",
        "Gaming marathon this weekend? I'm down if anyone wants to join!",
    ],
    "general": [
        "That's so interesting! Tell me more about that.",
        "Ha! That reminds me of something that happened to me last week.",
        "Love the energy! Keep going, I'm here for it 😄",
        "Wait really? I didn't know that about you!",
        "That's actually a really good point. Never thought of it that way.",
    ],
}

def get_mock_personas(count: int = 5) -> List[Dict[str, Any]]:
    """Return exactly 5 personas for consistent chat"""
    return [dict(p) for p in MOCK_PERSONAS[:count]]

def detect_topic(message: str) -> str:
    """Detect what topic a message is about"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["code", "python", "debug", "programming", "github", "api"]):
        return "coding"
    elif any(word in message_lower for word in ["book", "read", "library", "novel", "author"]):
        return "book"
    elif any(word in message_lower for word in ["gym", "workout", "fitness", "protein", "leg day", "gains"]):
        return "gym"
    elif any(word in message_lower for word in ["food", "biryani", "cook", "restaurant", "eat", "nihari"]):
        return "food"
    elif any(word in message_lower for word in ["game", "gaming", "valorant", "rank", "play"]):
        return "gaming"
    else:
        return "general"

def get_persona_response(persona: Dict[str, Any], chat_history: List[Dict[str, Any]], turn_context: str) -> str:
    """
    Generate a contextual response based on:
    1. Who this persona is (vibe, personality, university)
    2. What was just said in chat (turn_context)
    3. The topic being discussed
    """
    vibe = persona.get("Vibe", "Techie")
    name = persona.get("Name", "Someone")
    university = persona.get("UniversityName", "a university")
    personality = persona.get("personality", "Chill")
    
    # Detect topic from the turn context
    topic = detect_topic(turn_context)
    
    # Get vibe-appropriate response
    if vibe == "Techie" and topic == "coding":
        responses = [
            "As a CS major at {uni}, I can confirm debugging is 90% of the job 😅",
            "Oh that's nothing! Just spent 5 hours fixing a race condition. CS life, am I right?",
            "Speaking of which - anyone tried the new framework? Thoughts?",
        ]
    elif vibe == "Bookworm" and topic == "book":
        responses = [
            "Finally someone who appreciates good literature! What's your favorite genre?",
            "That book changed my perspective too! Have you read 'The Alchemist'?",
            "Nothing beats a quiet evening with a good book and chai ☕",
        ]
    elif vibe == "GymBro" and topic == "gym":
        responses = [
            "YES! That workout split is solid. What's your PR on bench?",
            "Gym at 6 AM hits different! Consistency is key 💪",
            "Leg day was BRUTAL today but the pump is real!",
        ]
    elif vibe == "Foodie" and topic == "food":
        responses = [
            "OMG yes! That place is incredible. We should do a food crawl! 🍕",
            "You had me at biryani! What's your go-to order?",
            "Just tried making sushi actually, it... didn't go well 😂",
        ]
    elif vibe == "Gamer" and topic == "gaming":
        responses = [
            "No way! That game is insane. Just hit Diamond myself 🎮",
            "Gaming night this Friday? I'm down to squad up!",
            "Wait till you see the new update, the graphics are 🔥",
        ]
    else:
        # Use topic-based responses
        responses = TOPIC_RESPONSES.get(topic, TOPIC_RESPONSES["general"])
    
    # Add personality flavor
    if personality == "Witty":
        responses = [r + " 😏" if not r.endswith(("!", "?", ".")) else r[:-1] + "! 😏" for r in responses]
    elif personality == "Enthusiastic":
        responses = ["Wow! " + r for r in responses]
    elif personality == "Supportive":
        responses = [r + " You got this! 💪" if "workout" in r.lower() else r for r in responses]
    
    return random.choice(responses)

def generate_chat_round(
    personas: List[Dict[str, Any]], 
    chat_history: List[Dict[str, Any]], 
    user_participating: bool = False,
    turn_index: int = 0
) -> List[Dict[str, Any]]:
    """
    Generate ONE message at a time for realistic conversation.
    
    Args:
        personas: List of persona objects
        chat_history: Full conversation history
        user_participating: Whether user has joined
        turn_index: Which persona's turn it is (0-4)
    
    Returns:
        List with single message from the persona whose turn it is
    """
    messages = []
    
    if not personas or len(personas) == 0:
        personas = get_mock_personas(5)
    
    # Determine whose turn it is
    persona_to_respond = personas[turn_index % len(personas)]
    
    # Build context from recent messages (last 3 messages)
    recent_messages = chat_history[-3:] if len(chat_history) > 0 else []
    context = ". ".join([
        f"{m.get('name', 'Someone')}: {m.get('message', '')}" 
        for m in recent_messages
    ])
    
    if not context:
        context = "This is the start of the conversation"
    
    try:
        response = get_persona_response(persona_to_respond, chat_history, context)
        
        messages.append({
            "id": len(chat_history),
            "name": persona_to_respond["Name"],
            "university": persona_to_respond.get("University", ""),
            "university_name": persona_to_respond.get("UniversityName", ""),
            "city": persona_to_respond.get("City", ""),
            "vibe": persona_to_respond.get("Vibe", ""),
            "message": response,
            "timestamp": "Just now",
            "turn_index": (turn_index % len(personas))
        })
    except Exception as e:
        print(f"Error generating message for persona {turn_index}: {e}")
        messages.append({
            "id": len(chat_history),
            "name": persona_to_respond["Name"],
            "university": persona_to_respond.get("University", ""),
            "university_name": persona_to_respond.get("UniversityName", ""),
            "city": persona_to_respond.get("City", ""),
            "vibe": persona_to_respond.get("Vibe", ""),
            "message": random.choice(TOPIC_RESPONSES["general"]),
            "timestamp": "Just now",
            "turn_index": (turn_index % len(personas))
        })
    
    return messages

def get_initial_messages(personas: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Get initial intro messages from 2-3 personas to start the chat"""
    messages = []
    
    # First 2 personas introduce themselves
    for i, persona in enumerate(personas[:2]):
        messages.append({
            "id": i,
            "name": persona["Name"],
            "university": persona.get("University", ""),
            "university_name": persona.get("UniversityName", ""),
            "city": persona.get("City", ""),
            "vibe": persona.get("Vibe", ""),
            "message": persona.get("intro", "Hey everyone!"),
            "timestamp": "Just now",
            "turn_index": i
        })
    
    return messages