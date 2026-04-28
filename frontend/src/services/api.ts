const API_BASE = ''

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
  strict_city?: boolean;
}

export interface MatchProfile {
  Name: string;
  Compatibility_Score: number;
  Gender: string;
  Age: number;
  Location: string;
  Education: string;
  Profession: string;
  Vibe: string;
  Hobbies: string;
  Religiosity: string;
  Smoking: string;
  Diet: string;
  Comm_Style: string;
}

export interface QuizAnswer {
  question_id: string;
  answer: string;
}

export const getStats = async () => {
  const res = await fetch(`${API_BASE}/api/stats`);
  return res.json();
};

export const findMatches = async (profile: UserProfile, psychographic?: any) => {
  const url = psychographic 
    ? `${API_BASE}/api/match?psychographic=${encodeURIComponent(JSON.stringify(psychographic))}`
    : `${API_BASE}/api/match`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  return res.json();
};

export const getQuizQuestions = async () => {
  const res = await fetch(`${API_BASE}/api/quiz/questions`);
  return res.json();
};

export const submitQuiz = async (profile: UserProfile, quizAnswers: QuizAnswer[]) => {
  const res = await fetch(`${API_BASE}/api/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, quiz_answers: quizAnswers })
  });
  return res.json();
};

export const getExplanation = async (userProfile: UserProfile, matchProfile: any) => {
  const res = await fetch(`${API_BASE}/api/explain-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile })
  });
  return res.json();
};

export const getIcebreakers = async (userProfile: UserProfile, matchProfile: any) => {
  const res = await fetch(`${API_BASE}/api/icebreakers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile: userProfile, match_profile: matchProfile })
  });
  return res.json();
};

export const getPersonas = async () => {
  const res = await fetch(`${API_BASE}/api/chat/personas`, { method: 'POST' });
  return res.json();
};

export const getInitialMessages = async (personas: any[]) => {
  const res = await fetch(`${API_BASE}/api/chat/initial`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personas })
  });
  return res.json();
};

export const simulateChat = async (personas: any[], history: any[], userMessage: string, turnIndex: number) => {
  const res = await fetch(`${API_BASE}/api/chat/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personas,
      history,
      user_participating: true,
      user_message: userMessage,
      turn_index: turnIndex
    })
  });
  return res.json();
};

export const sendDirectMessage = async (matchData: any, chatHistory: any[]) => {
  const res = await fetch(`${API_BASE}/api/chat/direct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      match_data: matchData,
      chat_history: chatHistory
    })
  });
  return res.json();
};
