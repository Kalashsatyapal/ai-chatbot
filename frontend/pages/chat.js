import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import supabase from '../lib/supabaseClient';

const Chat = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchChats(session.user.id);
      }
    };
    fetchUser();
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history
  const fetchChats = async (user_id) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/history/${user_id}`);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Start a new chat
  const startNewChat = async () => {
    if (!user) return;
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/new`, { user_id: user.id });
      setChats([data, ...chats]);
      setSelectedChat(data.id);
      setMessages([]);
    } catch (error) {
      console.error("Error starting a new chat:", error);
    }
  };

  // Fetch messages for a selected chat
  const fetchMessages = async (chat_id) => {
    setSelectedChat(chat_id);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages/${chat_id}`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages
    if (!user || !selectedChat) {
      console.error("User or selectedChat is missing.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/message`, {
        user_id: user.id,
        chat_id: selectedChat,
        message: message,
      });

      setMessages([...messages, { user_message: message, bot_response: response.data.message }]);
      setMessage(''); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar for Chat History */}
      <div className="w-1/4 bg-gray-800 p-4">
        <button onClick={startNewChat} className="w-full mb-4 p-2 bg-blue-500 rounded">New Chat</button>
        {chats.map((chat) => (
          <div key={chat.id} className={`p-2 cursor-pointer ${selectedChat === chat.id ? 'bg-gray-700' : ''}`} onClick={() => fetchMessages(chat.id)}>
            Chat {new Date(chat.created_at).toLocaleString()}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <p className="bg-blue-500 p-3 rounded-lg inline-block">You: {msg.user_message}</p>
              <p className="bg-green-500 p-3 rounded-lg inline-block mt-2">Bot: {msg.bot_response}</p>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
        <div className="flex p-4">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-grow p-2 rounded bg-gray-700" />
          <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
