import React from 'react';
import { Zap, Check, Shield } from 'lucide-react';
import bgImage2 from '../assets/google_cafeteria_bright.png';


export default function WeeklySystemSection() {
  return (
    <section 
      className="weekly-system-section" 
      id="weekly-system" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${bgImage2})`, 
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
        <div className="section-header text-center glass-card" style={{ maxWidth: '1100px', width: '100%', boxSizing: 'border-box', margin: '0 auto 2.5rem', padding: '2.5rem 3rem', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.22)', borderRadius: '20px' }}>
          <h2 className="section-title" style={{ color: '#ffffff' }}>The 5+1+1 Weekly Cadence</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1', marginBottom: 0 }}>A balanced, relentless cycle designed to avoid developer burnout while maintaining peak momentum.</p>
        </div>

        <div className="calendar-grid">
          {/* Mon-Fri */}
          <div className="calendar-card weekday">
            <div className="calendar-card-header">
              <span className="day-count">5 DAYS</span>
              <span className="day-span">MON - FRI</span>
            </div>
            <div className="calendar-card-body">
              <h4>Core Deep-Dive Learning</h4>
              <ul className="calendar-tasks">
                <li><Check className="task-done" size={14} /> Algorithmic Mastery (DSA)</li>
                <li><Check className="task-done" size={14} /> Low-Level & High-Level System Design</li>
                <li><Check className="task-done" size={14} /> Project Build components</li>
                <li><Check className="task-done" size={14} /> Peer Review sessions</li>
              </ul>
            </div>
          </div>

          {/* Saturday */}
          <div className="calendar-card sprint">
            <div className="calendar-card-header">
              <span className="day-count">1 DAY</span>
              <span className="day-span text-electric-blue">SATURDAY</span>
            </div>
            <div className="calendar-card-body">
              <h4>Weekly Sprint & Contests</h4>
              <ul className="calendar-tasks">
                <li><Zap className="text-neon-green" size={14} /> 3-Hour Algorithmic Hackathon</li>
                <li><Zap className="text-neon-green" size={14} /> Rapid prototyping builds</li>
                <li><Zap className="text-neon-green" size={14} /> Live leaderboard wars</li>
              </ul>
            </div>
          </div>

          {/* Sunday */}
          <div className="calendar-card rest">
            <div className="calendar-card-header">
              <span className="day-count">1 DAY</span>
              <span className="day-span text-neon-green">SUNDAY</span>
            </div>
            <div className="calendar-card-body">
              <h4>Recovery & Strategy Rest</h4>
              <p>Reflect on weekly logs, schedule buddy systems, and refresh mental models. No compulsory submission deadlines.</p>
            </div>
          </div>
        </div>

        {/* Exam Pass Flexibility banner */}
        <div className="glass-card flex-pass-banner">
          <div className="flex-pass-content">
            <div className="flex-pass-icon">
              <Shield className="glowing-icon" size={24} />
            </div>
            <div>
              <h4>Exam Pass & Safe Havens</h4>
              <p>University exams? Critical production deployments at work? Burnout risk? Trigger a <strong>Safe Haven Pass</strong> up to twice a quarter to pause submissions without losing your streak multiplier.</p>
            </div>
          </div>
          <div className="flex-pass-action">
            <span className="badge badge-outline">2 Passes Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
