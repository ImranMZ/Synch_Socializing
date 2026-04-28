# **SYNCH BACKEND - COMPLETE DOCUMENTATION**
*Version: 1.0 | Base URL: `http://127.0.0.1:8001`*

---

## **TABLE OF CONTENTS**
1. [Environment Setup](#1-environment-setup)
2. [CORS Configuration](#2-cors-configuration)
3. [Data Models (Pydantic)](#3-data-models-pydantic)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Services Documentation](#5-services-documentation)
6. [Machine Learning Engine](#6-machine-learning-engine)
7. [AI Features (Groq)](#7-ai-features-groq)
8. [Chat System (Turn-Based)](#8-chat-system-turn-based)
9. [Dataset Structure](#9-dataset-structure)
10. [Frontend Integration Guide](#10-frontend-integration-guide)

---

## **1. ENVIRONMENT SETUP**

### **Required Files:**
```
backend/
├── .env                  # Environment variables
├── main.py               # FastAPI application
├── groq_client.py        # AI client wrapper
├── data/
│   └── dataset.csv      # User profiles dataset
└── services/
    ├── chat.py           # Turn-based chat
    ├── direct_chat.py     # 1-on-1 chat
    ├── explainer.py       # Match explanations
    ├── icebreakers.py     # Conversation starters
    ├── persona.py        # Vibe archetypes
    ├── bio_gen.py        # Bio generation
    ├── detector.py        # Dealbreakers
    ├── discovery.py      # Hobby discovery
    ├── wavelength.py     # Compatibility analysis
    ├── predictor.py      # Future predictions
    └── hidden_truth.py    # Hidden truth revelations
```

### **Environment Variables (`.env` file):**
```bash
# Required for AI features
GROQ_API_KEY=gsk_your_key_here

# Optional - defaults to http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### **Python Dependencies (requirements.txt):**
```python
fastapi
uvicorn
pandas
scikit-learn
numpy
groq
python-dotenv
pydantic
```

---

## **2. CORS CONFIGURATION**

**Location:** `main.py` lines 13-19

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Default: http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Frontend URLs that can access backend:**
- `http://localhost:3000` (development)
- `http://127.0.0.1:3000`
- Or whatever `FRONTEND_URL` is set to

---

## **3. DATA MODELS (Pydantic)**

**Location:** `main.py` lines 33-60

### **UserProfile:**
```python
class UserProfile(BaseModel):
    Vibe: str = ""           # e.g., "Techie", "GymBro", "Foodie"
    Goal: str = ""           # "Partner" or "Friends" or "Both"
    Gender: str = ""         # "Male" or "Female"
    Hobbies: str = ""        # Comma-separated: "Coding, Music, Gaming"
    Smoking: str = ""        # "No", "Yes", "Occasionally"
    Diet: str = ""           # "Zabiha Halal", "Anything", "Vegetarian", "Vegan"
    Religiosity: str = ""     # "Practicing", "Moderate", "Not Practicing"
    Comm_Style: str = ""    # "Direct", "Empathetic", "Humorous", "Analytical"
    City: str = ""           # "Karachi", "Lahore", "Islamabad", etc.
    strict_city: bool = False  # If True, only match within same city
```

### **QuizAnswer:**
```python
class QuizAnswer(BaseModel):
    question_id: str    # "energy", "social", "decision", "risk", "depth"
    answer: str          # "a", "b", "c"
```

### **PsychographicRequest:**
```python
class PsychographicRequest(BaseModel):
    profile: UserProfile
    quiz_answers: list[QuizAnswer]
```

### **MatchRequest:**
```python
class MatchRequest(BaseModel):
    user_profile: UserProfile
    match_profile: dict      # Match's profile as dictionary
```

### **QuizWithProfileRequest:**
```python
class QuizWithProfileRequest(BaseModel):
    profile: UserProfile
    quiz_answers: list       # Can be list of dicts or list of QuizAnswer objects
```

---

## **4. API ENDPOINTS REFERENCE**

### **Base URL:** `http://127.0.0.1:8001`

---

### **📊 ROOT & STATISTICS**

#### **GET `/`**
Returns API welcome message and total profiles count.
```json
// Request: None
// Response (200 OK):
{
  "message": "Welcome to Synch API",
  "total_profiles": 50000
}
```

---

#### **GET `/api/stats`**
Returns community statistics for homepage.
```json
// Request: None
// Response (200 OK):
{
  "total_users": 50000,
  "top_hobbies": {"Coding": 7.3, "Coffee": 7.2, "Binge Watch": 3.8, ...},
  "top_vibes": {"Foodie": 7.3, "Bookworm": 7.3, "Traditional": 7.3, ...}
}
```

---

### **💕 MATCHING**

#### **POST `/api/match`**
Find compatible profiles based on user preferences.
```json
// Request Body (UserProfile):
{
  "Vibe": "Techie",
  "Goal": "Partner",
  "Gender": "Male",
  "Hobbies": "Coding, Music",
  "Smoking": "No",
  "Diet": "Anything",
  "Religiosity": "Moderate",
  "Comm_Style": "Direct",
  "City": "Lahore",
  "strict_city": false
}

// Optional Query Parameter:
?psychographic={"nocturnality": 0.5, "social_energy": 0.5, "spontaneity": 0.5, ...}

// Response (200 OK):
[
  {
    "Name": "Ayesha Qureshi",
    "Compatibility_Score": 92.5,
    "Gender": "Female",
    "Age": 24,
    "Location": "Lahore, Punjab",
    "Education": "MS CS",
    "Profession": "Software Engineer",
    "Vibe": "Techie",
    "Hobbies": "Coding, Anime",
    "Religiosity": "Practicing",
    "Smoking": "No",
    "Diet": "Zabiha Halal",
    "Comm_Style": "Direct"
  },
  // ... up to 10 matches
]
```

---

### **🧠 QUIZ SYSTEM**

#### **GET `/api/quiz/questions`**
Get psychographic quiz questions.
```json
// Response (200 OK):
{
  "questions": [
    {
      "id": "energy",
      "question": "When are you most productive?",
      "options": [
        {"id": "a", "text": "Late night - code runs better when the world sleeps", "nocturnality": 0.9, "spontaneity": 0.3},
        {"id": "b", "text": "Early morning - 5 AM is my peak time", "nocturnality": 0.1, "spontaneity": 0.7},
        {"id": "c", "text": "Whenever inspiration hits - I'm flexible", "nocturnality": 0.5, "spontaneity": 0.9}
      ]
    },
    // ... 4 more questions (social, decision, risk, depth)
  ]
}
```

#### **POST `/api/quiz/submit`**
Submit quiz answers and get psychographic profile.
```json
// Request:
{
  "profile": { /* UserProfile */ },
  "quiz_answers": [
    {"question_id": "energy", "answer": "a"},
    {"question_id": "social", "answer": "b"},
    // ...
  ]
}

// Response (200 OK):
{
  "psychographic_profile": {"nocturnality": 0.9, "social_energy": 0.2, "spontaneity": 0.9, "depth": 0.9, "assertiveness": 0.8},
  "message": "Quiz completed! Your matching just got smarter."
}
```

---

### **🎯 AI INSIGHTS**

#### **POST `/api/explain-match`**
Get AI-generated explanation of why two users match.
```json
// Request (MatchRequest):
{
  "user_profile": { /* UserProfile */ },
  "match_profile": { /* Match's profile dict */ }
}

// Response (200 OK):
{
  "explanation": "You're both 'Techie' vibe with shared love for coding...\nYou sync well because..."
}
```

---

#### **POST `/api/icebreakers`**
Get 3 personalized conversation starters.
```json
// Response (200 OK):
{
  "curious": "💭 What's something about Techie culture you've been curious about?",
  "funny": "😂 Be honest: is your current playlist embarrassing?",
  "bold": "🔥 If you could change one thing about dating culture here, what would it be?"
}
```

---

#### **POST `/api/persona`**
Generate a creative "Vibe Archetype" for user.
```json
// Response (200 OK):
{
  "title": "The Neon Code Cowboy",
  "full_analysis": "## Your Vibe Archetype: The Neon Code Cowboy\n*Debugging at 3 AM is your meditation...*",
  "generated_at": "now"
}
```

---

#### **POST `/api/bio-generator`**
Generate 3 style variants of user bio.
```json
// Request: { "Vibe": "Techie", "Hobbies": "Coding", ... }

// Response (200 OK):
{
  "mysterious": "🌙 There's more to discover about me than this bio can hold. Techie energy in a Lahore kind of world.",
  "warm": "☀️ Lahore-based Techie looking for genuine connections. Probably overthinking my bio right now.",
  "bold": "⚡ Techie personality. I know what I want. Swipe right if you're tired of the usual."
}
```

---

#### **POST `/api/dealbreakers`**
Analyze potential compatibility issues.
```json
// Response (200 OK):
{
  "insights": [
    {"type": "filter_impact", "category": "smoking", "message": "Your 'No Smoking' filter eliminates about **42%**...", "suggestion": "If you're open to occasional smokers..."}
  ],
  "ai_advice": "You both have compatible lifestyles...\nConsider being open to...",
  "filter_summary": {"city": "Lahore", "strict_city": false, "total_filters": 3},
  "pool_estimate": "~35,000 potential matches"
}
```

---

#### **POST `/api/discover`**
Get hobby/discovery suggestions based on vibe.
```json
// Response (200 OK):
{
  "suggestions": [
    "Hackathons - Perfect for your Techie energy",
    "Weekend road trips - Escape the city chaos together",
    "Food hunting in Lahore - Karachi's street food scene is unmatched"
  ],
  "vibe_matched": "Techie",
  "personalized_reasoning": "As a Techie, you'd love...\nHackathons..."
}
```

---

#### **POST `/api/wavelength`**
Get detailed compatibility breakdown (used for radar chart).
```json
// Response (200 OK):
{
  "overall": 87,
  "dimensions": {
    "vibe_sync": {"score": 92, "label": "Vibe Sync", "desc": "Same Techie wavelength"},
    "lifestyle": {"score": 85, "label": "Lifestyle", "desc": "Different schedules could work"},
    "communication": {"score": 88, "label": "Communication", "desc": "Perfect balance..."},
    "goals": {"score": 100, "label": "Goals", "desc": "Perfectly aligned"},
    "curiosity": {"score": 90, "label": "Curiosity", "desc": "Both love exploring"}
  },
  "summary": "You both have compatible vibes...\nVibe Sync: Same Techie wavelength..."
}
```

---

#### **POST `/api/predict`**
Get poetic predictions of relationship future.
```json
// Response (200 OK):
{
  "prediction": "🌑 They'd discover hidden coffee shops in Lahore...\n🌘 They'd learn that silence speaks louder...\n🌕 In another life, they'd be the one who stays.",
  "verdict": "Same Techie wavelength. You'll understand each other's silences.",
  "shared_hobbies": ["Coding"],
  "fun_fact": "Same Lahore sky. Same dreams."
}
```

---

#### **POST `/api/hidden-truth`**
Reveal 3 layers of hidden truth about user.
```json
// Response (200 OK):
{
  "layer_one": "They speak in punchlines but think in soliloquies.",
  "layer_two": "Because they learned early that love is a language with no Rosetta Stone.",
  "layer_three": "In another life, they'd be the one who stays.",
  "generated_at": "now"
}
```

---

### **💬 CHAT SYSTEM (TURN-BASED)**

#### **POST `/api/chat/personas`**
Get 5 mock personas for community chat.
```json
// Request: None (empty body)
// Response (200 OK):
[
  {"Name": "Ahmed Khan", "Vibe": "Techie", "University": "NUST", "UniversityName": "NUST", "City": "Islamabad", "Hobbies": "Coding, Gaming", "personality": "Chill"},
  {"Name": "Fatima Ali", "Vibe": "Bookworm", "University": "LU", "UniversityName": "Lahore University", "City": "Lahore", "Hobbies": "Reading, Writing", "personality": "Supportive"},
  // ... 3 more personas
]
```

---

#### **POST `/api/chat/initial`**
Get initial intro messages from first 2 personas.
```json
// Request:
{"personas": [ /* array of persona objects from /chat/personas */ ]}

// Response (200 OK):
{
  "messages": [
    {"id": 0, "name": "Ahmed Khan", "university": "NUST", "university_name": "NUST", "city": "Islamabad", "vibe": "Techie", "message": "Hey everyone! Just finished a coding marathon...", "timestamp": "Just now", "turn_index": 0},
    {"id": 1, "name": "Fatima Ali", "university": "LU", "university_name": "Lahore University", "city": "Lahore", "vibe": "Bookworm", "message": "Hi guys! Just finished 'Atomic Habits'...", "timestamp": "Just now", "turn_index": 1}
  ],
  "personas": [ /* same personas */ ],
  "success": true
}
```

---

#### **POST `/api/chat/simulate`**
Get ONE message from the persona whose turn it is (turn-based).
```json
// Request:
{
  "personas": [ /* array of personas */ ],
  "history": [
    {"name": "You", "message": "Hello everyone!"},
    {"name": "Ahmed Khan", "message": "Hey! Just finished coding."}
  ],
  "user_participating": true,
  "user_message": "Hello everyone!",
  "turn_index": 1  // Which persona's turn (0-4)
}

// Response (200 OK):
{
  "messages": [
    {"id": 3, "name": "Fatima Ali", "university": "LU", "university_name": "Lahore University", "city": "Lahore", "vibe": "Bookworm", "message": "That's so interesting! Tell me more...", "timestamp": "Just now", "turn_index": 1}
  ],
  "personas": [ /* personas */ ],
  "success": true,
  "next_turn": 2  // Next persona's turn
}
```

**Key Behavior:**
- Returns ONLY ONE message at a time
- Uses `turn_index` to determine WHO responds
- Cycles through personas (0→1→2→3→4→0...)
- Response is contextual (references chat history)

---

#### **POST `/api/chat/direct`**
Get AI response for 1-on-1 direct chat.
```json
// Request:
{
  "match_data": {
    "Name": "Ayesha Qureshi",
    "Age": 24,
    "Gender": "Female",
    "City": "Lahore",
    "Vibe": "Techie",
    "Profession": "Software Engineer",
    "Education": "MS CS",
    "Hobbies": "Coding, Anime",
    "Smoking": "No",
    "Diet": "Zabiha Halal",
    "Comm_Style": "Direct"
  },
  "chat_history": [
    {"role": "user", "content": "Hey! How's it going?"},
    {"role": "assistant", "content": "Hey! I'm good, just debugging..."}
  ]
}

// Response (200 OK):
{
  "response": "That's awesome! I just finished a coding marathon myself. What's your go-to debugging trick?"
}
```

---

## **5. SERVICES DOCUMENTATION**

### **`services/chat.py` - Turn-Based Community Chat**

**Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `get_mock_personas(count=5)` | int | List[Dict] | Returns 5 pre-defined personas |
| `detect_topic(message)` | str | str | Detects topic (coding/book/gym/food/gaming/general) |
| `get_persona_response(persona, chat_history, turn_context)` | Dict, List, str | str | Generates contextual response |
| `generate_chat_round(personas, chat_history, user_participating, turn_index)` | List, List, bool, int | List[Dict] | Generates ONE message for current turn |
| `get_initial_messages(personas)` | List[Dict] | List[Dict] | Gets 2 intro messages from first 2 personas |

**Persona Structure:**
```python
{
  "Name": "Ahmed Khan",
  "Vibe": "Techie",
  "University": "NUST",        # Short code
  "UniversityName": "NUST",  # Full name
  "City": "Islamabad",
  "Hobbies": "Coding, Gaming",
  "personality": "Chill",
  "intro": "Hey everyone! Just finished a coding marathon..."  # Intro message
}
```

**Topic Detection Keywords:**
- Coding: "code", "python", "debug", "programing", "github", "api"
- Book: "book", "read", "library", "novel", "author"
- Gym: "gym", "workout", "fitness", "protein", "leg day", "gains"
- Food: "food", "biryani", "cook", "restaurant", "eat", "nihari"
- Gaming: "game", "gaming", "valorant", "rank", "play"

---

### **`services/direct_chat.py` - 1-on-1 Chat**

**Function:** `generate_direct_chat_response(match_data, chat_history)`

**Prompt Variables:**
- `{name}`, `{age}`, `{gender}`, `{city}`, `{university}`, `{vibe}`
- `{profession}`, `{education}`, `{hobbies}`, `{lifestyle}`, `{comm_style}`

**Rules:**
1. Keep responses SHORT (1-3 sentences)
2. Be natural, friendly, and slightly flirty but respectful
3. Reference background naturally
4. Ask questions to keep conversation flowing
5. NEVER break character
6. Respond as if meeting for the first time
7. Use emojis sparingly

---

### **`services/explainer.py` - Match Explanations**

**Function:** `get_match_explanation(user_profile, match_profile)`

**Prompt Rules:**
1. Be SPECIFIC - use actual details
2. Find 1-2 genuine shared traits or complementary differences
3. Add one poetic observation about their potential connection
4. Keep it under 3 lines maximum
5. Make each line meaningful and concise
6. Reference shared human experiences, not just hobbies
7. Speak like a wise friend sharing insight
8. Make it feel personal and unique

---

### **`services/icebreakers.py` - Conversation Starters**

**Function:** `get_conversation_starters(user_profile, match_profile)`

**Returns:** Dict with 3 keys: `curious`, `funny`, `bold`

**Styles:**
- 💭 CURIOUS: Thoughtful question that invites sharing
- 😂 FUNNY: Light-hearted observation that brings smiles  
- 🔥 BOLD: Direct but kind opener that sparks dialogue

**Rules:**
1. Generate 3 ultra-concise options (max 8 words each)
2. Each must reference SPECIFIC profile details
3. Make each feel like it was crafted for THIS specific person
4. Reference actual Pakistani/desi life when relevant
5. Every word must carry weight - no fluff

---

### **`services/persona.py` - Vibe Archetypes**

**Function:** `generate_persona(profile, quiz_answers)`

**Returns:**
```json
{
  "title": "The Neon Code Cowboy",
  "full_analysis": "## Your Vibe Archetype: The Neon Code Cowboy\n*Debugging at 3 AM is your meditation...*",
  "generated_at": "now"
}
```

**Archetype Templates:**
- "The {adjective} {noun}"
- "{noun} of {place}"
- "The {noun} {noun}"
- "{type} {noun}"

**Adjectives:** Velvet, Electric, Midnight, Spicy, Golden, Silent, Thunder, Chai, Wandering, Cosmic, Retro, Neon, Urban, Nostalgic, Dreamy, Bold, Mystic, Sunset, Starlight

**Nouns:** Thunder, Cowboy, Sultan, Phoenix, Ninja, Architect, Dreamer, Poet, Warrior, Nomad, Alchemist, Gardener, Storyteller, Maven, Sage, Rogue, Visionary

**Types:** Gamer, Coder, Chef, Artist, Traveler, Writer, Musician, Athlete, Entrepreneur, Dreamer, Explorer, Creator

---

### **`services/bio_gen.py` - Bio Generator**

**Function:** `generate_bio(profile, style)`

**Styles:**
- 🌙 MYSTERIOUS: Intriguing, leaves mystery, makes them want to know more
- ☀️ WARM: Welcoming, approachable, genuine connection vibes
- ⚡ BOLD: Direct, unapologetic, says exactly what they want

**Rules:**
1. Each bio UNIQUE - never recycled phrases
2. Reference SPECIFIC details from their profile
3. Match the TONE requested
4. Keep bios SHORT - 30-50 words max
5. Sound like a real person, not AI
6. Include subtle Pakistani cultural references naturally
7. Never use: "I love to laugh", "My family means everything", "Adventure awaits", "Life is short"
8. Be specific - namedrops, references, quirks work better than generic statements

---

### **`services/detector.py` - Dealbreakers**

**Function:** `analyze_dealbreakers(profile, df)`

**Returns:**
```json
{
  "insights": [{"type": "filter_impact", "category": "smoking", "message": "...", "suggestion": "..."}],
  "ai_advice": "...",
  "filter_summary": {"city": "Lahore", "strict_city": false, "total_filters": 3},
  "pool_estimate": "~35,000 potential matches"
}
```

**City Statistics (Hardcoded):**
```python
DEALBREAKER_STATS = {
    "karachi": {"smoking": 42, "diet_halal": 55, "vegetarian": 8},
    "lahore": {"smoking": 38, "diet_halal": 62, "vegetarian": 12},
    "islamabad": {"smoking": 25, "diet_halal": 58, "vegetarian": 15},
    "rawalpindi": {"smoking": 45, "diet_halal": 50, "vegetarian": 6},
}
```

---

### **`services/discovery.py` - Hobby Discovery**

**Function:** `discover_interests(profile)`

**Returns:**
```json
{
  "suggestions": ["Hackathons - Perfect for your Techie energy", ...],
  "vibe_matched": "Techie",
  "personalized_reasoning": "..."
}
```

**Vibe-Based Hobby Clusters:**
- Gamer: LAN gaming cafes, Esports tournaments, Board game cafes, Speedrunning communities, Game dev workshops
- Techie: Hackathons, Tech meetups, Open source contributions, Startup weekends, Maker spaces
- GymBro: Rock climbing, Hiking groups, CrossFit communities, Sports clubs, Dance classes
- Foodie: Food tours, Cooking classes, Restaurant hopping, Food blogging, Culinary workshops
- Artist: Art galleries, Street art walks, Pottery classes, Photography walks, Art festivals
- Traveler: Travel blogging, Road trip groups, Heritage walks, Weekend getaways, Backpacking communities
- Bookworm: Book clubs, Poetry slams, Writing workshops, Literary festivals, Podcast listening
- Fashionista: Fashion events, Thrift shopping, Style workshops, Fashion photography, Designer meetups
- Entrepreneur: Networking events, Startup incubators, Business masterminds, Pitch competitions, Co-working spaces

---

### **`services/wavelength.py` - Compatibility Analysis**

**Function:** `calculate_wavelength(user_profile, match_profile)`

**Returns:**
```json
{
  "overall": 87,
  "dimensions": {
    "vibe_sync": {"score": 92, "label": "Vibe Sync", "desc": "..."},
    "lifestyle": {"score": 85, "label": "Lifestyle", "desc": "..."},
    "communication": {"score": 88, "label": "Communication", "desc": "..."},
    "goals": {"score": 100, "label": "Goals", "desc": "..."},
    "curiosity": {"score": 90, "label": "Curiosity", "desc": "..."}
  },
  "summary": "..."
}
```

**Scoring Logic:**
- Vibe Sync: 88-96% if same vibe, 82-92% if complementary, else 70-82%
- Lifestyle: 72-88% (80-92% if same city)
- Communication: Based on style combinations
- Goals: 100% if aligned, else 75%
- Curiosity: 78-92% (randomized)

**Overall:** Weighted average: `vibe*0.25 + lifestyle*0.20 + comm*0.25 + goals*0.15 + curiosity*0.15`

---

### **`services/predictor.py` - Future Predictions**

**Function:** `predict_match_future(user_profile, match_profile)`

**Returns:**
```json
{
  "prediction": "🌑 [line1]\n🌘 [line2]\n🌕 [line3]",
  "verdict": "Same Techie wavelength. You'll understand each other's silences.",
  "shared_hobbies": ["Coding"],
  "fun_fact": "Same Lahore sky. Same dreams."
}
```

**Relationship Types:**
- Partner: "If they dated, they'd discover..."
- Friend: "As friends, they'd bond over..."

---

### **`services/hidden_truth.py` - Hidden Truth**

**Function:** `generate_hidden_truth(profile, quiz_dict)`

**Returns:**
```json
{
  "layer_one": "[1-2 sentences - what they show to world]",
  "layer_two": "[1-2 sentences - what drives them]",
  "layer_three": "[1-2 sentences - who they really are]",
  "generated_at": "now"
}
```

**Three Layers:**
1. **Surface Truth:** What they show to the world (mask/performance)
2. **Hidden Truth:** What drives them beneath the surface
3. **Core Truth:** Who they really are at their essence

**Tone:** Mysterious, poetic, ancient-seeming, uncomfortably accurate

**Fallback Truths (if AI fails):**
- Layer One: "They speak in punchlines but think in soliloquies.", "The loudest room in their mind is the one they never enter."
- Layer Two: "Because they learned early that love is a language with no Rosetta Stone.", "The absence taught them how to be a presence."
- Layer Three: "In another life, they'd be the one who stays.", "Their heart is a house with many doors and no locks."

---

## **6. MACHINE LEARNING ENGINE**

**Location:** `algo.py`

### **Class: MatchEngine**

**Initialization:**
```python
engine = MatchEngine(df)  # df = pandas DataFrame from dataset.csv
```

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `_train_model()` | None | None | Trains k-NN model on dataset |
| `find_matches(user_profile, psychographic_profile=None)` | dict, dict | list | Returns top 10 matches |
| `_apply_psychographic_boost(user_vector, profile)` | ndarray, dict | ndarray | Applies psychographic boost |
| `get_stats()` | None | dict | Returns community statistics |

**Feature Processing:**
- **Categorical features:** `['Vibe', 'Religiosity', 'Smoking', 'Diet', 'Comm_Style', 'City']`
- **Text feature:** `'Hobbies'` (TF-IDF vectorization)
- **Algorithm:** k-NN with cosine similarity (50 neighbors)
- **Similarity Score:** `(1 - distance) * 100`

**Matching Logic:**
1. Transform user profile using fitted preprocessor
2. Apply psychographic boost if available
3. Find 50 nearest neighbors
4. Calculate compatibility scores
5. Filter by Goal (Partner→opposite gender, Friends→any)
6. Filter by strict_city if enabled
7. Return top 10 matches

---

## **7. AI FEATURES (Groq)**

**Location:** `groq_client.py`

### **Class: GroqClient**

**Initialization:**
```python
groq_client = GroqClient()  # Reads GROQ_API_KEY from .env
```

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `is_available()` | None | bool | Checks if API key is set |
| `chat(system_prompt, user_message, temperature=0.9, max_tokens=1024)` | str, str, float, int | str | Generates AI response |

**Model:** `llama-3.3-70b-versatile`

**Caching:**
- Cache key: `{system_prompt[:50]}:{user_message[:100]}:{temperature}`
- TTL: 300 seconds (5 minutes)
- Prevents duplicate API calls

**Rate Limiting:**
- Max 25 requests per 60 seconds
- Auto-waits if limit exceeded

**Fallback (if API unavailable):**
```python
"AI features are disabled. Please set GROQ_API_KEY in backend/.env file to enable AI features."
```

---

## **8. CHAT SYSTEM (TURN-BASED)**

### **Flow Diagram:**

```
1. Frontend loads → GET /api/chat/personas
   ↓
2. Frontend gets 5 personas
   ↓
3. Frontend calls POST /api/chat/initial with personas
   ↓
4. Backend returns 2 intro messages (personas 0 and 1)
   ↓
5. User types message → POST /api/chat/simulate
   ↓
6. Backend returns ONE response from persona[NEXT_TURN]
   ↓
7. Frontend increments turn_index = (previous + 1) % 5
   ↓
8. Repeat steps 5-7 for ongoing conversation
```

### **Turn Cycling:**
```
Turn 0: Persona 0 responds
Turn 1: Persona 1 responds
Turn 2: Persona 2 responds
Turn 3: Persona 3 responds
Turn 4: Persona 4 responds
Turn 5: Persona 0 responds (cycles back)
...
```

### **Context Awareness:**
- `generate_chat_round()` builds context from last 3 messages
- `get_persona_response()` detects topic and uses vibe-specific responses
- Responses reference specific previous messages

---

## **9. DATASET STRUCTURE**

**Location:** `backend/data/dataset.csv`

### **Expected Columns:**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Name | str | User's name | "Ahmed Khan" |
| Gender | str | "M" or "F" | "M" |
| Age | int | Age in years | 24 |
| Location | str | City, Province | "Lahore, Punjab" |
| Education | str | Degree | "MS CS" |
| Profession | str | Job title | "Software Engineer" |
| Vibe | str | Vibe category | "Techie" |
| Hobbies | str | Comma-separated | "Coding, Music, Gaming" |
| Religiosity | str | "Practicing", "Moderate", "Not Practicing" | "Practicing" |
| Smoking | str | "No", "Yes", "Occasionally" | "No" |
| Diet | str | "Zabiha Halal", "Anything", "Vegetarian", "Vegan" | "Zabiha Halal" |
| Comm_Style | str | "Direct", "Empathetic", "Humorous", "Analytical" | "Direct" |
| Goal | str | "Partner", "Friends", "Both" | "Partner" |
| City | str | City name | "Lahore" |
| University | str | University code or name | "LU" |

**Minimum Required:** ~1000+ profiles for good matching.

---

## **10. FRONTEND INTEGRATION GUIDE**

### **API Call Examples (JavaScript/TypeScript):**

#### **1. Get Stats (Homepage):**
```typescript
const getStats = async () => {
  const res = await fetch("http://127.0.0.1:8001/api/stats");
  return res.json();
};
```

#### **2. Submit Quiz:**
```typescript
const submitQuiz = async (profile, quizAnswers) => {
  const res = await fetch("http://127.0.0.1:8001/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: profile,
      quiz_answers: quizAnswers
    })
  });
  return res.json();
};
```

#### **3. Find Matches:**
```typescript
const findMatches = async (profile, psychographicProfile) => {
  const res = await fetch(
    `http://127.0.0.1:8001/api/match?psychographic=${encodeURIComponent(JSON.stringify(psychographicProfile || {}))}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    }
  );
  return res.json();
};
```

#### **4. Get AI Explanation:**
```typescript
const getExplanation = async (userProfile, matchProfile) => {
  const res = await fetch("http://127.0.0.1:8001/api/explain-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_profile: userProfile,
      match_profile: matchProfile
    })
  });
  return res.json();
};
```

#### **5. Chat - Get Personas:**
```typescript
const getPersonas = async () => {
  const res = await fetch("http://127.0.0.1:8001/api/chat/personas", {
    method: "POST"
  });
  return res.json();
};
```

#### **6. Chat - Get Initial Messages:**
```typescript
const getInitialMessages = async (personas) => {
  const res = await fetch("http://127.0.0.1:8001/api/chat/initial", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personas })
  });
  return res.json();
};
```

#### **7. Chat - Send Message (Turn-Based):**
```typescript
let turnIndex = 0;

