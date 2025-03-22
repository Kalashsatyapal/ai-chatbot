import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    else router.push("/dashboard"); // Redirect after signup
  };

  const handleLogin = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else router.push("/dashboard"); // Redirect after login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-blur-md text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-400 to-blue-500 text-transparent bg-clip-text mb-6">
            Welcome back
          </h2>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <input
            className="w-full p-3 mb-3 text-cyan-300 rounded-xl border border-transparent outline-none 
             bg-white bg-opacity-10 backdrop-blur-lg shadow-lg placeholder-cyan-400 
             focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-opacity-20 
             transition-all duration-300"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 mb-3 text-cyan-300 rounded-xl border border-transparent outline-none 
              bg-white bg-opacity-10 backdrop-blur-lg shadow-lg placeholder-cyan-400 
              focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-opacity-20 
              transition-all duration-300"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignup}
            className="w-full py-3 mb-2 text-lg font-medium bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-lg shadow-md"
          >
            Signup
          </button>
          <button
            onClick={handleLogin}
            className="w-full py-3 text-lg font-medium bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-lg shadow-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
