import { useNavigate } from "react-router-dom"

export default function TopNavigationBar({ title, showBack = true, backPath, rightAction }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1)
    }
  }

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

      {/* Left — back button */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              marginLeft: '-8px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Go back"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
      </div>

      {/* Center — page title */}
      <h2 style={{
        flex: 2,
        textAlign: 'center',
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--text-primary)'
      }}>
        {title}
      </h2>

      {/* Right — optional action slot */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {rightAction}
      </div>

    </div>
  )
}