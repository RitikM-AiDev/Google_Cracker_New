import React from 'react';
import { BookOpen, CheckCircle, Flame, Trophy, Users, Code, Activity, Target, Zap } from 'lucide-react';
import googleCampus from '../assets/google_campus.png';

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: 0,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Fixed blurred background ── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${googleCampus})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(3.5px) brightness(0.45)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* ── Dark overlay for contrast ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.55)',
        zIndex: 1,
      }} />

      {/* ── Scrollable content ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ── HERO QUOTE ── */}
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '3.5rem 3rem',
          maxWidth: '1100px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '3rem auto 4rem',
          background: 'rgba(12, 18, 34, 0.18)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '24px',
        }}>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 1.25rem',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            💬 Quote of the Journey
          </span>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
            fontWeight: '700',
            fontStyle: 'italic',
            color: '#ffffff',
            lineHeight: 1.4,
            marginBottom: '1.5rem',
            maxWidth: '1100px',
            margin: '0 auto 1.5rem',
          }}>
            "Success at Google is not built in one day. It is built by showing up every single day for 13 months."
          </h1>

          <div style={{ height: '3px', width: '80px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '4px', margin: '0 auto 1.75rem' }} />

          <h2 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>First of all</h2>
          <p style={{ fontSize: '1.15rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
            Thank you for joining the Google Velocity Cohort ❤️
          </p>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Today isn't just another day. Today is the day you decided to invest in yourself.</p>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
            For the next <strong style={{ color: '#ffffff' }}>13 months</strong>, your mission is simple:
          </p>
          <blockquote style={{
            borderLeft: '4px solid rgba(255,255,255,0.4)',
            margin: '0 auto 1.5rem',
            maxWidth: '900px',
            fontSize: '1.15rem',
            fontStyle: 'italic',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            padding: '1rem 1.75rem',
            borderRadius: '0 12px 12px 0',
            color: '#ffffff',
            fontWeight: '600',
            textAlign: 'center',
          }}>
            To become capable of cracking the Google Software Engineer interview.
          </blockquote>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>This journey is not for everyone. It is for people willing to stay consistent when others quit.</p>
          <p style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '700', marginTop: '1.25rem' }}>
            Trust the process. Give your best every day. You will be Google-ready.
          </p>
        </div>

        {/* ── BEFORE YOU BEGIN ── */}
        <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '2.5rem' }}>📝 Before You Begin</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>

            {[
              {
                icon: <BookOpen size={28} color="#4285F4" />,
                accent: '#4285F4',
                title: 'Maintain a Learning Notebook',
                items: ['New concepts', 'Mistakes you made', 'Important algorithms', 'Interview tricks', 'Notes from discussions'],
                footer: 'One notebook. 13 months. Your complete Google interview revision guide.',
              },
              {
                icon: <CheckCircle size={28} color="#34A853" />,
                accent: '#34A853',
                title: 'Submit Proof of Work',
                items: ['Programming Questions', 'GitHub Commits', 'Project Progress', 'Learning Notes'],
                footer: 'No proof. No XP. No shortcuts. Consistency is everything.',
              },
              {
                icon: <Flame size={28} color="#EA4335" />,
                accent: '#EA4335',
                title: 'Never Give Up',
                items: ['Some days you\'ll enjoy coding.', 'Some days you\'ll hate it.', 'Some days one bug takes hours.', 'Don\'t stop.'],
                footer: 'Google rewards people who never stopped learning.',
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'rgba(12, 18, 34, 0.18)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                border: `1px solid rgba(255,255,255,0.22)`,
                borderTop: `4px solid ${card.accent}`,
                borderRadius: '20px',
                padding: '2.25rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ marginBottom: '1rem' }}>{card.icon}</div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{card.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                    {card.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.98rem' }}>
                        <span style={{ color: card.accent, fontSize: '0.9rem' }}>✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 }}>
                  {card.footer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '2.5rem' }}>🌟 Features of the Google Velocity Cohort</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Code size={26} color="#4285F4" />, title: 'Build an Outstanding GitHub Profile', desc: 'Every day you commit code. By the end, you\'ll have a profile that reflects consistency and real work.' },
              { icon: <Users size={26} color="#34A853" />, title: 'Connect with Google-Minded People', desc: 'Surround yourself with students who share the same dream. Build friendships. Form project teams.' },
              { icon: <Flame size={26} color="#EA4335" />, title: 'Weekly Sprint System', desc: 'A structured 5+1+1 cadence keeps you moving forward without burnout or confusion.' },
              { icon: <Trophy size={26} color="#FBBC05" />, title: 'XP & Ranks System', desc: 'Earn XP for every commit, problem solved, and PR merged. Compete on the leaderboard.' },
              { icon: <Activity size={26} color="#4285F4" />, title: 'Daily Proof of Work', desc: 'No passive learning. Everything is verified with Git commits and automated tracking.' },
              { icon: <Target size={26} color="#EA4335" />, title: 'Interview Preparation', desc: 'Targeted DSA patterns, mock interviews, system design fundamentals, and behavioral prep.' },
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW THE JOURNEY WORKS ── */}
        <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>📖 How This Journey Works</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
              A clear, step-by-step breakdown of your daily and weekly routine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '2rem' }}>
              <span style={{ color: '#4285F4', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 01</span>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>🧩 Daily LeetCode Challenge</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>Every morning at 8:00 AM, 3 curated questions are published in the cohort workspace.</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>After solving them, submit your code and proof. Our team verifies and XP is automatically added to your profile.</p>
            </div>

            <div className="glass-card" style={{ background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '2rem' }}>
              <span style={{ color: '#34A853', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 02</span>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>💻 Build Production Projects</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>Apply your DSA skills to real-world fullstack software development projects.</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>By the end, you'll know how to build software — not just solve algorithms.</p>
            </div>
          </div>

          {/* 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {[
              { icon: <Trophy size={28} color="#FBBC05" />, title: '🏆 Weekly Assessments', desc: 'Weekly Coding Assessments, LeetCode Weekly Contests, and Bi-Weekly Assessments to measure your growth and prepare for Google.' },
              { icon: <Activity size={28} color="#4285F4" />, title: '🥇 Rank Board', desc: 'Your assessment scores and XP determine your position. Use competition as motivation — the person above you today can inspire you.' },
              { icon: <Users size={28} color="#34A853" />, title: '🎤 Sunday Learning', desc: 'Every Sunday, top performers explain their approach, optimizations, and mistakes. Learning from peers accelerates understanding.' },
            ].map((c, i) => (
              <div key={i} style={{ background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '2rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{c.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{c.title}</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* XP Table */}
          <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
            <h3 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Zap size={22} color="#FBBC05" /> XP System
            </h3>
            <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '1rem', marginBottom: '2rem' }}>Every action earns XP. Stay consistent, climb faster.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Daily Check-in', xp: '+10 XP', color: '#34A853', desc: 'Proof of work submitted daily' },
                { label: 'GitHub Commit', xp: '+20 XP', color: '#34A853', desc: 'Pushed code to repository' },
                { label: 'LeetCode Easy', xp: '+15 XP', color: '#34A853', desc: 'Solved easy algorithm challenge' },
                { label: 'LeetCode Medium', xp: '+35 XP', color: '#FBBC05', desc: 'Solved medium algorithm challenge' },
                { label: 'LeetCode Hard', xp: '+60 XP', color: '#f87171', desc: 'Solved hard algorithm challenge' },
                { label: 'Project Milestone', xp: '+100 XP', color: '#4285F4', desc: 'Completed major feature build' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.2rem 1.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.05rem', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: item.color, fontWeight: '800', fontSize: '1.15rem', fontFamily: 'var(--font-mono)' }}>{item.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── YOUR MISSION ── */}
        <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '0 1.5rem 6rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>🎯 Your Mission</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
            For the next <strong style={{ color: '#fff' }}>13 months</strong>, your only goal is simple:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { text: '1. Wake up.', accent: '#4285F4' },
              { text: '2. Solve your 3 problems.', accent: '#EA4335' },
              { text: '3. Build your project.', accent: '#FBBC05' },
              { text: '4. Commit your code.', accent: '#34A853' },
              { text: '5. Submit your proof.', accent: '#00f0ff' },
              { text: '6. Earn your XP.', accent: '#a855f7' },
              { text: '7. Repeat.', accent: '#ffffff', bold: true },
            ].map((step, i) => (
              <div key={i} style={{
                padding: step.bold ? '1.25rem 2rem' : '1rem 1.5rem',
                borderRadius: '16px',
                background: step.bold ? `rgba(255,255,255,0.12)` : `rgba(12, 18, 34, 0.18)`,
                border: `1.5px solid ${step.accent}50`,
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                color: '#fff',
                fontSize: step.bold ? '1.3rem' : '1.1rem',
                fontWeight: step.bold ? 900 : 700,
                boxShadow: `0 8px 24px ${step.accent}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {step.text}
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(12, 18, 34, 0.18)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.75rem' }}>When you stay consistent long enough, <span style={{ color: '#4285F4', fontWeight: 'bold' }}>confidence replaces fear.</span></p>
            <p style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.75rem' }}>Knowledge replaces doubt. Discipline replaces excuses.</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '2rem' }}>
              And one day, you'll sit in front of a Google interviewer — not hoping you're ready, but knowing you are.
            </p>
            <h3 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              textAlign: 'center',
              marginBottom: '0.75rem',
              background: 'linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
            }}>
              Welcome to the Google Velocity Cohort.
            </h3>
            <p style={{ fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              The countdown to your Google interview starts today. 🚀
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
