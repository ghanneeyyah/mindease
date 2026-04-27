import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-700 font-mono">
      
      {/* Typewriter Text */}
      <p className="text-xl p-4 overflow-hidden whitespace-nowrap border-r-2 border-black animate-typewriter animate-blink">
        Welcome to TermiChat
      </p>

      {/* Card */}
      <div className="flex flex-col justify-center items-center bg-neutral-900 w-64 h-64 p-8 text-zinc-300 rounded-md space-y-10 shadow-lg">
        <p className="text-lg">Start Chatting</p>

        <Link to="/login">
          <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition">
            Enter
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
