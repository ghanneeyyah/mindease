import { Link } from "react-router-dom";

// Login.jsx
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4">
      {/* Title */}
      <h1 className="text-sky-500 text-3xl font-bold mb-8">Login</h1>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-zinc-800 shadow-lg rounded-xl p-8 space-y-6">
        <form className="flex flex-col space-y-4" action="" method="post">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="p-2 rounded border border-gray-600 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="p-2 rounded border border-gray-600 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Submit Button */}
          <Link to={"/home"}>
            <button
                type="submit"
                className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600 transition"
            >
                Login
            </button>
          </Link>
          
        </form>

        {/* Links */}
        <div className="text-center text-gray-400 text-sm">
          <a href="/forgot" className="text-sky-400 hover:underline">
            Forgot password?
          </a>{" "}
          |{" "}
          <Link to="/signup" className="text-sky-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
