from groq_client import generate_ai_response
from typing import Dict, Any, Optional
import random

SYSTEM_PROMPT = """You are a personality analyst for Synch, a Pakistani dating app. 
You analyze user profiles and create unique, memorable "Vibe Archetypes" that capture their essence.

Your rules:
1. Create a creative ARCHETYPE TITLE - unexpected, poetic, unique (e.g., "Velvet Thunder", " Chai Code Cowboy", "Midnight SEO Sultan")
2. Write a short DESCRIPTION that feels like a character from a story
3. List 3-4 SIGNATURE TRAITS as bullet points
4. Identify their SECRET SUPERPOWER - a fun, unexpected strength
5. Describe their IDEAL MATCH archetype
6. NEVER use templates - each persona must feel handcrafted
7. Reference Pakistani/South Asian culture naturally
8. Keep tone warm, witty, and empowering
9. Make it feel like a character in a story they'd want to be"""

ARCHETYPE_TEMPLATES = [
    "The {adjective} {noun}",
    "{noun} of {place}",
    "The {noun} {noun}",
    "The {adjective} {type}",
    "{type} {noun}",
]

ADJECTIVES = ["Velvet", "Electric", "Midnight", "Spicy", "Golden", "Silent", "Thunder", "Chai", "Desi", "Wandering", "Cosmic", "Retro", "Neon", "Urban", "Nostalgic", "Dreamy", "Bold", "Mystic", "Sunset", "Starlight"]

NOUNS = ["Thunder", "Cowboy", "Sultan", "Phoenix", "Ninja", "Architect", "Dreamer", "Poet", "Warrior", "Nomad", "Alchemist", "Gardener", "Storyteller", "Pioneer", "Explorer", "Creator", "Maven", "Sage", "Rogue", "Visionary"]

TYPES = ["Gamer", "Coder", "Chef", "Artist", "Traveler", "Writer", "Musician", "Athlete", "Entrepreneur", "Dreamer", "Explorer", "Creator"]

async def generate_persona(profile: Dict[str, Any], quiz_answers: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    vibe = profile.get("Vibe", "unique")
    hobbies = profile.get("Hobbies", "")
    city = profile.get("City", "")
    relig = profile.get("Religiosity", "")
    comm = profile.get("Comm_Style", "")
    smoking = profile.get("Smoking", "")
    diet = profile.get("Diet", "")
    
    quiz_info = ""
    if quiz_answers:
        quiz_info = f"""
QUIZ INSIGHTS:
- Energy style: {quiz_answers.get('energy', 'balanced')}
- Social preference: {quiz_answers.get('social', 'selective')}
- Decision style: {quiz_answers.get('decision', 'intuitive')}
- Risk appetite: {quiz_answers.get('risk', 'calculated')}
- Depth preference: {quiz_answers.get('depth', 'moderate')}
"""
    
    user_message = f"""Create a unique Vibe Archetype for this Synch user:

BASIC PROFILE:
- Vibe: {vibe}
- Hobbies: {hobbies}
- City: {city}
- Religiosity: {relig}
- Communication: {comm}
- Smoking: {smoking}
- Diet: {diet}
{quiz_info}

Generate a persona with this EXACT format:

## Your Vibe Archetype: [CREATIVE TITLE]
*_[short, evocative description in 1-2 sentences]_*

**Signature Traits:**
- [trait 1 - be specific to their profile]
- [trait 2 - reflect their vibe]
- [trait 3 - show their uniqueness]

**Secret Superpower:** [unexpected strength or talent]

**Ideal Match:** [what kind of person would complement them]

Make it memorable, specific, and uniquely them. Reference their actual preferences throughout."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.1, max_tokens=400)
    
    title = f"The {random.choice(ADJECTIVES)} {random.choice(NOUNS)}"
    
    if "Your Vibe Archetype:" in response:
        parts = response.split("Your Vibe Archetype:")
        if len(parts) > 1:
            title_line = parts[1].split("*")[0].strip() if "*" in parts[1] else parts[1].split("\n")[0].strip()
            title = title_line.strip()
    
    return {
        "title": title,
        "full_analysis": response,
        "generated_at": "now"
    }