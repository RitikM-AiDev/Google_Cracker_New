import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';
import googleWorkspaceBright from '../assets/google_workspace_bright.png';

export default function HeroSection({
  streak, xp, feedItems,
  terminalInValue, setTerminalInValue, terminalOutLines, handleTerminalSubmit, terminalInputRef
}) {
  return (
    <div className="hero-section" id="hero" style={{
      backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${googleWorkspaceBright})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      position: 'relative'
    }}>
      <div className="container hero-grid">
        <div className="hero-content glass-card" style={{ padding: '2.5rem', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.22)', borderRadius: '20px' }}>
          <div className="badge-accent">
            <span className="pulse-dot"></span> NEXT BATCH STARTS SOON
          </div>
          <h1 style={{ color: '#ffffff' }}>Accelerate Your Dev Velocity. <span className="gradient-text">No Excuses.</span></h1>
          <p className="hero-description" style={{ color: '#cbd5e1' }}>
            A brutalist 13-month developer sprint focused on <strong style={{ color: '#ffffff' }}>consistency over perfection</strong>. Build daily proof of work, dominate weekly coding contests, and launch production-grade projects.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary">Join the Cohort</Link>
            <Link to="/login" className="btn btn-secondary">Already a Member</Link>
          </div>

          <div className="activity-feed-wrapper">
            <div className="feed-header">
              <span className="feed-title" style={{ color: '#ffffff' }}><Activity size={16} style={{ marginRight: '6px' }} /> Cohort Pulse (Live Feed)</span>
              <span className="feed-status-dot"></span>
            </div>
            <div className="feed-container" id="live-activity-feed">
              {feedItems.map((item, idx) => (
                <div key={idx} className="feed-item" style={{ color: '#cbd5e1' }}>
                  <span className="feed-time" style={{ color: '#94a3b8' }}>{item.time}</span>
                  <span className="feed-user" style={{ color: '#ffffff', fontWeight: 600 }}>{item.user}</span> {item.action} <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{item.gain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="terminal-mockup">
            <div className="terminal-header">
              <span className="term-dot close"></span>
              <span className="term-dot minimize"></span>
              <span className="term-dot maximize"></span>
              <span className="terminal-title">user@velocity-console:~</span>
            </div>
            <div className="terminal-body">
              <div className="streak-header-stats">
                <div className="stat-box">
                  <span className="stat-val text-neon-green" id="hero-streak-count">{streak}</span>
                  <span className="stat-lbl">Active Streak</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val text-electric-blue">96.8%</span>
                  <span className="stat-lbl">Consistency</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val text-neon-green" id="hero-xp-total" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {xp === null ? (
                      <Loader2 className="animate-spin" size={20} style={{ display: 'inline-block' }} />
                    ) : (
                      xp
                    )}
                  </span>
                  <span className="stat-lbl">XP Earned</span>
                </div>
              </div>

              <div className="streak-grid-wrapper">
                <p className="section-sub-title mono-font">&gt; streak_contributions --user=current</p>
                <div className="streak-grid" id="streak-days-grid">
                  {Array.from({ length: 30 }).map((_, i) => {
                    let levelClass = "";
                    if (i < 20) {
                      levelClass = `level-${(i % 3) + 1}`;
                    } else if (i < 28) {
                      levelClass = i % 5 === 0 ? "level-0" : "level-2";
                    } else if (i === 28) {
                      levelClass = "level-3";
                    }
                    return (
                      <div
                        key={i}
                        className={`streak-day ${levelClass}`}
                        title={`Day ${i + 1}: Activity Level`}
                      />
                    );
                  })}
                </div>
                <div className="streak-legend">
                  <span>Less Consistent</span>
                  <span className="legend-box level-0"></span>
                  <span className="legend-box level-1"></span>
                  <span className="legend-box level-2"></span>
                  <span className="legend-box level-3"></span>
                  <span>High Velocity</span>
                </div>
              </div>

              <div className="terminal-prompt-line">
                <span className="prompt-text">velocity-cohort $</span>
                <input
                  type="text"
                  className="terminal-input"
                  id="terminal-input"
                  placeholder="Type 'help' or 'claim'..."
                  ref={terminalInputRef}
                  value={terminalInValue}
                  onChange={(e) => setTerminalInValue(e.target.value)}
                  onKeyDown={handleTerminalSubmit}
                />
              </div>
              <div className="terminal-output" id="terminal-output">
                {terminalOutLines.slice(-3).map((line, idx) => (
                  <span
                    key={idx}
                    style={{
                      color: line.type === "sys" ? "var(--color-neon-green)" :
                             line.type === "error" ? "var(--color-crimson)" : "inherit",
                      display: 'block'
                    }}
                  >
                    {line.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
