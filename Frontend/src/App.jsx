import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Zap, Star, Trophy } from 'lucide-react';
import './index.css';

// Full-screen XP celebration overlay
function XpCelebration({ celebration, onDone }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!celebration) return;
    setVisible(true);
    setExiting(false);
    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      onDone && onDone();
    }, 2800);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [celebration]);

  if (!visible || !celebration) return null;

  const difficultyColors = {
    easy: { from: '#4ade80', to: '#22c55e', glow: 'rgba(74,222,128,0.5)' },
    medium: { from: '#fbbf24', to: '#f59e0b', glow: 'rgba(251,191,36,0.5)' },
    hard: { from: '#f87171', to: '#ef4444', glow: 'rgba(248,113,113,0.5)' },
    project: { from: '#a78bfa', to: '#7c3aed', glow: 'rgba(167,139,250,0.5)' },
    default: { from: '#00f0ff', to: '#39ff14', glow: 'rgba(0,240,255,0.5)' },
  };

  const amount = celebration.amount;
  const reason = celebration.reason || 'Points Earned!';
  let type = 'default';
  if (amount === 2) type = 'easy';
  else if (amount === 5) type = 'medium';
  else if (amount === 7) type = 'hard';
  else if (amount === 10) type = 'project';

  const colors = difficultyColors[type] || difficultyColors.default;

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i / 18) * 360,
    delay: (i % 6) * 0.07,
    size: 6 + (i % 3) * 4,
    dist: 90 + (i % 4) * 35,
    color: i % 3 === 0 ? colors.from : i % 3 === 1 ? colors.to : '#ffffff',
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: exiting ? 'rgba(0,0,0,0)' : 'rgba(3,8,19,0.82)',
      backdropFilter: exiting ? 'blur(0px)' : 'blur(8px)',
      WebkitBackdropFilter: exiting ? 'blur(0px)' : 'blur(8px)',
      transition: 'background 0.5s ease, backdrop-filter 0.5s ease',
      pointerEvents: 'none',
    }}>
      <style>{`
        @keyframes xp-burst-in {
          0% { transform: scale(0.3) translateY(40px); opacity: 0; }
          60% { transform: scale(1.12) translateY(-8px); opacity: 1; }
          80% { transform: scale(0.96) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes xp-burst-out {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.6) translateY(-40px); opacity: 0; }
        }
        @keyframes xp-particle {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes xp-amount-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes xp-ring-pulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes xp-stars-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(180deg); opacity: 0; }
        }
        @keyframes xp-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: p.id % 5 === 0 ? '2px' : '50%',
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animation: `xp-particle 1.2s ${p.delay}s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
          transform: `translate(-50%, -50%) translate(${Math.cos(p.angle * Math.PI / 180) * p.dist}px, ${Math.sin(p.angle * Math.PI / 180) * p.dist}px)`,
        }} />
      ))}

      {/* Ring pulse */}
      <div style={{
        position: 'absolute',
        width: '160px', height: '160px',
        borderRadius: '50%',
        border: `3px solid ${colors.from}`,
        animation: 'xp-ring-pulse 0.8s ease-out forwards',
        opacity: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '160px', height: '160px',
        borderRadius: '50%',
        border: `2px solid ${colors.to}`,
        animation: 'xp-ring-pulse 0.8s 0.15s ease-out forwards',
        opacity: 0,
      }} />

      {/* Main card */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        animation: exiting ? 'xp-burst-out 0.5s ease forwards' : 'xp-burst-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        textAlign: 'center', padding: '0 1rem',
        position: 'relative',
      }}>

        {/* Icon badge */}
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${colors.from}, ${colors.to})`,
          boxShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'xp-amount-pop 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          {type === 'project' ? <Trophy size={42} color="#fff" strokeWidth={2.5} /> :
           type === 'hard' ? <Star size={42} color="#fff" strokeWidth={2.5} fill="#fff" /> :
           <Zap size={42} color="#030813" strokeWidth={2.5} fill="#030813" />}
        </div>

        {/* XP Amount */}
        <div style={{
          fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          background: `linear-gradient(135deg, ${colors.from} 0%, #ffffff 50%, ${colors.to} 100%)`,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'xp-amount-pop 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both, xp-shimmer 2s 0.5s linear infinite',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textShadow: 'none',
          filter: `drop-shadow(0 0 20px ${colors.glow})`,
        }}>
          +{amount} XP
        </div>

        {/* Reason */}
        <div style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          animation: 'xp-amount-pop 0.5s 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
          maxWidth: '360px',
          letterSpacing: '0.01em',
        }}>
          {reason}
        </div>

        {/* Type tag */}
        <div style={{
          padding: '0.3rem 1rem',
          borderRadius: '50px',
          border: `1.5px solid ${colors.from}`,
          background: `rgba(${type === 'easy' ? '74,222,128' : type === 'medium' ? '251,191,36' : type === 'hard' ? '248,113,113' : type === 'project' ? '167,139,250' : '0,240,255'},0.12)`,
          color: colors.from,
          fontSize: '0.78rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono, monospace)',
          animation: 'xp-amount-pop 0.5s 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          {type === 'project' ? '🏆 Project' : type === 'hard' ? '🔥 Hard' : type === 'medium' ? '⚡ Medium' : type === 'easy' ? '✅ Easy' : '🎯 Points'} Earned
        </div>
      </div>
    </div>
  );
}

