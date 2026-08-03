import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, User, Eye, EyeOff, ShieldAlert, Key, ArrowRight } from 'lucide-react';
import ConnectGithub from './ConnectGithub';
import { BACKEND_URL } from '../constants';

/* ── Light theme glassmorphism tokens (Realistic Glass) ── */
const light = {
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.65), inset 0 -1px 2px rgba(0, 0, 0, 0.04)',
    padding: '2.25rem 2.75rem',
    position: 'relative',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 0.75rem 0.75rem 2.6rem',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    borderRadius: '40px',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  },
  inputPw: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 2.6rem 0.75rem 2.6rem',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    borderRadius: '40px',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#0f172a',
  },
};

export default function Login({ earnXP }) {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConnectOverlay, setShowConnectOverlay] = useState(false);
  const navigate = useNavigate();

  const checkGithubAccess = async (email) => {
    try {
      const res = await fetch(`${BACKEND_URL}/check/github/access?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const isAuthorized = data.authorize === true || data.autho === true;
      if (isAuthorized) {
        navigate('/sprint');
      } else {
        setShowConnectOverlay(true);
      }
    } catch (err) {
      console.error("Error verifying GitHub access:", err);
      setShowConnectOverlay(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enforce complete scroll lock on document body and html while route is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!handle || !password) {
      setErrorMsg('CRITICAL_ERR: Missing authentication credentials.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/logininpage`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ email: handle, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(`AUTH_ERR [${res.status}]: ${data.detail ?? 'Unknown error'}`);
        setIsSubmitting(false);
        return;
      }
      else {
        localStorage.setItem("email", handle);
        localStorage.setItem("login_time", Date.now().toString());
      }

      /* ── Success flow ── */
      const logs = [
        `Initializing authentication handshake...`,
        `Verifying candidate handle: ${handle}...`,
        `Decrypting access key security layer...`,
        `Handshake success. Welcome to Velocity Kernel.`,
        data.checkin_awarded
          ? `✅ Daily Check-in XP awarded: +10 XP`
          : `ℹ️  Check-in already claimed today. Come back tomorrow!`,
      ];

      logs.forEach((log, index) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, log]);
          if (index === logs.length - 1) {
            setTimeout(() => {
              checkGithubAccess(handle);
            }, 800);
          }
        }, (index + 1) * 400);
      });

    } catch (err) {
      setErrorMsg(`NETWORK_ERR: Cannot reach server. ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const onFocusGreen = (e) => { e.target.style.borderColor = '#000000'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.15)'; };
  const onBlurGreen = (e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.45)'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="raleway-theme" style={{
      height: 'calc(100vh - 72px)',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
    }}>
      {/* Google Fonts import for Raleway */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');
        .raleway-theme {
          font-family: 'Raleway', sans-serif !important;
        }
        .raleway-theme input, 
        .raleway-theme button, 
        .raleway-theme label, 
        .raleway-theme h2, 
        .raleway-theme p, 
        .raleway-theme span, 
        .raleway-theme div,
        .raleway-theme a {
          font-family: 'Raleway', sans-serif !important;
        }
        .raleway-theme input::placeholder {
          color: #475569 !important;
          opacity: 0.95 !important;
        }
      `}</style>

      {/* Background with increased brightness, no blur, no white overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url(./google_bright_exterior.png)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(1.1) blur(3.5px)',
        zIndex: 0,
      }} />

      <div style={{ width: '100%', maxWidth: '680px', zIndex: 1, position: 'relative', boxSizing: 'border-box', animation: 'pageEntrance 0.4s ease-out' }}>
        <div style={light.card}>


          {/* ── Top bar ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0, 0, 0, 0.15)' }}>
            <span style={{ ...light.label, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={13} /> SECURE_AUTHENTICATION.exe
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000000', boxShadow: '0 0 8px #000000' }} />
          </div>

          {/* ── Heading ── */}
          <h2 style={{ color: '#0f172a', fontSize: '1.35rem', marginBottom: '0.1rem', textAlign: 'center', fontWeight: 800 }}>
            Candidate Login
          </h2>
          <p style={{ color: '#475569', fontSize: '0.78rem', textAlign: 'center', marginBottom: '0.85rem', fontWeight: 500 }}>
            Enter your cohort keys to establish system connection.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={light.label}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="you@email.com"
                  style={light.input}
                  onFocus={onFocusGreen}
                  onBlur={onBlurGreen}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={light.label}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password Here"
                  style={light.inputPw}
                  onFocus={onFocusGreen}
                  onBlur={onBlurGreen}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#000000', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div style={{ fontSize: '0.74rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(254, 226, 226, 0.8)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <ShieldAlert size={15} /> {errorMsg}
              </div>
            )}

            {/* Terminal logs */}
            {terminalLogs.length > 0 && (
              <div style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(0, 0, 0, 0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', color: '#000000', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {terminalLogs.map((log, idx) => (
                  <div key={idx}>&gt; {log}</div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-ripple${isSubmitting ? ' btn-loading' : ''}`}
              style={{
                width: '100%',
                padding: '0.65rem',
                marginTop: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isSubmitting
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #374151 100%)'
                  : 'linear-gradient(135deg, #000000 0%, #374151 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.25s',
                letterSpacing: '0.05em',
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" style={{ borderTopColor: '#ffffff' }} />
                  Authenticating...
                </>
              ) : (
                <>Verify Handshake <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', textAlign: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.15)' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>No cohort registration yet?</span>
            <br />
            <Link
              to="/register"
              style={{ color: '#000000', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '0.2rem', fontWeight: 'bold' }}
            >
              <Key size={13} /> Generate Access Key (Register) →
            </Link>
          </div>

        </div>
      </div>
      {showConnectOverlay && <ConnectGithub />}
    </div>
  );
}
