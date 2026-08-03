import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Zap, Terminal, Menu, Monitor, X, User, Star, GitBranch, Mail, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { BACKEND_URL } from '../constants';



export default function Header({ xp, streak, consoleGlitch, setConsoleGlitch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Candidate',
    email: '',
    github: '',
    role: 'student',
    joinDate: 'Cohort Member',
    targetCompany: 'Google',
  });
  const profileRef = useRef(null);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const email = localStorage.getItem('email');
    const storedName = localStorage.getItem('user_name');
    const storedGithub = localStorage.getItem('github_username');

    if (email) {
      setUserProfile(prev => ({
        ...prev,
        email: email,
        name: storedName || email.split('@')[0],
        github: storedGithub ? `https://github.com/${storedGithub.replace('https://github.com/', '')}` : prev.github,
      }));

      fetch(`${BACKEND_URL}/userprofile?email=${encodeURIComponent(email)}`)
        .then(res => res.ok ? res.json() : fetch(`${BACKEND_URL}/get/user?email=${encodeURIComponent(email)}`).then(r => r.ok ? r.json() : null))
        .then(data => {
          if (data) {
            setUserProfile({
              name: data.name || storedName || email.split('@')[0],
              email: data.email || email,
              github: data.github_username ? `https://github.com/${data.github_username.replace('https://github.com/', '')}` : (storedGithub ? `https://github.com/${storedGithub}` : ''),
              role: data.role || 'student',
              joinDate: data.joined_date || 'Cohort Member',
              targetCompany: 'Google',
            });
          }
        })
        .catch(err => console.error("Error fetching user profile:", err));
    }
  }, []);

  /* Close overlay on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const userName = (userProfile && typeof userProfile.name === 'string' && userProfile.name.trim()) ? userProfile.name : 'Candidate';
  const initials = userName ? userName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const userRole = (userProfile && userProfile.role && typeof userProfile.role === 'string') ? userProfile.role : 'student';
  const currentXp = typeof xp === 'number' ? xp : 0;
  const level = Math.floor(currentXp / 1000) + 1;
  const levelTitle = level >= 10 ? 'STAFF_ENG' : level >= 5 ? 'SENIOR_DEV' : level >= 3 ? 'MID_LEVELLER' : level >= 2 ? 'CODE_WARRIOR' : 'COMPILING_INIT';
  const xpToNext = 1000 - (currentXp % 1000);
  const pct = Math.min(((currentXp % 1000) / 1000) * 100, 100).toFixed(1);
  const formattedJoinDate = userProfile.joinDate && userProfile.joinDate !== 'Cohort Member'
    ? (() => {
        try {
          return new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
          return 'Cohort Member';
        }
      })()
    : 'Cohort Member';

  return (
    <>
      <header className="main-header" style={{ background: '#000000' }}>
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <span className="logo-prompt">&gt;</span> GOOGLE COHORT<span className="logo-accent"></span>
            </Link>
          </div>

          <div className="header-actions">
            {/* XP Badge */}
            <div className="user-xp-status" id="header-xp-badge">
              <Zap className="xp-icon" size={16} fill="currentColor" />
              <span className="xp-value" id="current-xp-header" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {xp === null ? (
                  <Loader2 className="animate-spin" size={14} style={{ display: 'inline-block' }} />
                ) : (
                  xp
                )}
              </span>
              <span className="xp-label">XP</span>
            </div>

            {/* ── Profile Avatar Button ── */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                title="Developer Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f0ff 0%, #39ff14 100%)',
                  border: profileOpen ? '2px solid #fff' : '2px solid rgba(0,240,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  color: '#030813',
                  boxShadow: profileOpen ? '0 0 16px rgba(0,240,255,0.6)' : '0 0 8px rgba(0,240,255,0.25)',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                }}
              >
                {initials}
              </button>

              {/* ── Profile Overlay Dropdown ── */}
              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: 'min(320px, 92vw)',
                  background: 'rgba(5, 8, 20, 0.90)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(0,240,255,0.22)',
                  borderRadius: '16px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,240,255,0.08)',
                  zIndex: 2000,
                  overflow: 'hidden',
                  animation: 'popupFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>

                  {/* Header strip */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(57,255,20,0.10) 100%)',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid rgba(0,240,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00f0ff, #39ff14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      color: '#030813',
                      flexShrink: 0,
                      boxShadow: '0 0 16px rgba(0,240,255,0.4)',
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '2px' }}>
                        {userName}
                      </div>
                      <div style={{ color: 'rgba(0,240,255,0.75)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        LVL {level ?? 1} — {levelTitle ?? 'COMPILING_INIT'}
                      </div>
                    </div>
                  </div>

                  {/* Details list */}
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

                    {/* Email */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={14} style={{ color: '#00f0ff', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(220,240,255,0.85)', wordBreak: 'break-all' }}>{userProfile?.email || 'No Email'}</span>
                    </div>

                    {/* GitHub */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <GitBranch size={14} style={{ color: '#39ff14', flexShrink: 0 }} />
                      {userProfile?.github ? (
                        <a href={userProfile.github} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.85rem', color: 'rgba(57,255,20,0.85)', textDecoration: 'none' }}>
                          {userProfile.github.replace('https://', '')}
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'rgba(220,240,255,0.5)' }}>GitHub Not Linked</span>
                      )}
                    </div>

                    {/* Target company */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Shield size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(245,158,11,0.85)' }}>Target: {userProfile?.targetCompany || 'Google'}</span>
                    </div>

                    {/* Role */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Star size={14} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(200,180,255,0.80)' }}>Role: {userRole.toUpperCase()}</span>
                    </div>

                    {/* Joined Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={14} style={{ color: '#ec4899', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(244,114,182,0.85)' }}>Joined: {formattedJoinDate}</span>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />

                    {/* XP Progress bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(0,240,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                          XP PROGRESS
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                          {currentXp} / {Math.max(1000, Math.ceil((currentXp || 1) / 1000) * 1000)}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #00f0ff, #39ff14)',
                          borderRadius: '99px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(160,200,220,0.55)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {xpToNext} XP to next level
                      </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                      {[
                        { 
                          label: 'Total XP', 
                          value: xp === null ? (
                            <Loader2 className="animate-spin" size={15} style={{ display: 'inline-block' }} />
                          ) : (
                            xp
                          ), 
                          color: '#00f0ff' 
                        },
                        { label: 'Streak', value: `${streak ?? 0}d`, color: '#f59e0b' },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.6rem 0.5rem',
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '1rem', fontWeight: '800', color: stat.color, fontFamily: 'var(--font-mono)' }}>
                            {stat.value}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(160,200,220,0.55)', marginTop: '2px' }}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer links: XP Dashboard & Logout Button */}
                  <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.25)',
                  }}>
                    <Link
                      to="/xp-system"
                      onClick={() => setProfileOpen(false)}
                      style={{ fontSize: '0.82rem', color: '#38bdf8', textDecoration: 'none', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    >
                      XP Dashboard <ChevronRight size={14} />
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => {
                        localStorage.removeItem("email");
                        localStorage.removeItem("login_time");
                        setProfileOpen(false);
                      }}
                      style={{
                        padding: '0.4rem 0.9rem',
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1px solid rgba(244, 63, 94, 0.4)',
                        borderRadius: '8px',
                        color: '#f43f5e',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Log Out
                    </Link>
                  </div>

                </div>
              )}
            </div>

            {/* ── Hamburger / Three-Dash Menu Button ── */}
            <button
              className="hamburger-btn"
              id="hamburger-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Full-Screen Navigation Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="nav-overlay"
          id="nav-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}
        >
          <div className="nav-overlay-panel">
            {/* Close button */}
            <button
              className="nav-overlay-close"
              id="nav-overlay-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>

            {/* Brand */}
            <div className="nav-overlay-brand">
              <span className="logo-prompt">&gt;</span> GOOGLE COHORT
            </div>

            {/* Nav items */}
            <nav className="nav-overlay-links">
              {[
                { to: '/how-it-works', label: 'How It Works', num: '01' },
                { to: '/weekly-system', label: 'Weekly System', num: '02' },
                { to: '/sprint', label: 'Daily / Weekly Coding Sprint', num: '03' },
                { to: '/build-sprint', label: 'Build Sprint', num: '04' },
                { to: '/xp-system', label: 'XP Dashboard', num: '05' },
                { to: '/faq', label: 'FAQ', num: '06' },
                { to: '/project-tracker', label: 'Project Tracker', num: '07' },
              ].map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-overlay-link${isActive ? ' nav-overlay-link--active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <span className="nav-overlay-num">{item.num}</span>
                  <span className="nav-overlay-label">{item.label}</span>
                  <ChevronRight className="nav-overlay-arrow" size={18} />
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="nav-overlay-footer">
              <button
                className="btn btn-secondary nav-overlay-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileOpen(true);
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={16} style={{ marginRight: '6px' }} /> View Profile & Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hamburger button ── */
        .hamburger-btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 42px;
          height: 42px;
          background: rgba(0,240,255,0.06);
          border: 1px solid rgba(0,240,255,0.25);
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
          flex-shrink: 0;
          padding: 0;
        }
        .hamburger-btn:hover {
          background: rgba(0,240,255,0.14);
          border-color: rgba(0,240,255,0.55);
          box-shadow: 0 0 14px rgba(0,240,255,0.25);
        }
        .hamburger-line {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: #00f0ff;
          transition: all 0.25s;
        }

        /* ── Overlay backdrop ── */
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 8, 19, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
          animation: overlayFadeIn 0.25s ease;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Slide-in panel ── */
        .nav-overlay-panel {
          width: min(420px, 100vw);
          height: 100%;
          background: rgba(5, 8, 22, 0.97);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-left: 1px solid rgba(0,240,255,0.18);
          display: flex;
          flex-direction: column;
          padding: 2rem 2rem 2.5rem;
          overflow-y: auto;
          animation: panelSlideIn 0.3s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        @keyframes panelSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        /* ── Close button ── */
        .nav-overlay-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,240,255,0.07);
          border: 1px solid rgba(0,240,255,0.2);
          border-radius: 50%;
          color: #00f0ff;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .nav-overlay-close:hover {
          background: rgba(0,240,255,0.18);
          transform: rotate(90deg);
        }

        /* ── Brand ── */
        .nav-overlay-brand {
          font-family: var(--font-mono, monospace);
          font-size: 1rem;
          font-weight: 800;
          color: #00f0ff;
          letter-spacing: 0.12em;
          margin-bottom: 2.5rem;
          margin-top: 0.25rem;
        }

        /* ── Nav links ── */
        .nav-overlay-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .nav-overlay-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(200,230,255,0.85);
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          animation: linkFadeUp 0.35s ease both;
        }
        @keyframes linkFadeUp {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nav-overlay-link:hover {
          background: rgba(0,240,255,0.08);
          border-color: rgba(0,240,255,0.2);
          color: #00f0ff;
          transform: translateX(4px);
        }
        .nav-overlay-link--active {
          background: rgba(0,240,255,0.12);
          border-color: rgba(0,240,255,0.35);
          color: #00f0ff;
        }
        .nav-overlay-num {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: rgba(0,240,255,0.45);
          width: 24px;
          flex-shrink: 0;
        }
        .nav-overlay-label {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .nav-overlay-arrow {
          color: rgba(0,240,255,0.35);
          transition: color 0.2s, transform 0.2s;
        }
        .nav-overlay-link:hover .nav-overlay-arrow,
        .nav-overlay-link--active .nav-overlay-arrow {
          color: #00f0ff;
          transform: translateX(3px);
        }

        /* ── Footer Logout ── */
        .nav-overlay-footer {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid rgba(0,240,255,0.1);
          padding-top: 1.5rem;
        }
        .nav-overlay-cta {
          text-align: center;
          font-size: 0.95rem;
        }

        /* Hide old mobile-menu-toggle if still in DOM */
        .mobile-menu-toggle { display: none !important; }
      `}</style>
    </>
  );
}
