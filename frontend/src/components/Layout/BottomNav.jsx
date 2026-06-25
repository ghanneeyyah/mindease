import { NavLink, useNavigate } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()

  const navItems = [
    { path: '/chat',      icon: 'fa-regular fa-message',   label: 'Chat'     },
    { path: '/dashboard', icon: 'fa-solid fa-chart-simple', label: 'History'  },
    { path: '/breathing', icon: 'fa-solid fa-leaf',         label: 'Ground'   },
    { path: '/settings',  icon: 'fa-solid fa-gear',         label: 'Settings' },
  ]

  return (
    <>
      {/* Floating crisis button */}
      <button
        onClick={() => navigate('/crisis')}
        className="btn-crisis"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-height) + 16px)',
          right: '16px',
          zIndex: 101,
          borderRadius: '50px',
          padding: '10px 16px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        aria-label="Get crisis help"
      >
        🚨 Help
      </button>

      {/* Bottom bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        maxWidth: 'var(--max-width)',
        height: 'var(--bottom-nav-height)',
        backgroundColor: 'var(--bg-panel)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 8px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
        zIndex: 100
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              opacity: isActive ? 1 : 0.7,
              transition: 'all 0.2s ease',
              padding: '8px 12px',
              gap: '4px'
            })}
          >
            <i className={item.icon} style={{ fontSize: '20px' }}></i>
            <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}