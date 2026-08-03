import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import bgImage4 from '../assets/google_cafeteria_bright.png';


export default function BuildSprintSection() {
  const [hackathonTimer, setHackathonTimer] = useState("48:00:00");

  useEffect(() => {
    let hr = 47, min = 59, sec = 59;
    const timer = setInterval(() => {
      sec--;
      if (sec < 0) {
        sec = 59;
        min--;
        if (min < 0) {
          min = 59;
          hr--;
          if (hr < 0) {
            hr = 47;
          }
        }
      }
      setHackathonTimer(`${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="build-sprint-section" 
      id="build-sprint" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${bgImage4})`, 
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
          <h2 className="section-title" style={{ color: '#ffffff' }}>Build Sprint: Show Your Shipping Power</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1', marginBottom: 0 }}>Developers don't just solve problems, they ship products. Peer-reviewed project showcase.</p>
        </div>

        {/* Hackathon Countdown Banner */}
        <div className="hackathon-banner glass-card">
          <div className="banner-content">
            <span className="hackathon-badge">MID-COHORT HACKATHON</span>
            <h3>Velocity Hackathon V1: Devtools & AI Automation</h3>
            <p>An intense 48-hour build challenge. Build developer productivity applications, deploy them, and submit for peer review.</p>
          </div>
          <div className="banner-timer">
            <div className="timer-digits" id="hackathon-timer">{hackathonTimer}</div>
            <span className="timer-desc">Rethink limits. Build the future.</span>
          </div>
        </div>

        {/* Project Showcase Grid */}
        <div className="grid grid-3" id="project-showcase-grid">
          {/* Project 1 */}
          <div className="project-card glass-card">
            <div className="project-img-placeholder">
              <span className="mono-font">&lt;DEV-COMPLY-AI /&gt;</span>
            </div>
            <div className="project-body">
              <span className="project-tag">AI Automation</span>
              <h3>GitComply AI</h3>
              <p>An AI agent inspecting pull requests for architecture flaws and generating clean lint configurations dynamically.</p>
              
              <div className="project-team">
                <span className="team-label">Shipped by:</span>
                <div className="avatar-group">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="avatar-circle xs" title="@dev_john" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="avatar-circle xs" title="@elena_design" />
                </div>
              </div>

              <div className="project-feedback">
                <span className="feedback-quote">"The prompt validation module saved us hours."</span>
                <span className="feedback-author">- Mentored by @lead_archi</span>
              </div>

              <div className="project-links">
                <a href="https://GitHub.com" target="_blank" rel="noreferrer" className="project-link">Repo</a>
                <a href="https://vercel.com" target="_blank" rel="noreferrer" className="project-link"><Share2 size={14} style={{ marginRight: '4px' }} /> Live Demo</a>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card glass-card">
            <div className="project-img-placeholder">
              <span className="mono-font">&lt;VISUAL-COMPUTE /&gt;</span>
            </div>
            <div className="project-body">
              <span className="project-tag">WebGL & Tools</span>
              <h3>GraphQ-Trace</h3>
              <p>Interact with GraphQL resolvers in a three-dimensional visual space, tracing query speed bottlenecks.</p>
              
              <div className="project-team">
                <span className="team-label">Shipped by:</span>
                <div className="avatar-group">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="avatar-circle xs" title="@marcus_dev" />
                </div>
              </div>

              <div className="project-feedback">
                <span className="feedback-quote">"Rendering 10k nodes in canvas was smooth."</span>
                <span className="feedback-author">- Peer Review by @graph_lord</span>
              </div>

              <div className="project-links">
                <a href="https://GitHub.com" target="_blank" rel="noreferrer" className="project-link">Repo</a>
                <a href="https://vercel.com" target="_blank" rel="noreferrer" className="project-link"><Share2 size={14} style={{ marginRight: '4px' }} /> Live Demo</a>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-card glass-card">
            <div className="project-img-placeholder">
              <span className="mono-font">&lt;TERMINAL-UI /&gt;</span>
            </div>
            <div className="project-body">
              <span className="project-tag">CLI Tooling</span>
              <h3>SyncShell</h3>
              <p>Sync environmental profiles, command logs, and alias layouts securely between multiple container shells.</p>
              
              <div className="project-team">
                <span className="team-label">Shipped by:</span>
                <div className="avatar-group">
                  <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="avatar-circle xs" title="@cyber_sam" />
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80" alt="Avatar" className="avatar-circle xs" title="@lisa_code" />
                </div>
              </div>

              <div className="project-feedback">
                <span className="feedback-quote">"Zero-dependency binary file structure makes it robust."</span>
                <span className="feedback-author">- Mentored by @rust_guru</span>
              </div>

              <div className="project-links">
                <a href="https://GitHub.com" target="_blank" rel="noreferrer" className="project-link">Repo</a>
                <a href="https://vercel.com" target="_blank" rel="noreferrer" className="project-link"><Share2 size={14} style={{ marginRight: '4px' }} /> Live Demo</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
}
