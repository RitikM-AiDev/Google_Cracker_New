import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle2, ArrowLeft } from 'lucide-react';
import bgImage0 from '../assets/google_cafeteria_bright.png';


export default function ApplySection() {
  const [appName, setAppName] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [appGitHub, setAppGitHub] = useState("");
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appDiscord, setAppDiscord] = useState("");
  const navigate = useNavigate();

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!appName || !appEmail || !appGitHub) return;
    setAppSubmitted(true);
  };

  return (
    <section className="apply-section" id="apply-now" style={{ backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.40)), url(${bgImage0})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', padding: '4rem 0' }}>
      <div className="container text-center max-w-md">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2rem',
            padding: '0.5rem 1.2rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
          id="apply-back-btn"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <div className="glass-card" style={{ maxWidth: '1480px', width: '100%', boxSizing: 'border-box', margin: '0 auto 2.5rem', padding: '2.5rem 2rem', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.22)', borderRadius: '20px' }}>
          <div className="badge-accent margin-auto">
            <span className="pulse-dot"></span> APPLICATIONS ARE NOW OPEN
          </div>
          <h2 style={{ color: '#ffffff', marginTop: '1rem' }}>Start Your Velocity Journey</h2>
          <p style={{ color: '#cbd5e1', marginBottom: 0 }}>Will you maintain consistency, ship projects, and unlock premium developer ranks? Apply to join the cohort of 100 dedicated developers.</p>
        </div>

        {!appSubmitted ? (
          <form id="application-form" className="application-form glass-card" onSubmit={handleApplicationSubmit}>
            <div className="form-group text-left">
              <label className="form-label mono-font" htmlFor="app-name">Name</label>
              <input
                type="text"
                id="app-name"
                className="form-input"
                placeholder="e.g., Marcus Aurelius"
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <div className="form-group text-left">
              <label className="form-label mono-font" htmlFor="app-email">Email Address</label>
              <input
                type="email"
                id="app-email"
                className="form-input"
                placeholder="e.g., marcus@developers.com"
                required
                value={appEmail}
                onChange={(e) => setAppEmail(e.target.value)}
              />
            </div>
            <div className="form-group text-left">
              <label className="form-label mono-font" htmlFor="app-GitHub">GitHub Username</label>
              <input
                type="text"
                id="app-GitHub"
                className="form-input"
                placeholder="e.g., @coder_marcus"
                required
                value={appGitHub}
                onChange={(e) => setAppGitHub(e.target.value)}
              />
            </div>
             <div className="form-group text-left">
              <label className="form-label mono-font" htmlFor="app-discord">Discord UserId</label>
              <input
                type="number"
                id="app-discord"
                className="form-input"
                placeholder="e.g., 1234567890"
                required
                value={appDiscord}
                onChange={(e) => setAppDiscord(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: "20px" }}><Rocket size={16} style={{ marginRight: '6px' }} /> Submit Application</button>
          </form>
        ) : (
          <div className="form-success-msg" id="application-success">
            <div className="success-icon"><CheckCircle2 size={36} /></div>
            <h3>Application Logged!</h3>
            <p>We've logged your credentials. Check your email for onboarding interview slots and next actions.</p>
          </div>
        )}
      </div>
    </section>
  );
}
