import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Trying to connect to local backend
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        navigate("/chat");
      } else {
        const errData = await response.json();
        setError(errData.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.warn("Backend not available, falling back to mock login");
      // Fallback for UI testing
      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("username", username);
      navigate("/chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area fade-in" style={{ padding: 0 }}>
      <TopNavigationBar title="Login" />
      
      <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <i className="fa-solid fa-leaf" style={{ fontSize: '40px', color: 'var(--accent-primary)', marginBottom: '24px' }}></i>
        <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Welcome Back</h1>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #ddd',
                backgroundColor: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #ddd',
                backgroundColor: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
