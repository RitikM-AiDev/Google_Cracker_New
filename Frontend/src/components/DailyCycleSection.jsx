import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cycleSteps } from '../constants';
import bgImage6 from '../assets/google_cafeteria_bright.png';


export default function DailyCycleSection() {
  const [currentCycleStep, setCurrentCycleStep] = useState(0);

  const activeStep = cycleSteps[currentCycleStep];

  return (
    <section 
      className="daily-cycle-section" 
      id="daily-cycle" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 5, 9, 0.20), rgba(3, 5, 9, 0.35)), url(${bgImage6})`, 
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
          <h2 className="section-title" style={{ color: '#ffffff' }}>The Velocity Daily Cycle</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1', marginBottom: 0 }}>A perfect 24-hour cycle of deliberate practice. Click steps to understand core structures.</p>
        </div>

        <div className="cycle-grid">
          <div className="svg-diagram-wrapper">
            <svg className="cycle-svg" viewBox="0 0 400 400" width="100%" height="100%">
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#060913" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="140" fill="url(#centerGlow)" />
              
              {/* Connectors */}
              <circle cx="200" cy="200" r="120" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="2" fill="none" strokeDasharray="10 10" />
              
              <text x="200" y="195" fontFamily="'Share Tech Mono', monospace" fontSize="16" fill="#00f0ff" textAnchor="middle" letterSpacing="1">VELOCITY</text>
              <text x="200" y="215" fontFamily="'Share Tech Mono', monospace" fontSize="11" fill="#39ff14" textAnchor="middle" letterSpacing="3">24-HOUR ROT</text>

              {/* Nodes */}
              <g className={`svg-node ${currentCycleStep === 0 ? 'active' : ''}`} id="node-learn" transform="translate(200, 70)" onClick={() => setCurrentCycleStep(0)}>
                <circle r="28" className="node-circle" />
                <text className="node-icon" y="5" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="11">LEARN</text>
              </g>
              <g className={`svg-node ${currentCycleStep === 1 ? 'active' : ''}`} id="node-solve" transform="translate(320, 150)" onClick={() => setCurrentCycleStep(1)}>
                <circle r="28" className="node-circle" />
                <text className="node-icon" y="5" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="11">SOLVE</text>
              </g>
              <g className={`svg-node ${currentCycleStep === 2 ? 'active' : ''}`} id="node-build" transform="translate(275, 290)" onClick={() => setCurrentCycleStep(2)}>
                <circle r="28" className="node-circle" />
                <text className="node-icon" y="5" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="11">BUILD</text>
              </g>
              <g className={`svg-node ${currentCycleStep === 3 ? 'active' : ''}`} id="node-commit" transform="translate(125, 290)" onClick={() => setCurrentCycleStep(3)}>
                <circle r="28" className="node-circle" />
                <text className="node-icon" y="5" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="11">COMMIT</text>
              </g>
              <g className={`svg-node ${currentCycleStep === 4 ? 'active' : ''}`} id="node-reflect" transform="translate(80, 150)" onClick={() => setCurrentCycleStep(4)}>
                <circle r="28" className="node-circle" />
                <text className="node-icon" y="5" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="11">REFLECT</text>
              </g>
            </svg>
          </div>

          {/* Interactive Stepper Details */}
          <div className="stepper-details-card glass-card">
            <div className="stepper-header-title">
              <span className="step-indicator" id="step-number">{activeStep.num}</span>
              <h3 id="step-title">{activeStep.title}</h3>
            </div>
            <div className="step-body-content">
              <p id="step-description">{activeStep.description}</p>
              
              <div className="step-metrics-badge font-mono">
                <span>{activeStep.metric.split("|")[0]?.trim()}</span>
                <span>{activeStep.metric.split("|")[1]?.trim()}</span>
              </div>
            </div>

            <div className="stepper-nav-buttons">
              <button 
                className="btn btn-secondary btn-sm" 
                id="stepper-prev-btn"
                onClick={() => setCurrentCycleStep(prev => (prev - 1 + cycleSteps.length) % cycleSteps.length)}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button 
                className="btn btn-primary btn-sm" 
                id="stepper-next-btn"
                onClick={() => setCurrentCycleStep(prev => (prev + 1) % cycleSteps.length)}
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
