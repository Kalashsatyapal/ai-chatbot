import axios from 'axios';
import supabase from '../models/supabaseClient.js';

export const sendMessage = async (req, res) => {
  const { user_id, chat_id, message } = req.body;

  // Call OpenRouter API
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistral-small-3.1-24b-instruct:free',
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    }
  );

  const botResponse = response.data.choices[0].message.content;

  // Store the message and response in Supabase
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id, user_message: message, bot_response: botResponse }]);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ message: botResponse });
};
