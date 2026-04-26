const API_BASE = "http://127.0.0.1:8001";

export interface UserProfile {
  Vibe: string;
  Goal: string;
  Gender: string;
  Hobbies: string;
  Smoking: string;
  Diet: string;
  Religiosity: string;
  Comm_Style: string;
  City: string;
  strict_city: boolean;
}

export interface MatchProfile {
  Name: string;
  Compatibility_Score: number;
  Gender: string;
  Age: number | string;
  Location: string;
  Education: string;
  Profession: string;
  Vibe: string;
  Hobbies: string;
  [key: string]: any;
}

export const api = {
  async getStats() {
    const res = await fetch(`${API_BASE}/api/stats`);
    return res.json();
  },

  async getQuizQuestions() {
    const res = await fetch(`${API_BASE}/api/quiz/questions`);
    return res.json();
  },

  async submitQuiz(profile: UserProfile, quizAnswers: { question_id: string; answer: string }[]) {
    const res = await fetch(`${API_BASE}/api/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, quiz_answers: quizAnswers }),
    });
    return res.json();
  },

  async matchProfiles(profile: UserProfile, psychographic?: any) {
    const res = await fetch(`${API_BASE}/api/match?psychographic=${encodeURIComponent(JSON.stringify(psychographic || {}))}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getMatchExplanation(userProfile: UserProfile, matchProfile: MatchProfile) {
    const res = await fetch(`${API_BASE}/api/explain-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile }),
    });
    const data = await res.json();
    return data;
  },

  async getIcebreakers(userProfile: UserProfile, matchProfile: MatchProfile) {
    const res = await fetch(`${API_BASE}/api/icebreakers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile }),
    });
    const data = await res.json();
    return data;
  },

  async getPersona(profile: UserProfile, quizAnswers?: any) {
    const res = await fetch(`${API_BASE}/api/persona`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, quiz_answers: quizAnswers }),
    });
    return res.json();
  },

  async getBioGenerator(profile: UserProfile) {
    const res = await fetch(`${API_BASE}/api/bio-generator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    return res.json();
  },

  async getDealbreakers(profile: UserProfile) {
    const res = await fetch(`${API_BASE}/api/dealbreakers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    return res.json();
  },

  async getDiscovery(profile: UserProfile) {
    const res = await fetch(`${API_BASE}/api/discover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    return res.json();
  },

  async getWavelength(userProfile: UserProfile, matchProfile: MatchProfile) {
    const res = await fetch(`${API_BASE}/api/wavelength`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile }),
    });
    return res.json();
  },

  async getPrediction(userProfile: UserProfile, matchProfile: MatchProfile) {
    const res = await fetch(`${API_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile }),
    });
    return res.json();
  },

  async getHiddenTruth(profile: UserProfile, quizAnswers?: any) {
    const res = await fetch(`${API_BASE}/api/hidden-truth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, quiz_answers: quizAnswers }),
    });
    return res.json();
  },
};