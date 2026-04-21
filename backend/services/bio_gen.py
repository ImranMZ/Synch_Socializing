from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a creative bio writer for Synch, a Pakistani dating app.
You write profile bios that are authentic, intriguing, and show personality without being cliché.

Your rules:
1. Each bio must be UNIQUE - never recycled phrases
2. Reference SPECIFIC details from their profile
3. Match the TONE requested (Mysterious, Warm, or Bold)
4. Keep bios SHORT - 30-50 words max
5. Sound like a real person, not AI
6. Include subtle Pakistani cultural references naturally
7. Never use: "I love to laugh", "My family means everything", "Adventure awaits", "Life is short"
8. Be specific - namedrops, references, quirks work better than generic statements"""

async def generate_bio(profile: Dict[str, Any], style: str = "warm") -> Dict[str, str]:
    vibe = profile.get("Vibe", "")
    hobbies = profile.get("Hobbies", "")
    city = profile.get("City", "")
    goal = profile.get("Goal", "")
    relig = profile.get("Religiosity", "")
    comm = profile.get("Comm_Style", "")
    
    style_prompts = {
        "mysterious": "Write a bio that's intriguing and keeps them guessing. Leave some mystery. Make them want to know more. Think: private, intriguing, slightly enigmatic.",
        "warm": "Write a bio that's welcoming and approachable. Show you're genuine and easy to talk to. Think: friendly, inviting, genuine connection vibes.",
        "bold": "Write a bio that's direct and unapologetic. Say exactly what you want. No games, no ambiguity. Think: confident, clear, attention-grabbing."
    }
    
    user_message = f"""Write 3 unique profile bios for this Synch user in exactly 3 different styles:

USER PROFILE:
- Vibe: {vibe}
- Hobbies: {hobbies}
- City: {city}
- Goal: Looking for {goal}
- Religiosity: {relig}
- Communication: {comm}

IMPORTANT: Write bios in Pakistani context where possible. Reference local things naturally.

Format your response EXACTLY like this:
🌙 MYSTERIOUS: [first bio, 30-50 words]
☀️ WARM: [second bio, 30-50 words]
⚡ BOLD: [third bio, 30-50 words]

Each bio must sound like a real person wrote it - specific, authentic, memorable."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.05, max_tokens=400)
    
    bios = {"mysterious": "", "warm": "", "bold": ""}
    
    current_style = None
    for line in response.split("\n"):
        line = line.strip()
        if line.startswith("🌙") or "MYSTERIOUS" in line.upper():
            current_style = "mysterious"
            if ":" in line:
                bios["mysterious"] = line.split(":", 1)[-1].strip()
        elif line.startswith("☀️") or "WARM" in line.upper():
            current_style = "warm"
            if ":" in line:
                bios["warm"] = line.split(":", 1)[-1].strip()
        elif line.startswith("⚡") or "BOLD" in line.upper():
            current_style = "bold"
            if ":" in line:
                bios["bold"] = line.split(":", 1)[-1].strip()
    
    fallback_bios = {
        "mysterious": f"There's more to discover about me than this bio can hold. {vibe} energy in a {city} kind of world.",
        "warm": f"{city}-based {vibe} looking for genuine connections. Probably overthinking my bio right now.",
        "bold": f"{vibe} personality. I know what I want. Swipe right if you're tired of the usual."
    }
    
    for style_key in bios:
        if not bios[style_key]:
            bios[style_key] = fallback_bios.get(style_key, "")
    
    return bios