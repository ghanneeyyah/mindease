import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function BreathingPage() {
  const [isActive, setIsActive] = useState(false);
  const [instruction, setInstruction] = useState("Ready");

  useEffect(() => {
    let interval;
    if (isActive) {
      // Very basic state machine for the text instruction to match the 14s cycle (4s, 4s, 6s)
      const cycle = () => {
        setInstruction("Inhale...");
        setTimeout(() => setInstruction("Hold..."), 4000);
        setTimeout(() => setInstruction("Exhale..."), 8000);
      };
      
      cycle(); // initial
      interval = setInterval(cycle, 14000);
    } else {
      setInstruction("Ready");
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="content-area fade-in" style={{ padding: 0 }}>
      <TopNavigationBar title="Grounding" />
      
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Follow the breathing ball</p>

        <div style={{
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            animation: isActive ? 'breathe 14s infinite ease-in-out' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'transform 0.5s ease'
          }}>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '32px', height: '30px' }}>
          {instruction}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Inhale 4s → Hold 4s → Exhale 6s
        </p>

        <button 
          className="btn-primary" 
          style={{ width: '100%', maxWidth: '300px', marginBottom: '40px' }}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause exercise" : "Start animation"}
        </button>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 16px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
            <span style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Other grounding tools</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-primary)' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <i className="fa-solid fa-eye" style={{ color: 'var(--accent-primary)', width: '20px' }}></i>
              Name 5 things you can see
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <i className="fa-solid fa-hand-sparkles" style={{ color: 'var(--accent-primary)', width: '20px' }}></i>
              Feel 4 things around you
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <i className="fa-solid fa-ear-listen" style={{ color: 'var(--accent-primary)', width: '20px' }}></i>
              Listen for 3 sounds
            </li>
          </ul>
        </div>

        <Link to="/chat" className="btn-secondary" style={{ marginTop: '40px', width: '100%', maxWidth: '300px' }}>
          I feel calmer → back to chat
        </Link>
      </div>
    </div>
  );
}
