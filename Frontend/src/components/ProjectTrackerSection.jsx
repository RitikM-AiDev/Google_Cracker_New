import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, GitBranch, AlertTriangle, CheckCircle2, Loader2, ArrowRight, RefreshCw, Mail, ShieldAlert } from 'lucide-react';
import bgImage from '../assets/google_abstract_tech.png';
import { BACKEND_URL } from '../constants';

export default function ProjectTrackerSection({ earnXP }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState([]);
  const [result, setResult] = useState(null); // 'success' | 'failure' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const consoleBottomRef = useRef(null);

  useEffect(() => {
    // Load email from localStorage
    const savedEmail = localStorage.getItem('email') || '';
    setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [verificationLogs]);

  const addLog = (text, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setVerificationLogs((prev) => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setResult('error');
      setStatusMsg('Candidate email is required for verification.');
      return;
    }

    setIsVerifying(true);
    setResult(null);
    setStatusMsg('');
    setErrorDetails('');
    setVerificationLogs([]);

    // Step 1: Initializing Handshake
    await addLog('⚡ Initializing project verification protocol...', 100);
    await addLog(`📡 Querying local registration database for email: ${email}`, 400);

    try {
      // API call started in background while logs print
      const apiPromise = fetch(`${BACKEND_URL}/latest/file/changes?email=${encodeURIComponent(email)}`, {
        method: 'GET'
      });

      await addLog('🛰️ Establishing handshake with backend kernel...', 500);
      await addLog('🔓 Accessing candidate GitHub session token...', 600);
      await addLog('📂 Fetching most recently updated repository...', 600);
      await addLog('🔍 Reading commit history and branch details...', 500);
      await addLog('📏 Calculating total added and deleted lines in latest patch...', 500);

      const response = await apiPromise;
      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (_) {}
        throw new Error(errData.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      await addLog('📥 Processing data payload from GitHub API...', 400);

      if (data.project_done === true) {
        await addLog('✅ Verification successful! Dev Velocity target of 50+ line changes met.', 300);
        setResult('success');
        setStatusMsg('Project Verified successfully! You have met the developer threshold.');
        if (earnXP) {
          earnXP(100, 'Project Milestone Compliance Met');
        }
      } else {
        await addLog('❌ Verification completed, but constraints were NOT satisfied.', 300);
        setResult('failure');
        setStatusMsg(data.message || 'Verification Failed. The latest commit in your project repository does not meet the minimum change threshold of 50+ lines (additions + deletions).');
      }
    } catch (err) {
      await addLog('🔥 CRITICAL ERROR encountered during execution trace.', 200);
      setResult('error');
      setStatusMsg('Connection / Verification Failed.');
      setErrorDetails(err.message || 'Make sure the backend server is running and your GitHub account is connected.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section 
      className="project-tracker-section" 
      id="project-tracker" 
      style={{ 
        padding: '5rem 0',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="section-header text-center" style={{ maxWidth: '900px', width: '100%', margin: '0 auto 2.5rem' }}>
          <div className="badge-accent" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <span className="pulse-dot"></span> DEV COMPLIANCE MATRIX
          </div>
          <h2 className="section-title" style={{ marginTop: '0.75rem', fontSize: '2.2rem', fontWeight: 900 }}>
            Project Tracker & Verification
          </h2>
          <p className="section-subtitle text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
            Scan your active GitHub repository and verify proof of work. Make sure your latest commit contains at least 50 modifications.
          </p>
        </div>

        <div className="grid grid-1" style={{ gap: '2rem' }}>
          {/* Main Card */}
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(0,240,255,0.2)' }}>
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--color-electric-blue, #00f0ff)' }}>
                  DEVELOPER COHORT EMAIL
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '14px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: 'rgba(255,255,255,0.5)', 
                      pointerEvents: 'none' 
                    }} 
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@cohort.com"
                    disabled={isVerifying}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.8rem 1rem 0.8rem 2.8rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.25s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 240, 255, 0.8)';
                      e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 240, 255, 0.25)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                {!localStorage.getItem('email') && (
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <ShieldAlert size={12} /> You are not logged in. You can type your registered email address manually.
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isVerifying || !email}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: isVerifying
                    ? 'rgba(0, 240, 255, 0.15)'
                    : 'linear-gradient(135deg, #00f0ff 0%, #39ff14 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: isVerifying ? 'rgba(255,255,255,0.5)' : '#030813',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: isVerifying || !email ? 'not-allowed' : 'pointer',
                  boxShadow: isVerifying ? 'none' : '0 4px 20px rgba(0, 240, 255, 0.35)',
                  transition: 'all 0.25s',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="spinner" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Running Verification...
                  </>
                ) : (
                  <>
                    Verify Project <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Diagnostic Console Panel */}
            {(verificationLogs.length > 0 || isVerifying) && (
              <div 
                className="terminal-mockup"
                style={{ 
                  marginTop: '2rem', 
                  background: 'rgba(5, 8, 20, 0.85)', 
                  border: '1px solid rgba(0, 240, 255, 0.25)', 
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="terminal-header" 
                  style={{ 
                    background: 'rgba(0, 240, 255, 0.08)', 
                    padding: '0.6rem 1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', color: 'rgba(0, 240, 255, 0.8)', fontFamily: 'var(--font-mono, monospace)' }}>
                    &gt;_ PROJECT_INTEGRATION_LOG
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></span>
                  </div>
                </div>
                <div 
                  className="terminal-body" 
                  style={{ 
                    padding: '1.25rem', 
                    height: '200px', 
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.82rem',
                    lineHeight: '1.5',
                    color: 'rgba(255,255,255,0.85)',
                    textAlign: 'left'
                  }}
                >
                  {verificationLogs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      <span style={{ color: 'rgba(0, 240, 255, 0.6)', marginRight: '8px' }}>$</span>
                      {log}
                    </div>
                  ))}
                  {isVerifying && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(0, 240, 255, 0.8)' }}>
                      <span style={{ color: 'rgba(0, 240, 255, 0.6)' }}>$</span>
                      <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                      Executing trace...
                    </div>
                  )}
                  <div ref={consoleBottomRef} />
                </div>
              </div>
            )}

            {/* Results Alert Display */}
            {result && (
              <div 
                style={{ 
                  marginTop: '2rem', 
                  padding: '1.25rem', 
                  borderRadius: '12px',
                  border: '1px solid',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  animation: 'fadeSlideDown 0.3s ease forwards',
                  background: result === 'success' ? 'rgba(39, 201, 63, 0.1)' : result === 'failure' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: result === 'success' ? 'rgba(39, 201, 63, 0.4)' : result === 'failure' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                  color: result === 'success' ? '#39ff14' : result === 'failure' ? '#f59e0b' : '#ef4444'
                }}
              >
                {result === 'success' && <CheckCircle2 size={24} style={{ flexShrink: 0 }} />}
                {result === 'failure' && <AlertTriangle size={24} style={{ flexShrink: 0 }} />}
                {result === 'error' && <ShieldAlert size={24} style={{ flexShrink: 0 }} />}

                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.02em' }}>
                    {result === 'success' && 'COMPLIANCE CHECK: PASSED'}
                    {result === 'failure' && 'COMPLIANCE CHECK: FAILURE'}
                    {result === 'error' && 'SYSTEM HANDSHAKE: FAILED'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {statusMsg}
                  </p>
                  {errorDetails && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', opacity: 0.85, fontFamily: 'var(--font-mono, monospace)', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px' }}>
                      Details: {errorDetails}
                    </div>
                  )}
                  {result === 'failure' && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                        💡 To pass verification:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.78rem', color: '#94a3b8' }}>
                        <li>Push commits to your connected GitHub repository (excluding `google_cracker` or `leetcode`).</li>
                        <li>Ensure the latest commit has a total count of modifications (lines added + lines deleted) of at least 50.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
