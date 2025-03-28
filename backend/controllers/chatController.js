import axios from 'axios';
import supabase from '../models/supabaseClient.js';

// Start a new chat
export const startNewChat = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "User ID is required" });

  const { data, error } = await supabase.from('chats').insert([{ user_id }]).select();
  if (error) return res.status(400).json({ error: error.message });

  res.json(data[0]);
};

// Send a message
export const sendMessage = async (req, res) => {
  console.log("Received request:", req.body); // Debugging

  const { user_id, chat_id, message } = req.body;
  if (!user_id || !chat_id || !message) {
    console.error("Invalid data received:", req.body);
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model: 'mistral-small-3.1-24b-instruct:free', messages: [{ role: 'user', content: message }] },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    );

    const botResponse = response.data.choices?.[0]?.message?.content || "AI could not process this request.";

    // Store message in Supabase
    const { data, error } = await supabase.from('messages').insert([{ chat_id, user_id, user_message: message, bot_response: botResponse }]);
    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: botResponse });
  } catch (error) {
    console.error("AI response failed:", error.response?.data || error.message);
    res.status(500).json({ error: "AI response failed" });
  }
};

// Get user chats
export const getUserChats = async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase.from('chats').select('*').eq('user_id', user_id).order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  const { chat_id } = req.params;
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chat_id).order('created_at');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
