from groq_client import generate_ai_response
from typing import Dict, Any, List
import random

SYSTEM_PROMPT = """You are a compatibility advisor for Synch, a Pakistani dating app.
You analyze potential dealbreakers and incompatibilities in a friendly, helpful way.

Your rules:
1. NEVER sound alarmist or scary - frame things positively
2. Use actual statistics when possible from the dataset context
3. Offer practical suggestions, not just warnings
4. Be specific about WHAT might cause friction
5. Keep tone supportive, like a wise friend giving heads up
6. Reference Pakistani cultural context where relevant
7. Maximum 3 main points
8. End with actionable advice"""

DEALBREAKER_STATS = {
    "karachi": {"smoking": 42, "diet_halal": 55, "vegetarian": 8},
    "lahore": {"smoking": 38, "diet_halal": 62, "vegetarian": 12},
    "islamabad": {"smoking": 25, "diet_halal": 58, "vegetarian": 15},
    "rawalpindi": {"smoking": 45, "diet_halal": 50, "vegetarian": 6},
}

async def analyze_dealbreakers(profile: Dict[str, Any], df) -> Dict[str, Any]:
    city = profile.get("City", "").lower()
    smoking_pref = profile.get("Smoking", "")
    diet_pref = profile.get("Diet", "")
    relig_pref = profile.get("Religiosity", "")
    
    city_stats = DEALBREAKER_STATS.get(city, DEALBREAKER_STATS["karachi"])
    
    insights = []
    
    if smoking_pref.lower() == "no":
        smoking_affected = city_stats.get("smoking", 35)
        insights.append({
            "type": "filter_impact",
            "category": "smoking",
            "message": f"Your 'No Smoking' filter eliminates about **{smoking_affected}%** of profiles in {city.title()}. This is {'quite restrictive' if smoking_affected > 35 else 'reasonable'}.",
            "suggestion": "If you're open to occasional smokers, this could expand your pool significantly."
        })
    
    if diet_pref.lower() in ["zabiha halal", "halal"]:
        diet_affected = city_stats.get("diet_halal", 55)
        insights.append({
            "type": "filter_impact",
            "category": "diet",
            "message": f"About **{diet_affected}%** in {city.title()} share your dietary preference - you're in good company!",
            "suggestion": "This filter is well-aligned with your local pool."
        })
    elif diet_pref.lower() == "vegetarian":
        veg_affected = city_stats.get("vegetarian", 10)
        insights.append({
            "type": "filter_impact",
            "category": "diet",
            "message": f"Only about **{veg_affected}%** in {city.title()} are vegetarian - your pool might be smaller.",
            "suggestion": "Consider broadening to 'Anything' if open to cooking together."
        })
    
    vibe = profile.get("Vibe", "")
    if vibe:
        vibe_stats = analyze_vibe_conflicts(vibe)
        if vibe_stats:
            insights.append(vibe_stats)
    
    user_message = f"""As a compatibility advisor, provide friendly insights about potential dealbreakers:

USER PREFERENCES:
- City: {city.title()}
- Smoking: {smoking_pref}
- Diet: {diet_pref}
- Religiosity: {relig_pref}
- Vibe: {vibe}

Provide 2-3 friendly insights about what might cause friction. Format:
- [Category]: What the issue is
- Why it matters
- Suggestion

Keep it brief, positive, helpful."""

    ai_insights = await generate_ai_response(SYSTEM_PROMPT, user_message, temperature=0.8, max_tokens=300)
    
    return {
        "insights": insights,
        "ai_advice": ai_insights,
        "filter_summary": {
            "city": city.title() if city else "Not specified",
            "strict_city": profile.get("strict_city", False),
            "total_filters": sum([1 for v in [smoking_pref, diet_pref, relig_pref, vibe] if v])
        },
        "pool_estimate": estimate_pool_size(city, smoking_pref, diet_pref)
    }

def analyze_vibe_conflicts(vibe: str) -> Dict[str, Any]:
    conflict_map = {
        "Gamer": {"smoking_likely": 35, "alternative": "consider including 'Occasionally'"},
        "GymBro": {"smoking_likely": 25, "alternative": "you might align well here"},
        "Techie": {"smoking_likely": 20, "alternative": "low smoking rates in this group"},
        "Foodie": {"smoking_likely": 30, "alternative": "might affect restaurant preferences"},
    }
    
    if vibe in conflict_map:
        data = conflict_map[vibe]
        return {
            "type": "vibe_insight",
            "category": "vibe",
            "message": f"People with '{vibe}' vibe have about **{data['smoking_likely']}%** smoking rates.",
            "suggestion": f"If smoking matters, {data['alternative']}."
        }
    return None

def estimate_pool_size(city: str, smoking: str, diet: str) -> str:
    base = 30000
    
    city_multipliers = {
        "karachi": 1.0,
        "lahore": 0.85,
        "islamabad": 0.6,
        "rawalpindi": 0.5,
        "faisalabad": 0.4,
        "multan": 0.35,
        "peshawar": 0.3,
        "quetta": 0.25,
    }
    
    mult = city_multipliers.get(city.lower(), 0.5)
    
    if smoking.lower() == "no":
        mult *= 0.6
    elif smoking.lower() == "occasionally":
        mult *= 0.85
    
    if diet.lower() in ["zabiha halal", "halal"]:
        mult *= 0.7
    elif diet.lower() == "vegetarian":
        mult *= 0.15
    
    estimated = int(base * mult)
    
    if estimated > 5000:
        return f"~{estimated:,} potential matches"
    elif estimated > 1000:
        return f"~{estimated:,} matches - good pool"
    else:
        return f"~{estimated:,} matches - consider expanding filters"