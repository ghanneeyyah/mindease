import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, userId, username: userName } = response.data;
      
      localStorage.setItem("token", token);
      const userData = { id: userId, username: userName };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      toast.success(`Welcome back, ${userName}! 🌿`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      await api.post("/auth/signup", {
        username,
        email,
        passwordHash: password,
      });
      toast.success("Account created! Please login.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out safely. Take care of yourself. 💚");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};