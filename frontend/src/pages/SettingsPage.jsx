import { useState, useEffect } from "react";
import TopNavigationBar from "../components/TopNavigationBar";

export default function SettingsPage() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.body.removeAttribute('data-theme');
    } else {
      // System auto
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
      }
    }
  }, [theme]);

  const SettingRow = ({ label, control }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
      {control}
    </div>
  );

  return (
    <div className="content-area fade-in" style={{ padding: 0 }}>
      <TopNavigationBar title="Settings" showBack={true} />
      
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Privacy</h3>
        <div className="card" style={{ marginBottom: '32px' }}>
          <SettingRow 
            label="Save chat history" 
            control={<input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />} 
          />
          <SettingRow 
            label="Allow emotion detection" 
            control={<input type="checkbox" style={{ width: '18px', height: '18px' }} />} 
          />
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Appearance</h3>
        <div className="card" style={{ marginBottom: '32px' }}>
          <SettingRow 
            label="Theme" 
            control={
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Auto</option>
              </select>
            } 
          />
          <SettingRow 
            label="Font size" 
            control={
              <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <option>Small</option>
                <option selected>Medium</option>
                <option>Large</option>
              </select>
            } 
          />
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Accessibility</h3>
        <div className="card" style={{ marginBottom: '32px' }}>
          <SettingRow label="Reduce animations" control={<input type="checkbox" style={{ width: '18px', height: '18px' }} />} />
          <SettingRow label="High contrast mode" control={<input type="checkbox" style={{ width: '18px', height: '18px' }} />} />
          <SettingRow label="Dyslexia-friendly font" control={<input type="checkbox" style={{ width: '18px', height: '18px' }} />} />
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Data Management</h3>
        <div className="card" style={{ marginBottom: '32px' }}>
          <button style={{ width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', color: '#E53E3E', fontSize: '15px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            Clear all conversations
          </button>
          <button style={{ width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', color: 'var(--text-primary)', fontSize: '15px', cursor: 'pointer' }}>
            Download my data
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '40px 0' }}>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
            <span>|</span>
            <a href="#" style={{ color: 'inherit' }}>Terms of Use</a>
          </div>
          <p style={{ color: 'var(--crisis-accent)', fontSize: '14px', fontWeight: '500' }}>
            <i className="fa-solid fa-truck-medical"></i> Crisis resources (always available)
          </p>
        </div>
      </div>
    </div>
  );
}
