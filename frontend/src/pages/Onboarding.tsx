import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitQuiz, findMatches } from '../services/api';

type Step = 'goal' | 'gender' | 'vibe' | 'hobbies' | 'lifestyle' | 'quiz' | 'matches';

const VIBES = ['Techie', 'GymBro', 'Gamer', 'Foodie', 'Bookworm', 'Traveler', 'Artist', 'Fashionista', 'Entrepreneur'];
const HOBBIES_LIST = ['Coding', 'Gaming', 'Reading', 'Traveling', 'Cooking', 'Photography', 'Music', 'Fitness', 'Writing', 'Dancing', 'Anime', 'Cars', 'Coffee', 'Binge Watch', 'Chai', 'Rain', 'Novels', 'Smoking', 'Late Night Drives', 'Poetry', 'Shopping', 'Trucks', 'Surfing', 'Beach', 'Biking', 'Guns', 'Nature', 'Hiking', 'Vlogs', 'Design', 'Writing', 'Calligraphy', 'Drama', 'Tiktok', 'Stocks', 'Finance', 'Networking', 'Suits', 'Charity', 'Books', 'Nasheeds', 'Quran', 'Mosque', 'Party', 'Nightlife', 'DJing', 'Dancing', 'Cars', 'AI', 'Crypto', 'PC Builds', 'Mobile Games', 'Valorant', 'Anime', 'Manga'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('goal');
  const [profile, setProfile] = useState<any>({});
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGoal = (goal: string) => {
    setProfile({ ...profile, Goal: goal });
    setStep('gender');
  };

  const handleGender = (gender: string) => {
    setProfile({ ...profile, Gender: gender });
    setStep('vibe');
  };

  const handleVibe = (vibe: string) => {
    setProfile({ ...profile, Vibe: vibe });
    setStep('hobbies');
  };

  const toggleHobby = (h: string) => {
    setHobbies(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  const handleHobbiesNext = () => {
    setProfile({ ...profile, Hobbies: hobbies.join(', ') });
    setStep('lifestyle');
  };

  const handleLifestyle = async () => {
    setProfile({ ...profile, City: profile.City || 'Lahore' });
    setLoading(true);
    const q = await getQuizQuestions();
    setQuizQuestions(q.questions);
    setStep('quiz');
    setLoading(false);
  };

  const handleQuizAnswer = (qId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [qId]: answer });
  };

  const handleQuizSubmit = async () => {
    setLoading(true);
    const answers = Object.entries(quizAnswers).map(([qId, answer]) => ({ question_id: qId, answer }));
    const result = await submitQuiz(profile, answers);
    const matchResults = await findMatches(profile, result.psychographic_profile);
    setMatches(matchResults);
    setStep('matches');
    setLoading(false);
  };

  if (step === 'matches') {
    return <MatchesList matches={matches} profile={profile} />;
  }

  return (
    <div className="min-h-screen bg-[#fcf8fa] p-6">
      <div className="max-w-2xl mx-auto">
        {step === 'goal' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">What are you looking for?</h2>
            <div className="space-y-4">
              {['Partner', 'Friends', 'Both'].map(g => (
                <button key={g} onClick={() => handleGoal(g)}
                  className="block w-full p-4 bg-white rounded-xl hover:bg-gray-50 border-2 border-transparent hover:border-black transition">
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'gender' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Your gender?</h2>
            <div className="space-y-4">
              {['Male', 'Female'].map(g => (
                <button key={g} onClick={() => handleGender(g)}
                  className="block w-full p-4 bg-white rounded-xl hover:bg-gray-50 border-2 border-transparent hover:border-black transition">
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'vibe' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Select your vibe</h2>
            <div className="grid grid-cols-3 gap-3">
              {VIBES.map(v => (
                <button key={v} onClick={() => handleVibe(v)}
                  className="p-4 bg-white rounded-xl hover:bg-gray-50 border-2 border-transparent hover:border-black transition text-sm">
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'hobbies' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Pick your hobbies</h2>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {HOBBIES_LIST.map(h => (
                <button key={h} onClick={() => toggleHobby(h)}
                  className={`p-2 rounded-lg text-sm border-2 transition ${
                    hobbies.includes(h) ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black'
                  }`}>
                  {h}
                </button>
              ))}
            </div>
            <button onClick={handleHobbiesNext} disabled={hobbies.length === 0}
              className="w-full p-4 bg-black text-white rounded-xl font-semibold disabled:bg-gray-300">
              Continue
            </button>
          </div>
        )}

        {step === 'lifestyle' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Lifestyle preferences</h2>
            <div className="space-y-4 bg-white p-6 rounded-2xl">
              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <select onChange={e => setProfile({...profile, City: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Faisalabad</option>
                  <option>Multan</option>
                  <option>Peshawar</option>
                  <option>Quetta</option>
                  <option>Hyderabad</option>
                  <option>Sialkot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Smoking</label>
                <select onChange={e => setProfile({...profile, Smoking: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                  <option>Occasionally</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Diet</label>
                <select onChange={e => setProfile({...profile, Diet: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option>Anything</option>
                  <option>Zabiha Halal Only</option>
                  <option>Vegetarian</option>
                  <option>Halal (Eats Out)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Religiosity</label>
                <select onChange={e => setProfile({...profile, Religiosity: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option>Practicing</option>
                  <option>Moderate</option>
                  <option>Not Practicing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Communication Style</label>
                <select onChange={e => setProfile({...profile, Comm_Style: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option>Direct</option>
                  <option>Empathetic</option>
                  <option>Humorous</option>
                  <option>Analytical</option>
                </select>
              </div>
              <button onClick={handleLifestyle} disabled={loading}
                className="w-full p-4 bg-black text-white rounded-xl font-semibold mt-4">
                {loading ? 'Loading...' : 'Continue to Quiz'}
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Quick Quiz</h2>
            <div className="space-y-6">
              {quizQuestions.map((q: any) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl">
                  <p className="font-semibold mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: any) => (
                      <button key={opt.id} onClick={() => handleQuizAnswer(q.id, opt.id)}
                        className={`block w-full p-3 text-left rounded-lg border-2 transition ${
                          quizAnswers[q.id] === opt.id ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200 hover:border-black'
                        }`}>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleQuizSubmit} disabled={loading || Object.keys(quizAnswers).length < 5}
                className="w-full p-4 bg-black text-white rounded-xl font-semibold">
                {loading ? 'Finding Matches...' : 'Find My Matches'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchesList({ matches, profile }: { matches: any[], profile: any }) {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Your Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{m.Name}</h3>
                <p className="text-sm text-gray-500">{m.Vibe} • {m.Age} • {m.Location}</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {m.Compatibility_Score}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{m.Profession} • {m.Education}</p>
            <p className="text-sm text-gray-500 mb-4">{m.Hobbies}</p>
            <button onClick={() => navigate(`/chat/${m.Name}`)}
              className="w-full p-3 bg-black text-white rounded-xl font-semibold">
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
