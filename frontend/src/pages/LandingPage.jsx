import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="content-area fade-in" style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
    }}>
      
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '16px' }}>
        <Link to="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <i className="fa-solid fa-circle-question"></i>
        </Link>
        <Link to="/settings" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <i className="fa-solid fa-gear"></i>
        </Link>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <i className="fa-solid fa-leaf" style={{ fontSize: '48px', color: 'var(--accent-primary)', marginBottom: '16px' }}></i>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
          MindEase
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
          Your gentle AI companion for tough times
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--crisis-bg)', 
        padding: '12px 16px', 
        borderRadius: 'var(--radius-sm)',
        borderLeft: '4px solid var(--crisis-accent)',
        marginBottom: '40px',
        textAlign: 'left',
        fontSize: '14px',
        color: 'var(--text-primary)'
      }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--crisis-accent)', marginRight: '8px' }}></i>
        <strong>I'm an AI, not a therapist.</strong><br/>
        If this is an emergency, call 988.
      </div>

      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link to="/login" className="btn-primary" style={{ padding: '16px', fontSize: '18px' }}>
          <i className="fa-regular fa-message"></i> Start chatting
        </Link>
        
        <p style={{ margin: '16px 0 8px', color: 'var(--text-secondary)' }}>How are you feeling right now?</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="btn-secondary" style={{ fontSize: '14px' }}>😊 Calm</button>
          <button className="btn-secondary" style={{ fontSize: '14px' }}>😟 Anxious</button>
          <button className="btn-secondary" style={{ fontSize: '14px' }}>😢 Sad</button>
          <button className="btn-secondary" style={{ fontSize: '14px' }}>😤 Angry</button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Link to="/breathing" className="btn-secondary" style={{ flex: 1, flexDirection: 'column', padding: '16px 8px' }}>
            <i className="fa-solid fa-wind" style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--accent-primary)' }}></i>
            <span style={{ fontSize: '12px' }}>Grounding</span>
          </Link>
          <Link to="/faq" className="btn-secondary" style={{ flex: 1, flexDirection: 'column', padding: '16px 8px' }}>
            <i className="fa-solid fa-book" style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--accent-primary)' }}></i>
            <span style={{ fontSize: '12px' }}>Guide</span>
          </Link>
          <Link to="/crisis" className="btn-secondary" style={{ flex: 1, flexDirection: 'column', padding: '16px 8px' }}>
            <i className="fa-solid fa-truck-medical" style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--crisis-accent)' }}></i>
            <span style={{ fontSize: '12px' }}>Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
