import { useNavigate } from "react-router-dom";

export default function TopNavigationBar({ title, showBack = true, rightAction }) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: 'var(--bg-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button 
            onClick={() => navigate(-1)} 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              marginLeft: '-8px'
            }}
            aria-label="Go back"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        )}
      </div>
      
      <h2 style={{
        flex: 2,
        textAlign: 'center',
        margin: 0,
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
      </h2>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {rightAction}
      </div>
    </div>
  );
}
