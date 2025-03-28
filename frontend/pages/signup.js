import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signup successful!');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center w-96">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Signup</h2>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
