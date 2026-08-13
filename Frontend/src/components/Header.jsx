import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Zap, User, Star, GitBranch, Mail, Shield, ChevronRight, Loader2, Trophy } from 'lucide-react';
import { BACKEND_URL } from '../constants';



export default function Header({ xp, streak, consoleGlitch, setConsoleGlitch }) {
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

  const navLinks = [
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/weekly-system', label: 'Weekly System' },
    { to: '/sprint', label: 'Coding Sprint' },
    { to: '/xp-system', label: 'Leader Board' },
    { to: '/faq', label: 'FAQ' },
    { to: '/project-tracker', label: 'Make Your Project to Points' },
  ];

  return (
    <>
      <header className="main-header" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,240,255,0.13)' }}>
        <div className="header-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <div className="logo" style={{ flexShrink: 0 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="logo-prompt">&gt;</span> GOOGLE COHORT<span className="logo-accent"></span>
            </Link>
          </div>

          {/* Inline Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `header-nav-link${isActive ? ' header-nav-link--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: XP Badge + Avatar */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
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

                  {/* Footer links: Leader Board & Logout Button */}
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
                      <Trophy size={14} /> Leader Board <ChevronRight size={14} />
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

          </div>
        </div>
      </header>

      {/* Keyframe animations + nav styles */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popupFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Inline Header Nav Links ── */
        .header-nav-link {
          display: inline-flex;
          align-items: center;
          padding: 0.38rem 0.7rem;
          border-radius: 8px;
          text-decoration: none;
          color: rgba(200, 230, 255, 0.80);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.03);
          transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .header-nav-link:hover {
          background: rgba(0,240,255,0.10);
          border-color: rgba(0,240,255,0.28);
          color: #00f0ff;
          box-shadow: 0 0 10px rgba(0,240,255,0.12);
        }
        .header-nav-link--active {
          background: rgba(0,240,255,0.14);
          border-color: rgba(0,240,255,0.40);
          color: #00f0ff;
          box-shadow: 0 0 12px rgba(0,240,255,0.18);
        }

        /* Hide old mobile-menu-toggle if still in DOM */
        .mobile-menu-toggle { display: none !important; }

        @media (max-width: 900px) {
          .header-nav-link {
            font-size: 0.72rem;
            padding: 0.32rem 0.5rem;
          }
        }
        @media (max-width: 680px) {
          nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
