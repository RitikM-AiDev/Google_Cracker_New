import React, { useState } from 'react';
import { Users, Zap, Shuffle, MessageSquare, CheckCircle2, Calendar } from 'lucide-react';
import { buddyProfiles } from '../constants';
import bgImage1 from '../assets/google_workspace_bright.png';


export default function BuddySystemSection({ 
  earnXP, setStreak, scheduledSessions, setScheduledSessions, appendTerminalOutput 
}) {
  const [activeBuddyIndex, setActiveBuddyIndex] = useState(0);
  const [checkSolve, setCheckSolve] = useState(false);
  const [checkCommit, setCheckCommit] = useState(false);
  const [checkMeet, setCheckMeet] = useState(false);
  const [buddyComment, setBuddyComment] = useState("");
  
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [scheduleTopic, setScheduleTopic] = useState("");

  const handleRotateBuddy = () => {
    const nextIdx = (activeBuddyIndex + 1) % buddyProfiles.length;
    setActiveBuddyIndex(nextIdx);
    appendTerminalOutput(`Buddy system: pairing rotated to ${buddyProfiles[nextIdx].name}`);
  };

  const handleDailyCheckin = (e) => {
    e.preventDefault();
    if (!checkSolve || !checkCommit || !checkMeet) return;
    
    earnXP(100, "Daily check-in PoW submission");
    setStreak(prev => prev + 1);
    
    setCheckSolve(false);
    setCheckCommit(false);
    setCheckMeet(false);
    setBuddyComment("");
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTopic) return;

    const newSession = {
      date: scheduleDate,
      time: scheduleTime,
      topic: scheduleTopic
    };
    setScheduledSessions(prev => [...prev, newSession]);
    setScheduleDate("");
    setScheduleTopic("");
    appendTerminalOutput(`Scheduled: ${scheduleTopic} logged successfully.`);
  };

  const currentBuddy = buddyProfiles[activeBuddyIndex];

  return (
    <section 
      className="buddy-system-section" 
      id="buddy-system" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${bgImage1})`, 
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed', 
        padding: '4rem 0',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}
    >
      <div className="container">
        <div className="section-header text-center glass-card" style={{ maxWidth: '1480px', width: '100%', boxSizing: 'border-box', margin: '0 auto 2.5rem', padding: '2.5rem 2rem', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.22)', borderRadius: '20px' }}>
          <h2 className="section-title" style={{ color: '#ffffff' }}>The Buddy Synergy Engine</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1', marginBottom: 0 }}>Pairs change every 7 days. Review their PRs, write code together, and boost your mutual XP multipliers.</p>
        </div>

        <div className="buddy-container-grid">
          {/* Buddy Pairing Widget */}
          <div className="buddy-widget glass-card border-glow-blue">
            <div className="widget-header-title">
              <h3><Users size={18} style={{ marginRight: '6px' }} /> Active Pairing</h3>
              <span className="active-badge-status">SYNC ACTIVE</span>
            </div>
            <div className="current-buddy-card" id="buddy-pairing-card" style={{ transition: 'all 0.15s ease-out' }}>
              <div className="buddy-avatar-area">
                <img src={currentBuddy.avatar} alt="Buddy" id="buddy-img" className="avatar-circle lg" />
                <div className="badge-status-dot online"></div>
              </div>
              <div className="buddy-details">
                <h4 id="buddy-name">{currentBuddy.name}</h4>
                <span className="buddy-handle" id="buddy-handle">{currentBuddy.handle}</span>
                <div className="buddy-meta-chips">
                  <span className="chip font-mono">{currentBuddy.GitHub}</span>
                  <span className="chip font-mono"><Zap size={12} style={{ marginRight: '4px' }} /> Streak: {currentBuddy.streak}</span>
                </div>
                <div className="buddy-xp-bonus">
                  <Zap className="text-neon-green" size={14} style={{ marginRight: '4px' }} /> <span>Buddy Multiplier: <strong>1.5x XP</strong> on joint coding review sessions!</span>
                </div>
              </div>
            </div>
            <div className="buddy-actions-row">
              <button className="btn btn-secondary btn-sm" id="rotate-buddy-btn" onClick={handleRotateBuddy}><Shuffle size={14} style={{ marginRight: '4px' }} /> Roll Next Buddy</button>
              <a href="#discord-channel" className="btn btn-outline btn-sm"><MessageSquare size={14} style={{ marginRight: '4px' }} /> Open DM Chat</a>
            </div>
          </div>

          {/* Daily Check-in Form */}
          <div className="check-in-form-container glass-card">
            <h3>Daily Sync Check-in</h3>
            <form id="buddy-checkin-form" className="buddy-form" onSubmit={handleDailyCheckin}>
              <div className="form-group-checkbox">
                <label className="checkbox-container">
                  <input type="checkbox" id="check-solve" checked={checkSolve} onChange={(e) => setCheckSolve(e.target.checked)} required />
                  <span className="checkmark"></span>
                  Solved the Daily Algorithmic Challenge
                </label>
              </div>
              <div className="form-group-checkbox">
                <label className="checkbox-container">
                  <input type="checkbox" id="check-commit" checked={checkCommit} onChange={(e) => setCheckCommit(e.target.checked)} required />
                  <span className="checkmark"></span>
                  Pushed PoW commit to repository
                </label>
              </div>
              <div className="form-group-checkbox">
                <label className="checkbox-container">
                  <input type="checkbox" id="check-meet" checked={checkMeet} onChange={(e) => setCheckMeet(e.target.checked)} required />
                  <span className="checkmark"></span>
                  Conducted peer review / Sync with your buddy
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="buddy-comment" className="form-label mono-font">Sync Notes / Code Review link</label>
                <textarea 
                  id="buddy-comment" 
                  className="form-input" 
                  rows="2" 
                  placeholder="e.g. Reviewed @alex_dev's sliding window solution. Discussed heap complexity."
                  value={buddyComment}
                  onChange={(e) => setBuddyComment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full"><CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Submit Proof & Claim XP</button>
            </form>
          </div>

          {/* Pair Programming Scheduler */}
          <div className="scheduler-container glass-card">
            <h3>Pair Programming Scheduler</h3>
            <p className="section-sub-title text-muted text-sm">Coordinate code reviews, whiteboard exercises, and pairing sessions easily.</p>
            
            <form id="scheduler-form" className="buddy-form" onSubmit={handleScheduleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label mono-font" htmlFor="schedule-date">Select Date</label>
                  <input 
                    type="date" 
                    id="schedule-date" 
                    className="form-input" 
                    required 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label mono-font" htmlFor="schedule-time">Select Slot</label>
                  <select 
                    id="schedule-time" 
                    className="form-input" 
                    required 
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  >
                    <option value="10:00">10:00 - 11:30 UTC</option>
                    <option value="14:00">14:00 - 15:30 UTC</option>
                    <option value="17:00">17:00 - 18:30 UTC</option>
                    <option value="21:00">21:00 - 22:30 UTC</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label mono-font" htmlFor="schedule-topic">Session Topic</label>
                <input 
                  type="text" 
                  id="schedule-topic" 
                  className="form-input" 
                  placeholder="e.g., Whiteboard System Design or Mock Interview" 
                  required 
                  value={scheduleTopic}
                  onChange={(e) => setScheduleTopic(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary w-full"><Calendar size={16} style={{ marginRight: '6px' }} /> Book Pair Session</button>
            </form>

            <div className="booked-sessions-list-wrapper">
              <h4 className="mono-font text-xs text-electric-blue">&gt; SCHEDULED_SESSIONS</h4>
              <ul className="booked-sessions-list" id="sessions-list">
                {scheduledSessions.length === 0 ? (
                  <li className="no-sessions">No pair sessions scheduled yet.</li>
                ) : (
                  scheduledSessions.map((session, idx) => (
                    <li key={idx}>
                      <div>
                        <strong>{session.topic}</strong>
                        <span style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.7rem' }}>
                          {session.date} @ {session.time} UTC
                        </span>
                      </div>
                      <span className="session-badge font-mono">PENDING SYNC</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
