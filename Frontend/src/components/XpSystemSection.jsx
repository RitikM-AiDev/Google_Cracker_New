import React, { useState } from 'react';
import { Zap, Award, Code, Trophy, Loader2 } from 'lucide-react';
import bgImage5 from '../assets/google_workspace_bright.png';


export default function XpSystemSection({ xp, badges, leaderboardData, earnXP }) {
  const [lbFilter, setLbFilter] = useState("all");
  const [lbSearch, setLbSearch] = useState("");

  const getFilteredLeaderboard = () => {
    let devs = [...leaderboardData];
    if (lbSearch.trim() !== "") {
      const q = lbSearch.toLowerCase();
      devs = devs.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) || 
        (d.email && d.email.toLowerCase().includes(q))
      );
    }
    return devs;
  };

  return (
    <section 
      className="xp-system-section" 
      id="xp-system" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${bgImage5})`, 
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
          <h2 className="section-title" style={{ color: '#ffffff' }}>Velocity XP Dashboard</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1', marginBottom: 0 }}>Complete tasks, gain XP, unlock badges, and rise up the cohort leaderboard.</p>
        </div>

        <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
          {/* Leaderboard Table */}
          <div className="leaderboard-panel glass-card">
            <div className="leaderboard-header">
              <h3>Cohort Leaderboard</h3>
              <div className="leaderboard-filters">
                <input
                  type="text"
                  id="leaderboard-search"
                  className="leaderboard-search-input"
                  placeholder="Search developer..."
                  value={lbSearch}
                  onChange={(e) => setLbSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Developer</th>
                    <th>Email</th>
                    <th className="text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody id="leaderboard-tbody">
                  {leaderboardData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={24} style={{ display: 'inline-block', color: '#00f0ff' }} />
                        <p style={{ color: 'rgba(148,163,184,0.7)', fontStyle: 'italic', marginTop: '0.5rem', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
                          Loading cohort rankings...
                        </p>
                      </td>
                    </tr>
                  ) : (
                    getFilteredLeaderboard().map((dev, idx) => {
                      const loggedInEmail = localStorage.getItem("email") || "";
                      const isActive = dev.email === loggedInEmail;
                      return (
                        <tr key={idx} className={isActive ? 'active-user-row' : ''}>
                          <td className="table-rank">#{idx + 1}</td>
                          <td>
                            <div className="table-developer-cell">
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00f0ff 0%, #39ff14 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#030813',
                                fontSize: '0.85rem',
                                fontFamily: 'var(--font-mono)',
                                flexShrink: 0
                              }}>
                                {dev.name ? dev.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div>
                                <span className="dev-name">{dev.name || 'Anonymous'}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="table-email font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>{dev.email}</span>
                          </td>
                          <td className="table-xp text-right font-mono">
                            {dev.xp === null ? (
                              <Loader2 className="animate-spin" size={12} style={{ display: 'inline-block' }} />
                            ) : (
                              dev.xp.toLocaleString()
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* XP Badges Grid */}
        <div className="badges-showcase">
          <h3 className="mono-font text-center text-electric-blue">&gt; EARNED_BADGES</h3>
          <div className="badges-grid" id="badges-container">
            <div className={`badge-card glass-card ${badges.includes('badge-initiation') ? 'unlocked' : 'locked'}`} id="badge-initiation">
              <div className="badge-icon-visual">
                <Zap size={20} />
              </div>
              <h4>First Commit</h4>
              <p className="badge-desc">Submitted proof of work on Day 1.</p>
              <span className="badge-status-text">{badges.includes('badge-initiation') ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
            <div className={`badge-card glass-card ${badges.includes('badge-streak') ? 'unlocked' : 'locked'}`} id="badge-streak">
              <div className="badge-icon-visual">
                <Award size={20} />
              </div>
              <h4>Consistency Core</h4>
              <p className="badge-desc">Maintained a 7-day streak.</p>
              <span className="badge-status-text">{badges.includes('badge-streak') ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
            <div className={`badge-card glass-card ${badges.includes('badge-algorithm') ? 'unlocked' : 'locked'}`} id="badge-algorithm">
              <div className="badge-icon-visual">
                <Code size={20} />
              </div>
              <h4>Recursion Ruler</h4>
              <p className="badge-desc">Unlock at 1,000 XP.</p>
              <span className="badge-status-text">{badges.includes('badge-algorithm') ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
            <div className={`badge-card glass-card ${badges.includes('badge-legend') ? 'unlocked' : 'locked'}`} id="badge-legend">
              <div className="badge-icon-visual">
                <Trophy size={20} />
              </div>
              <h4>Velocity Titan</h4>
              <p className="badge-desc">Unlock at 2,000 XP.</p>
              <span className="badge-status-text">{badges.includes('badge-legend') ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}