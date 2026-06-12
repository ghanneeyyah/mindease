import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
  const navItems = [
    { path: '/chat', icon: 'fa-regular fa-message', label: 'Chat' },
    { path: '/history', icon: 'fa-solid fa-chart-simple', label: 'History' },
    { path: '/breathing', icon: 'fa-solid fa-leaf', label: 'Ground' },
    { path: '/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
    { path: '/crisis', icon: 'fa-solid fa-truck-medical', label: 'Crisis', isCrisis: true },
  ];

  return (
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
      padding: '0 10px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
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
            color: isActive 
              ? (item.isCrisis ? 'var(--crisis-accent)' : 'var(--accent-primary)') 
              : 'var(--text-secondary)',
            opacity: isActive ? 1 : 0.7,
            transition: 'all 0.2s ease',
            padding: '8px'
          })}
        >
          {({ isActive }) => (
            <>
              <i 
                className={item.icon} 
                style={{ 
                  fontSize: '22px', 
                  marginBottom: '4px',
                  color: item.isCrisis ? 'var(--crisis-accent)' : 'inherit',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                }}
              ></i>
              <span style={{ fontSize: '11px', fontWeight: isActive ? '600' : '400' }}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
