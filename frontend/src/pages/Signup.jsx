import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4">
      <h1 className="text-sky-500 text-3xl font-bold mb-8">Sign Up</h1>

      <div className="w-full max-w-sm bg-zinc-800 shadow-lg rounded-xl p-8 space-y-6 mt-4">
        <form className="flex flex-col space-y-4" method="post">
          {/* First Name */}
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-gray-200 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              className="p-2 rounded border border-gray-600 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-gray-200 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              className="p-2 rounded border border-gray-600 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="userName" className="text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Choose a username"
              className="p-2 rounded border border-gray-600 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

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

          {/* Submit */}
          <Link to={"/login"}>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600 transition"
          >
            Sign Up
          </button>
          </Link>
        </form>

        <div className="text-center text-gray-400 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
