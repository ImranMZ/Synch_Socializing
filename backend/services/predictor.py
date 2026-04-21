from groq_client import generate_ai_response
from typing import Dict, Any

SYSTEM_PROMPT = """You are a playful relationship predictor for Synch, a Pakistani dating app.
You create fun, fictional "6-month predictions" about what a relationship would look like.

Your rules:
1. Make it HUMOROUS and lighthearted - not a real prediction
2. Reference SPECIFIC details from their profiles
3. Include Month 1, Month 3, and Month 6 predictions
4. Add one unexpected twist that's actually sweet
5. Keep it PG - appropriate for a Pakistani audience
6. Make it memorable and shareable
7. NEVER be mean or critical
8. Make it sound like a fun story, not a clinical forecast
9. Include specific references to their hobbies, vibe, city"""

async def predict_match_future(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> Dict[str, Any]:
    user_name = user_profile.get("Name", "The user")
    match_name = match_profile.get("Name", "Your match")
    user_vibe = user_profile.get("Vibe", "")
    match_vibe = match_profile.get("Vibe", "")
    user_hobbies = user_profile.get("Hobbies", "")
    match_hobbies = match_profile.get("Hobbies", "")
    user_city = user_profile.get("City", "")
    match_city = match_profile.get("City", "")
    user_goal = user_profile.get("Goal", "")
    user_comm = user_profile.get("Comm_Style", "")
    match_comm = match_profile.get("Comm_Style", "")
    
    shared_hobbies = []
    if user_hobbies and match_hobbies:
        user_list = [h.strip().lower() for h in user_hobbies.split(",")]
        match_list = [h.strip().lower() for h in match_hobbies.split(",")]
        shared = set(user_list) & set(match_list)
        shared_hobbies = list(shared)
    
    user_message = f"""Create a fun, fictional "6-month relationship prediction" for these two Synch users.

YOUR TASK: Write a playful story about what their relationship might look like.

USER: {user_name}
- Vibe: {user_vibe}
- Hobbies: {user_hobbies}
- City: {user_city}
- Communication: {user_comm}
- Looking for: {user_goal}

MATCH: {match_name}
- Vibe: {match_vibe}
- Hobbies: {match_hobbies}
- City: {match_city}
- Communication: {match_comm}

Shared hobbies: {shared_hobbies}

Write 4 short paragraphs:

**Month 1:** [What's the vibe? First impressions, nervous energy, first hangout]

**Month 3:** [Where have they settled? Routines forming, inside jokes starting, maybe one debate]

**Month 6:** [The comfortable stage - what do they do together? What's their thing?]

**The Twist:** [One unexpected sweet moment that defines them]

Keep it light, funny, warm. Reference their actual hobbies and vibe. Make it feel like a friend's fun prediction, not an algorithm."""

    response = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=1.05, max_tokens=500)
    
    verdict = generate_verdict(user_vibe, match_vibe, shared_hobbies, user_comm, match_comm)
    
    return {
        "prediction": response,
        "verdict": verdict,
        "shared_hobbies": shared_hobbies,
        "fun_fact": generate_fun_fact(user_profile, match_profile)
    }

def generate_verdict(user_vibe: str, match_vibe: str, shared_hobbies: list, user_comm: str, match_comm: str) -> str:
    if user_vibe == match_vibe:
        return f"High compatibility. Same {user_vibe} energy means you're already on the same wavelength. Expect late-night conversations and shared playlists before Month 1 even ends."
    
    if shared_hobbies:
        return f"Good chemistry potential. Your shared love of {', '.join(shared_hobbies[:2])} gives you instant conversation topics. Bonus points for building memories together."
    
    if user_comm == "Empathetic" and match_comm == "Direct":
        return "Strong potential. You're the emotional anchor, they're the action taker. Together you're unstoppable (or at least, well-organized)."
    
    return "Interesting match. Different vibes could mean exciting adventures. Keep an open mind and let it unfold naturally."

def generate_fun_fact(user_profile: Dict[str, Any], match_profile: Dict[str, Any]) -> str:
    facts = []
    
    user_city = user_profile.get("City", "")
    match_city = match_profile.get("City", "")
    if user_city == match_city:
        facts.append(f"You two are from the same city - {user_city} adventures await!")
    else:
        facts.append(f"Long distance within Pakistan? The {user_city} to {match_city} route might become familiar!")
    
    user_hobbies = user_profile.get("Hobbies", "")
    if user_hobbies:
        first_hobby = user_hobbies.split(",")[0].strip()
        facts.append(f"Your {first_hobby} sessions might just become your thing.")
    
    return random.choice(facts) if facts else "The best stories start with a single swipe."