import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import CodingSprintSection from './components/CodingSprintSection';
import XpSystemSection from './components/XpSystemSection';
import ApplySection from './components/ApplySection';
import FaqSection from './components/FaqSection';
import WeeklySystemSection from './components/WeeklySystemSection';
import Login from './components/Login';
import Register from './components/Register';
import ProjectTrackerSection from './components/ProjectTrackerSection';

import { initialLeaderboard, BACKEND_URL } from './constants';
import googleWorkspaceBright from './assets/google_workspace_bright.png';
import googleAbstractTech from './assets/google_abstract_tech.png';
import googleCafeteriaBright from './assets/google_cafeteria_bright.png';

export default function App() {
  const location = useLocation();
  const terminalInputRef = useRef(null);
  const isFirstLoad = useRef(true);

  const email = localStorage.getItem("email") || "";
  const [xp, setXp] = useState(() => {
    return email ? null : 350;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("velocity_cohort_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.streak !== undefined) return parsed.streak;
      } catch (e) {}
    }
    return 28;
  });
  const [badges, setBadges] = useState(["badge-initiation", "badge-streak"]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [consoleGlitch, setConsoleGlitch] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [xpCelebration, setXpCelebration] = useState(null);

  const showToast = (amount, reason) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, amount, reason }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const bonus = localStorage.getItem("login_checkin_bonus");
    if (bonus === "true") {
      localStorage.removeItem("login_checkin_bonus");
      showToast(10, "Daily Login Checkin Bonus");
    }
  }, [location.pathname]);

  const [feedItems, setFeedItems] = useState([
    { time: "12:28", user: "@alex_dev", action: "solved LeetCode #239 (Hard)", gain: "+200 XP" },
    { time: "12:25", user: "@pixel_ninja", action: "pushed 5 commits to velocity-core", gain: "+50 XP" }
  ]);
  const [floatingPopups, setFloatingPopups] = useState([]);

  const [terminalInValue, setTerminalInValue] = useState("");
  const [terminalOutLines, setTerminalOutLines] = useState([
    { type: "sys", text: "Initializing cohort kernel terminal..." },
    { type: "sys", text: "Ready. Type 'help' for available diagnostic commands." }
  ]);
  const isHome = location.pathname === '/';
  const isApply = location.pathname === '/apply-now';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  useEffect(() => {
    const saved = localStorage.getItem("velocity_cohort_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.streak !== undefined) setStreak(parsed.streak);
      } catch (e) {
        console.error("Local storage parsing error:", e);
      }
    }
  }, []);

  // Check session cache validity (20 minutes = 1,200,000 ms)
  useEffect(() => {
    const loginTime = localStorage.getItem("login_time");
    const email = localStorage.getItem("email");
    if (email && loginTime) {
      const currentTime = Date.now();
      const elapsed = currentTime - parseInt(loginTime, 10);
      if (elapsed > 20 * 60 * 1000) {
        localStorage.removeItem("email");
        localStorage.removeItem("login_time");
      }
    }
  }, [location.pathname]);

  // Fetch real XP from DB and override local state
  useEffect(() => {
    const fetchDbXp = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;
        const res = await fetch(`${BACKEND_URL}/get/xp_scores?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.xp_scores !== undefined) {
            setXp(data.xp_scores);
          }
        }
      } catch (err) {
        console.error("Failed to fetch XP from DB:", err);
      }
    };
    fetchDbXp();
  }, [location.pathname]);



  useEffect(() => {
    const htmlEl = document.documentElement;
    switch (location.pathname) {
      case '/sprint':
        htmlEl.style.setProperty('--page-bg', `url(${googleWorkspaceBright})`);
        htmlEl.style.setProperty('--page-bg-filter', 'blur(3px) brightness(0.85)');
        break;
      case '/project-tracker':
        htmlEl.style.setProperty('--page-bg', `url(${googleAbstractTech})`);
        htmlEl.style.setProperty('--page-bg-filter', 'brightness(0.7)');
        break;
      case '/buddy-system':
        htmlEl.style.setProperty('--page-bg', `url(${googleWorkspaceBright})`);
        htmlEl.style.setProperty('--page-bg-filter', 'brightness(0.8)');
        break;
      case '/xp-system':
        htmlEl.style.setProperty('--page-bg', `url(${googleWorkspaceBright})`);
        htmlEl.style.setProperty('--page-bg-filter', 'brightness(0.8)');
        break;
      case '/daily-cycle':
        htmlEl.style.setProperty('--page-bg', `url(${googleCafeteriaBright})`);
        htmlEl.style.setProperty('--page-bg-filter', 'brightness(0.8)');
        break;
      case '/weekly-system':
        htmlEl.style.setProperty('--page-bg', `url(${googleCafeteriaBright})`);
        htmlEl.style.setProperty('--page-bg-filter', 'brightness(0.8)');
        break;
      default:
        htmlEl.style.removeProperty('--page-bg');
        htmlEl.style.removeProperty('--page-bg-filter');
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    const stateToSave = { streak };
    localStorage.setItem("velocity_cohort_state", JSON.stringify(stateToSave));
  }, [streak]);

  useEffect(() => {
    if (xp === null) {
      setLeaderboardData(prev => prev.map(dev => {
        if (dev.email === email) {
          return { ...dev, xp: null };
        }
        return dev;
      }));
      return;
    }

    const updatedBadges = [...badges];
    let badgeUnlocked = false;

    if (xp >= 1000 && !updatedBadges.includes("badge-algorithm")) {
      updatedBadges.push("badge-algorithm");
      badgeUnlocked = true;
      if (!isFirstLoad.current) {
        appendTerminalOutput("System Notification: Badge Unlocked - Recursion Ruler!");
      }
    }
    if (xp >= 2000 && !updatedBadges.includes("badge-legend")) {
      updatedBadges.push("badge-legend");
      badgeUnlocked = true;
      if (!isFirstLoad.current) {
        appendTerminalOutput("System Notification: Badge Unlocked - Velocity Titan!");
      }
    }

    if (badgeUnlocked) {
      setBadges(updatedBadges);
    }

    setLeaderboardData(prev => prev.map(dev => {
      if (dev.email === email) {
        return { ...dev, xp };
      }
      return dev;
    }));

    isFirstLoad.current = false;
  }, [xp]);

  useEffect(() => {
    if (consoleGlitch) {
      document.body.classList.add("console-glitch-mode");
    } else {
      document.body.classList.remove("console-glitch-mode");
    }
  }, [consoleGlitch]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/get/usersforrank`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboardData(data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard ranking:", err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const appendTerminalOutput = (text, type = "sys") => {
    setTerminalOutLines(prev => [...prev, { type, text }]);
  };

  const earnXP = (amount, reason = "Task Cleared") => {
    setXp(prev => prev + amount);
    showToast(amount, reason);

    // Full-screen celebration animation
    setXpCelebration({ amount, reason, key: Date.now() });

    const date = new Date();
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    setFeedItems(prev => [
      { time: timeStr, user: "@You", action: `${reason}`, gain: `+${amount} XP` },
      ...prev.slice(0, 3)
    ]);

    appendTerminalOutput(`PoW validation log: ${reason}. +${amount} XP granted.`);

    // Sync XP to database
    const email = localStorage.getItem("email") || "";
    if (email) {
      fetch(`${BACKEND_URL}/update/xp_scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, xp_scores: amount })
      }).catch(err => console.error("Error updating XP in DB:", err));
    }
  };

  const handleTerminalSubmit = (e) => {
    if (e.key === "Enter") {
      const cmd = terminalInValue.toLowerCase().trim();
      setTerminalInValue("");

      appendTerminalOutput(`velocity-cohort $ ${cmd}`, "echo");

      if (cmd === "help") {
        appendTerminalOutput("Avail commands: help | claim | status | multiplier | reset");
      } else if (cmd === "claim") {
        earnXP(50, "Console prompt checkin");
      } else if (cmd === "status") {
        appendTerminalOutput(`Streak: ${streak} days | XP: ${xp}`);
      } else if (cmd === "multiplier") {
        appendTerminalOutput("Current multiplier: 1.2x (Reason: Active 7+ day streak)");
      } else if (cmd === "reset") {
        localStorage.removeItem("velocity_cohort_state");
        setXp(350);
        setStreak(28);
        setBadges(["badge-initiation", "badge-streak"]);
        setTerminalOutLines([
          { type: "sys", text: "State reset. Cohort kernel reinitialized." }
        ]);
      } else if (cmd !== "") {
        appendTerminalOutput(`Unknown command: '${cmd}'. Type 'help' for options.`, "error");
      }
    }
  };

  return (
    <div className="dark-theme">
      {/* Full-screen XP celebration overlay */}
      <XpCelebration
        key={xpCelebration?.key}
        celebration={xpCelebration}
        onDone={() => setXpCelebration(null)}
      />

      <div className="matrix-grid"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {!isHome && !isApply && !isLogin && !isRegister && (
        <Header
          xp={xp} streak={streak}
          consoleGlitch={consoleGlitch} setConsoleGlitch={setConsoleGlitch}
        />
      )}

      <main key={location.pathname} className="page-transition-container">
        <Routes>
          <Route path="/" element={
            <HeroSection
              streak={streak} xp={xp}
              feedItems={feedItems} earnXP={earnXP}
              terminalInValue={terminalInValue} setTerminalInValue={setTerminalInValue}
              terminalOutLines={terminalOutLines} handleTerminalSubmit={handleTerminalSubmit}
              terminalInputRef={terminalInputRef}
            />
          } />
          <Route path="/how-it-works" element={<HowItWorksSection />} />
          <Route path="/sprint" element={<CodingSprintSection xp={xp} earnXP={earnXP} />} />
          <Route path="/xp-system" element={
            <XpSystemSection
              xp={xp}
              badges={badges} leaderboardData={leaderboardData} earnXP={earnXP}
            />
          } />
          <Route path="/apply-now" element={<ApplySection />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/weekly-system" element={<WeeklySystemSection />} />
          <Route path="/project-tracker" element={<ProjectTrackerSection earnXP={earnXP} />} />
          <Route path="/login" element={<Login earnXP={earnXP} />} />
          <Route path="/register" element={<Register earnXP={earnXP} />} />
          <Route path="*" element={
            <HeroSection
              streak={streak} xp={xp}
              feedItems={feedItems} earnXP={earnXP}
              terminalInValue={terminalInValue} setTerminalInValue={setTerminalInValue}
              terminalOutLines={terminalOutLines} handleTerminalSubmit={handleTerminalSubmit}
              terminalInputRef={terminalInputRef}
            />
          } />
        </Routes>
      </main>
    </div>
  );
}
