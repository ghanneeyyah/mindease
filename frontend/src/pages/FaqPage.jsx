import { Link } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function FaqPage() {
  const faqs = [
    {
      q: "What emotions can the bot detect?",
      a: "Joy, sadness, anxiety, anger, fear, loneliness, and signs of crisis."
    },
    {
      q: "What happens if I say something threatening?",
      a: "The bot will pause conversation, show hotlines, and suggest grounding. It does NOT contact anyone for you."
    },
    {
      q: "Is my data private?",
      a: "Yes. Chats stay on your device unless you enable cloud backup (off by default)."
    },
    {
      q: "Can the bot replace therapy?",
      a: "No. It's a support tool, not medical care."
    }
  ];

  return (
    <div className="content-area fade-in" style={{ padding: 0 }}>
      <TopNavigationBar title="How MindEase Works" showBack={true} />
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: 'var(--text-primary)',
                display: 'flex',
                gap: '12px'
              }}>
                <span style={{ color: 'var(--accent-primary)' }}>❓</span>
                {faq.q}
              </h3>
              <p style={{ 
                fontSize: '15px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                display: 'flex',
                gap: '12px'
              }}>
                <span style={{ color: 'var(--accent-secondary)' }}>→</span>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <Link to="/chat" className="btn-primary" style={{ width: '100%' }}>
          <i className="fa-regular fa-message"></i> Still have questions? Ask the bot
        </Link>
      </div>
    </div>
  );
}