const sendMessage = async (personas, history, userMessage) => {
  const res = await fetch("http://127.0.0.1:8001/api/chat/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personas: personas,
      history: history,
      user_participating: true,
      user_message: userMessage,
      turn_index: turnIndex
    })
  });
  
  const data = await res.json();
  turnIndex = data.next_turn;  // Update turn index
  return data;
};
```

#### **8. Direct Chat (1-on-1):**
```typescript
const sendDirectMessage = async (matchData, chatHistory) => {
  const res = await fetch("http://127.0.0.1:8001/api/chat/direct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      match_data: matchData,
      chat_history: chatHistory
    })
  });
  return res.json();
};
```

---

### **Key Integration Points:**

1. **Onboarding Flow:**
   - Step 0: Welcome → Select Goal (Partner/Friends)
   - Step 0.5: Select Gender → Auto-advance to Step 1
   - Step 1: Select Vibe + Hobbies → Continue to Step 1.5
   - Step 1.5: Select City → Continue to Step 2
   - Step 2: Lifestyle (Religion, Diet, Smoking, Comm Style) → Submit Quiz or Find Match
   - Step 3: Show Matches

2. **Match Display:**
   - Array of matches from `/api/match`
   - Each has `Compatibility_Score`, `Name`, `Vibe`, etc.
   - Use `getExplanation()` for "Why Match?" AI insight
   - Use `getIcebreakers()` for conversation starters

3. **Community Chat:**
   - Load personas with `/api/chat/personas`
   - Get initial messages with `/api/chat/initial`
   - Send user message → get ONE response with `/api/chat/simulate`
   - **Track `turn_index`** - increment and cycle through 0-4
   - Show typing indicator for persona whose turn it is

4. **Direct Chat (from Icebreakers):**
   - When user clicks icebreaker → open chat modal
   - Use `/api/chat/direct` for AI responses
   - Pass full match profile as `match_data`
   - Pass chat history as `chat_history`

---

## **ERROR HANDLING**

### **Common HTTP Status Codes:**

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process response |
| 400 | Bad Request | Show validation error |
| 500 | Internal Server Error | Show "Something went wrong, please try again" |
| CONNECTION_REFUSED | Backend not running | Show "Backend offline, please start server" |

### **Error Response Format:**
```json
{
  "error": "Dataset or MatchEngine not loaded.",
  "success": false,
  "error": "Detailed error message here"
}
```

### **Frontend Error Handling Template:**
```typescript
try {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return await res.json();
} catch (e) {
  console.error("API error:", e);
  // Show user-friendly error message
  setError(e.message || "Something went wrong. Please try again.");
}
```

---

## **QUICK REFERENCE - ENDPOINT SUMMARY**

| Endpoint | Method | Purpose | Key Params |
|----------|--------|---------|------------|
| `/` | GET | API status | None |
| `/api/stats` | GET | Community stats | None |
| `/api/match` | POST | Find matches | UserProfile, psychographic |
| `/api/quiz/questions` | GET | Get quiz | None |
| `/api/quiz/submit` | POST | Submit quiz | profile, quiz_answers |
| `/api/explain-match` | POST | Why match? | user_profile, match_profile |
| `/api/icebreakers` | POST | Conversation starters | user_profile, match_profile |
| `/api/persona` | POST | Vibe archetype | profile, quiz_answers |
| `/api/bio-generator` | POST | Generate bio | profile |
| `/api/dealbreakers` | POST | Analyze issues | profile |
| `/api/discover` | POST | Hobby suggestions | profile |
| `/api/wavelength` | POST | Compatibility chart | user_profile, match_profile |
| `/api/predict` | POST | Future prediction | user_profile, match_profile |
| `/api/hidden-truth` | POST | Three layers truth | profile, quiz_answers |
| `/api/chat/personas` | POST | Get 5 personas | None |
| `/api/chat/initial` | POST | Initial messages | personas |
| `/api/chat/simulate` | POST | ONE chat message | personas, history, turn_index |
| `/api/chat/direct` | POST | 1-on-1 chat | match_data, chat_history |

---

**This documentation covers EVERYTHING you need to know about the backend. You can now build your new frontend from scratch and easily integrate it with all these endpoints!**
