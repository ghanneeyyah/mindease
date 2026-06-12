import { Link } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function HistoryPage() {
  const mockHistory = [
    { id: 1, date: "Apr 24", title: "Sadness & loneliness" },
    { id: 2, date: "Apr 22", title: "Anxiety about work" }
  ];

  return (
    <div className="content-area fade-in" style={{ padding: 0 }}>
      <TopNavigationBar 
        title="Dashboard" 
        showBack={true} 
        rightAction={
          <Link to="/settings" style={{ color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-gear"></i>
          </Link>
        }
      />
      
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Mood this week:</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          {['😊', '😐', '😟', '😢', '😢', '😐', '😊'].map((emoji, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                backgroundColor: 'var(--bg-panel)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)',
                fontSize: '18px'
              }}>
                {emoji}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {['M','T','W','T','F','S','S'][i]}
              </span>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Past conversations:</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {mockHistory.map(item => (
            <div key={item.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>
                  <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>{item.date} –</span>
                  {item.title}
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View</button>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: '#E53E3E' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button className="btn-secondary" style={{ flex: 1, fontSize: '13px' }}>Export all data</button>
          <button className="btn-secondary" style={{ flex: 1, fontSize: '13px', color: '#E53E3E' }}>Delete history</button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          ⚠️ These are stored only on your device.
        </p>
      </div>
    </div>
  );
}
