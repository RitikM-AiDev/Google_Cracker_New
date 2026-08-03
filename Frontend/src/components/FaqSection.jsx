import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [faqActive, setFaqActive] = useState({ 0: false, 1: false, 2: false });

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="glass-card" style={{ maxWidth: '1480px', width: '100%', boxSizing: 'border-box', margin: '0 auto 2.5rem', padding: '2.5rem 2rem', textAlign: 'center', background: 'rgba(12, 18, 34, 0.18)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.22)', borderRadius: '20px' }}>
          <h2 className="section-title text-center" style={{ color: '#ffffff', margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="faq-grid" style={{ maxWidth: '1480px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
          {[
            {
              q: "Is this cohort for absolute beginners?",
              a: "No. Velocity is designed for junior developers, computer science students, and self-taught engineers who already know basic programming principles and wish to transition into high-performing builders."
            },
            {
              q: "What happens if I miss a Proof of Work day?",
              a: "Missing a day resets your streak multiplier to 1.0x. However, you can trigger your \"Safe Haven Pass\" up to twice a quarter to protect your streak."
            },
            {
              q: "What is the price of the cohort?",
              a: "Pricing and scholarship details are shared post-application, based on portfolio assessment and commitment levels during interviews."
            }
          ].map((faqItem, idx) => (
            <div key={idx} className={`faq-item glass-card ${faqActive[idx] ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => setFaqActive(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                <span>{faqItem.q}</span>
                <ChevronDown className="faq-chevron" size={16} />
              </div>
              <div className="faq-answer">
                <p>{faqItem.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
