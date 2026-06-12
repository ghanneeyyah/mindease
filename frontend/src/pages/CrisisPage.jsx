import { Link } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function CrisisPage() {
  return (
    <div className="content-area fade-in" style={{ padding: 0, backgroundColor: 'var(--crisis-bg)' }}>
      <TopNavigationBar title="Safety Resources" showBack={true} />
      
      <div style={{ padding: '20px' }}>
        <p style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
          If you're in immediate danger:
        </p>

        <div className="card" style={{ borderLeft: '4px solid var(--crisis-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              backgroundColor: 'var(--crisis-accent)', 
              color: 'white', 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              <i className="fa-solid fa-phone"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>988 Suicide & Crisis Lifeline</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Call or text 24/7</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--crisis-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              backgroundColor: 'var(--crisis-accent)', 
              color: 'white', 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              <i className="fa-solid fa-comment-sms"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Crisis Text Line</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Text HOME to 741741</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0 16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          <span style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Grounding you can do now</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
        </div>

        <Link to="/breathing" className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '12px', backgroundColor: 'var(--bg-panel)' }}>
          <i className="fa-solid fa-wind" style={{ color: 'var(--accent-primary)', width: '24px' }}></i>
          1-minute breathing bubble
        </Link>
        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', backgroundColor: 'var(--bg-panel)' }}>
          <i className="fa-solid fa-hand-holding-heart" style={{ color: 'var(--accent-primary)', width: '24px' }}></i>
          5-4-3-2-1 senses exercise
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0 16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          <span style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Safety plan template</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
        </div>

        <div className="card">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>My triggers: _____</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>People I can call: _____</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Places that calm me: _____</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-secondary" style={{ flex: 1, fontSize: '14px' }}>
            <i className="fa-solid fa-download"></i> Download PDF
          </button>
          <button className="btn-secondary" style={{ flex: 1, fontSize: '14px' }}>
            <i className="fa-regular fa-copy"></i> Copy Hotlines
          </button>
        </div>
      </div>
    </div>
  );
}
