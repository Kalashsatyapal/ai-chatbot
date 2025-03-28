import supabase from '../models/supabaseClient.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ user });
};
