import { useEffect, useState } from 'react';
import { getPersonas, getInitialMessages, simulateChat } from '../services/api';

export default function CommunityChat() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    setLoading(true);
    const p = await getPersonas();
    setPersonas(p);
    const res = await getInitialMessages(p);
    setMessages(res.messages || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    const newHistory = [...messages, { name: 'You', message: userMessage }];
    setMessages(newHistory);
    setUserMessage('');
    setLoading(true);
    
    const res = await simulateChat(personas, newHistory, userMessage, turnIndex);
    if (res.messages) {
      setMessages(prev => [...prev, ...res.messages]);
      setTurnIndex(res.next_turn || (turnIndex + 1) % 5);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcf8fa] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-center">Community Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg: any) => (
            <div key={msg.id || Math.random()} className={`flex ${msg.name === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${msg.name === 'You' ? 'bg-black text-white' : 'bg-gray-100'}`}>
                <p className="text-xs font-semibold text-gray-500 mb-1">{msg.name} • {msg.vibe}</p>
                {msg.message}
              </div>
            </div>
          ))}
          {loading && <p className="text-center text-gray-400">Typing...</p>}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 border rounded-full"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} disabled={loading} className="bg-black text-white px-6 rounded-full disabled:bg-gray-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
