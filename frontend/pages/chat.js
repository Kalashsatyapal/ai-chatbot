import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import supabase from '../lib/supabaseClient';

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/message`, {
        user_id: user.id,
        message,
      });

      setMessages([...messages, { user: message, bot: response.data.message }]);
      setMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-4">Chat</h2>
        <div className="h-96 overflow-y-auto bg-gray-800 p-4 rounded-lg">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p className="text-blue-400"><strong>You:</strong> {msg.user}</p>
              <p className="text-green-400"><strong>Bot:</strong> {msg.bot}</p>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="flex-grow px-4 py-3 rounded-lg bg-gray-800 text-white outline-none"
          />
          <button 
            onClick={sendMessage} 
            className="ml-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
