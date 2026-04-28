import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExplanation, getIcebreakers, sendDirectMessage } from '../services/api';

export default function Chat() {
  const { name } = useParams();
  const [matchData, setMatchData] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [explanation, setExplanation] = useState('');
  const [icebreakers, setIcebreakers] = useState<any>(null);

  useEffect(() => {
    // In real app, fetch match data by name
    // For now, use sample data
    const data = {
      Name: name,
      Age: 24,
      Gender: 'Female',
      City: 'Lahore',
      Vibe: 'Techie',
      Profession: 'Software Engineer',
      Education: 'MS CS',
      Hobbies: 'Coding, Anime',
      Smoking: 'No',
      Diet: 'Zabiha Halal',
      Comm_Style: 'Direct'
    };
    setMatchData(data);
    getExplanation({ Vibe: 'Techie', Goal: 'Partner' }, data).then(r => setExplanation(r.explanation));
    getIcebreakers({ Vibe: 'Techie', Goal: 'Partner' }, data).then(setIcebreakers);
  }, [name]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setMessage('');
    const res = await sendDirectMessage(matchData, newHistory);
    setChatHistory([...newHistory, { role: 'assistant', content: res.response }]);
  };

  return (
    <div className="min-h-screen bg-[#fcf8fa] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold">{name}</h2>
          {explanation && <p className="text-sm text-gray-500 mt-2">{explanation}</p>}
        </div>

        {icebreakers && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm font-semibold mb-2">Icebreakers:</p>
            <div className="space-y-2">
              {icebreakers.curius && <button onClick={() => setMessage(icebreakers.curius)} className="block text-sm text-left p-2 bg-white rounded hover:bg-gray-100">{icebreakers.curius}</button>}
              {icebreakers.funny && <button onClick={() => setMessage(icebreakers.funny)} className="block text-sm text-left p-2 bg-white rounded hover:bg-gray-100">{icebreakers.funny}</button>}
              {icebreakers.bold && <button onClick={() => setMessage(icebreakers.bold)} className="block text-sm text-left p-2 bg-white rounded hover:bg-gray-100">{icebreakers.bold}</button>}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 border rounded-full"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="bg-black text-white px-6 rounded-full">Send</button>
        </div>
      </div>
    </div>
  );
}
