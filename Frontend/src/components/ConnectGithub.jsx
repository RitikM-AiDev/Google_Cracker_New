import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, ArrowRight, GitBranch } from 'lucide-react';
import { BACKEND_URL } from '../constants';

function ConnectGithub() {
  const connectGitHub = () => {
    window.location.href = `${BACKEND_URL}/login/github`;
  };

  const overlayContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box',
      fontFamily: "'Raleway', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');
        .github-overlay-card {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .btn-connect-github {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
        }
        .btn-connect-github:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.4);
          background: linear-gradient(135deg, #15803d 0%, #16a34a 100%) !important;
        }
        .btn-connect-github:active {
          transform: translateY(1px);
        }
      `}</style>
      
      <div className="github-overlay-card" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #16a34a',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(22, 163, 74, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        {/* Shield Icon / GitBranch Icon */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)'
        }}>
          <GitBranch size={40} />
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            background: '#1e293b',
            color: '#ffffff',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <ShieldAlert size={14} />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          color: '#0f172a',
          fontSize: '1.6rem',
          fontWeight: 900,
          margin: '0.5rem 0 0 0',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          Action Required: Connect GitHub
        </h2>

        {/* Explanation */}
        <p style={{
          color: '#475569',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          margin: 0,
          fontWeight: 500
        }}>
          To complete your enrollment in the cohort, you must connect your GitHub account. This enables automated repository verification and task tracking.
        </p>

        {/* Info Box */}
        <div style={{
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: '#15803d',
          fontWeight: 600,
          textAlign: 'left',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          ⚡ Connecting GitHub is mandatory to activate your workspace and earn weekly XP.
        </div>

        {/* Connect Button */}
        <button 
          onClick={connectGitHub}
          className="btn-connect-github"
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '1rem',
            cursor: 'pointer',
            letterSpacing: '0.05em'
          }}
        >
          Connect GitHub
        </button>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
}

export default ConnectGithub;

