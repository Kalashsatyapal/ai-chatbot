import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-white">Welcome to <span className="text-blue-400">ChatNova</span></h1>
        <p className="text-gray-300 mb-6">Your AI-powered chatbot experience</p>
        <div className="flex space-x-4">
          <Link href="/signup">
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md">
              Signup
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all shadow-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
