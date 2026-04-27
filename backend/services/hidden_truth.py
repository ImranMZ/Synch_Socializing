from groq_client import generate_ai_response
from typing import Dict, Any, Optional
import random

SYSTEM_PROMPT = """You are an ancient wisdom keeper for Synch, a Pakistani dating app. You reveal people's hidden truths through three layers - like peeling an onion to find the core.

Your rules:
1. Layer One (Surface Truth): What they show to the world - the mask, theperformance
2. Layer Two (Hidden Truth): What drives them beneath the surface - thewhy behind their actions
3. Layer Three (Core Truth): Who they really are at their essence - the truth they may not even know about themselves

TONE:
- Mysterious, poetic, ancient-seeming
- Like a riddle from a sage
-引用South Asian wisdom naturally (Sufi, poetry, folk wisdom)
- Each layer DEEPER than the last

FORMAT:
```
🌑 Layer One: [1-2 sentences - theirpublic face]
[Poetic statement about what they show]

🌘 Layer Two: [1-2 sentences - the truth behind the mask]
[Poetic statement about what drives them]

🌕 Layer Three: [1-2 sentences - their core essence]
[Poetic statement about who they really are]
```

NEVER:
- Use generic horoscope language
- Be cliché or overused
- Make it sound like a generic fortune cookie
- Repeat the same patterns

ALWAYS:
- Make it uncomfortably accurate
- Reference their specific profile details
- Feel like it was written ONLY for them
- Be cryptic but meaningful"""

TRUTH_STARTERS_ONE = [
    "They speak in punchlines but think in soliloquies.",
    "The loudest room in their mind is the one they never enter.",
    "They curate their chaos like a gallery.",
    "Every joke is a confession wearing a mask.",
    "They build walls and name them homes.",
]

TRUTH_STARTERS_TWO = [
    "Because they learned early that love is a language with no Rosetta Stone.",
    "The absence taught them how to be a presence.",
    "They overgive because underwhelm feels like loss.",
    "Their depth is a defense mechanism turned art form.",
    "They analyze love like equations because feelings don't have formulas.",
]

TRUTH_STARTERS_THREE = [
    "In another life, they'd be the one who stays.",
    "Their heart is a house with many doors and no locks.",
    "They came to love and stayed for the feeling of being understood.",
    "The rebel is actually the romantic who got tired of waiting.",
    "They don't want to be saved - they want to be SEEN.",
]

async def generate_hidden_truth(profile: Dict[str, Any], quiz_answers: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    vibe = profile.get("Vibe", "unique")
    hobbies = profile.get("Hobbies", "")
    city = profile.get("City", "")
    relig = profile.get("Religiosity", "")
    comm = profile.get("Comm_Style", "")
    smoking = profile.get("Smoking", "")
    diet = profile.get("Diet", "")
    goal = profile.get("Goal", "")
    
    quiz_info = ""
    if quiz_answers:
        quiz_info = f"""
QUIZ RESPONSE:
- Energy: {quiz_answers.get('energy', 'balanced')}
- Social: {quiz_answers.get('social', 'selective')}
- Decision: {quiz_answers.get('decision', 'intuitive')}
- Risk: {quiz_answers.get('risk', 'calculated')}
- Depth: {quiz_answers.get('depth', 'moderate')}
"""
    
    starter_one = random.choice(TRUTH_STARTERS_ONE)
    starter_two = random.choice(TRUTH_STARTERS_TWO)
    starter_three = random.choice(TRUTH_STARTERS_THREE)
    
    user_message = f"""Reveal the Three Layers of Truth for this person:

PROFILE:
- Vibe: {vibe}
- Hobbies: {hobbies}
- City: {city}
- Goal: {goal}
- Religiosity: {relig}
- Communication: {comm}
- Smoking: {smoking}
- Diet: {diet}
{quiz_info}

Write THREE layers. Start with these seeds:
1. {starter_one}
2. {starter_two}
3. {starter_three}

Format exactly as:
```
🌑 Layer One: [truth about what they show]
[poetic statement - 1-2 sentences max]

🌘 Layer Two: [truth about what drives them]  
[poetic statement - 1-2 sentences max]

🌕 Layer Three: [truth about who they really are]
[poetic statement - 1-2 sentences max - MOST DEEP]
```

Make it uncomfortably accurate. Make it theirs only. Make it memorable."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.2, max_tokens=500)
    
    layer_one = starter_one
    layer_three = starter_three
    
    lines = response.strip().split("\n")
    current_layer = 0
    
    parsed_layers = {1: [], 2: [], 3: []}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect headers with more flexibility
        if any(h.lower() in line.lower() for h in ["Layer One", "🌑", "Layer 1"]):
            current_layer = 1
            content = line.split(":", 1)[-1].strip() if ":" in line else line.replace("🌑", "").strip()
            if content: parsed_layers[1].append(content)
        elif any(h.lower() in line.lower() for h in ["Layer Two", "🌘", "Layer 2"]):
            current_layer = 2
            content = line.split(":", 1)[-1].strip() if ":" in line else line.replace("🌘", "").strip()
            if content: parsed_layers[2].append(content)
        elif any(h.lower() in line.lower() for h in ["Layer Three", "🌕", "Layer 3"]):
            current_layer = 3
            content = line.split(":", 1)[-1].strip() if ":" in line else line.replace("🌕", "").strip()
            if content: parsed_layers[3].append(content)
        elif current_layer > 0:
            parsed_layers[current_layer].append(line)
            
    layer_one = " ".join(parsed_layers[1]) if parsed_layers[1] else starter_one
    layer_two = " ".join(parsed_layers[2]) if parsed_layers[2] else starter_two
    layer_three = " ".join(parsed_layers[3]) if parsed_layers[3] else starter_three
    
    return {
        "layer_one": layer_one.replace("🌑", "").replace("Layer One:", "").strip(),
        "layer_two": layer_two.replace("🌘", "").replace("Layer Two:", "").strip(),
        "layer_three": layer_three.replace("🌕", "").replace("Layer Three:", "").strip(),
        "generated_at": "now"
    }