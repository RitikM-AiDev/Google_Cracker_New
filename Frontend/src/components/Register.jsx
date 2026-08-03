import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, User, GitBranch, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import ConnectGithub from './ConnectGithub';
import { BACKEND_URL } from '../constants';

/* ── Light theme glassmorphism tokens (Realistic Glass) ── */
const light = {
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.65), inset 0 -1px 2px rgba(0, 0, 0, 0.04)',
    padding: '1.25rem 1.5rem',
    position: 'relative',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem 0.5rem 2.2rem',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    borderRadius: '40px',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  },
  inputPw: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 2.4rem 0.5rem 2.2rem',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    borderRadius: '40px',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#0f172a',
  },
};

export default function Register({ earnXP }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [github, setGithub] = useState('');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [generatedKey, setGeneratedKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConnectOverlay, setShowConnectOverlay] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !handle || !github || !password) {
      setErrorMsg('INPUT_ERR: Please complete all registration fields.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/registerinpage`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ name, email: handle, github_name: github, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(`REG_ERR [${res.status}]: ${data.detail ?? 'Registration failed'}`);
        setIsSubmitting(false);
        return;
      }
      else {
        localStorage.setItem("email", handle);
        localStorage.setItem("login_time", Date.now().toString());
        setShowOtpScreen(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg(`NETWORK_ERR: Cannot reach server. ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('INPUT_ERR: Please enter the verification OTP.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/verifyotp`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ email: handle, otp_: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(`OTP_ERR [${res.status}]: ${data.detail ?? 'OTP verification failed'}`);
        setIsSubmitting(false);
        return;
      }

      /* ── Success: animate terminal logs then show key ── */
      setShowOtpScreen(false);
      const candidateHandle = handle.startsWith('@') ? handle : `@${handle}`;
      const logs = [
        `OTP verification successful...`,
        `Registering cohort profile: ${name}...`,
        `Handle: ${candidateHandle}...`,
        `Verifying GitHub repository access...`,
        `Generating enrollment keys...`,
      ];

      logs.forEach((log, index) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, log]);
          if (index === logs.length - 1) {
            const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
            const mockKey = `VELOCITY-${randomHex()}-${randomHex()}`;
            setTimeout(() => {
              setGeneratedKey(mockKey);
              setIsSubmitting(false);
              earnXP(50, 'Cohort Enrollment Keys Generated');
              setTimeout(() => {
                setShowConnectOverlay(true);
              }, 2000);
            }, 600);
          }
        }, (index + 1) * 300);
      });

    } catch (err) {
      setErrorMsg(`NETWORK_ERR: Cannot reach server. ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    setTerminalLogs(prev => [...prev, 'Requesting new verification OTP...']);

    try {
      const res = await fetch(`${BACKEND_URL}/otp/request/again`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ email: handle }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(`RESEND_ERR [${res.status}]: ${data.detail ?? 'Failed to resend OTP'}`);
        setIsSubmitting(false);
        return;
      }

      setTerminalLogs(prev => [...prev, 'New verification OTP sent successfully!']);
      setIsSubmitting(false);
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

      <div style={{ width: '100%', maxWidth: showOtpScreen ? '480px' : '640px', zIndex: 1, position: 'relative', boxSizing: 'border-box', animation: 'pageEntrance 0.4s ease-out' }}>
        <div style={light.card}>

          {/* ── Top bar ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0, 0, 0, 0.15)' }}>
            <span style={{ ...light.label, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={13} /> {showOtpScreen ? 'OTP_VERIFICATION.exe' : 'READY FOR THE COHORT'}
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000000', boxShadow: '0 0 8px #000000' }} />
          </div>

          {/* ── Heading ── */}
          <h2 style={{ color: '#0f172a', fontSize: '1.35rem', marginBottom: '0.1rem', textAlign: 'center', fontWeight: 800 }}>
            {showOtpScreen ? 'OTP Verification' : 'Cohort Registration'}
          </h2>
          <p style={{ color: '#475569', fontSize: '0.78rem', textAlign: 'center', marginBottom: '0.85rem', fontWeight: 500 }}>
            {showOtpScreen ? 'Enter the verification OTP sent to your email.' : "Let's Do It Together."}
          </p>

          {generatedKey ? (
            /* ── Success state ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)' }}>
                  <ShieldCheck size={26} />
                </div>
              </div>
              <h3 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Enrollment Keys Disbursed!</h3>
              <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 0, 0, 0.4)', padding: '0.6rem 1rem', borderRadius: '8px', color: '#000000', letterSpacing: '0.08em', fontSize: '0.95rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(0,0,0,0.08)' }}>
                {generatedKey}
              </div>
              <p style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 500 }}>
                Access granted! Establishing connection & transferring protocols...
              </p>
              <div style={{ fontSize: '0.7rem', color: '#0070f3', fontWeight: 600 }}>
                System redirecting to Home Dashboard...
              </div>
            </div>
          ) : showOtpScreen ? (
            /* ── OTP Form ── */
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={light.label}>VERIFICATION OTP</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    style={light.input}
                    onFocus={onFocusGreen}
                    onBlur={onBlurGreen}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {errorMsg && (
                <div style={{ fontSize: '0.74rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(254, 226, 226, 0.8)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <span style={{ fontSize: '0.9rem' }}>⚠</span> {errorMsg}
                </div>
              )}

              {terminalLogs.length > 0 && (
                <div style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(0, 0, 0, 0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', color: '#000000', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {terminalLogs.map((log, idx) => (
                    <div key={idx}>&gt; {log}</div>
                  ))}
                </div>
              )}

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
                    Verifying OTP...
                  </>
                ) : (
                  <>Verify OTP <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          ) : (
            /* ── Register Form ── */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

              {/* Row 1: Name & Email */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Full Name */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={light.label}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alan Turing"
                      required
                      style={light.input}
                      onFocus={onFocusGreen}
                      onBlur={onBlurGreen}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={light.label}>EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem', pointerEvents: 'none' }}>@</span>
                    <input
                      type="text"
                      value={handle.startsWith('@') ? handle.substring(1) : handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="turing_code"
                      required
                      style={{ ...light.input, paddingLeft: '1.7rem' }}
                      onFocus={onFocusGreen}
                      onBlur={onBlurGreen}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: GitHub & Password */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* GitHub */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={light.label}>GITHUB USERNAME</label>
                  <div style={{ position: 'relative' }}>
                    <GitBranch size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="e.g. octocat"
                      required
                      style={light.input}
                      onFocus={onFocusGreen}
                      onBlur={onBlurGreen}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={light.label}>ACCESS PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#000000', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Strong password"
                      required
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
              </div>

              {/* Error */}
              {errorMsg && (
                <div style={{ fontSize: '0.74rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(254, 226, 226, 0.8)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <span style={{ fontSize: '0.9rem' }}>⚠</span> {errorMsg}
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
                    Submit Application...
                  </>
                ) : (
                  <>Submit Application <ArrowRight size={15} /></>
                )}
              </button>

            </form>
          )}

          {/* ── Footer link ── */}
          {!generatedKey && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', textAlign: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.15)' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                {showOtpScreen ? "Didn't receive code? " : "Already registered in the cohort?"}
              </span>
              <br />
              {showOtpScreen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                    style={{ background: 'none', border: 'none', color: '#000000', fontSize: '0.78rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', padding: 0 }}
                  >
                    Request Again
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowOtpScreen(false); setErrorMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.74rem', cursor: 'pointer', fontWeight: '500', padding: 0 }}
                  >
                    ← Back to Registration
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{ color: '#000000', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '0.2rem', fontWeight: 'bold' }}
                >
                  Already A Member ? (Login) →
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
      {showConnectOverlay && <ConnectGithub />}
    </div>
  );
}
