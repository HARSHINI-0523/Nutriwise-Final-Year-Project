import React from 'react';
import './cta.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-card">
          <div className="cta-background">
            <div className="cta-shapes">
              <div className="cta-shape cta-shape-1"></div>
              <div className="cta-shape cta-shape-2"></div>
              <div className="cta-shape cta-shape-3"></div>
            </div>
          </div>
          
          <div className="cta-content">
            <div className="cta-icons">
              <div className="health-icon">🏥</div>
              <div className="health-icon">🧠</div>
              <div className="health-icon">💊</div>
              <div className="health-icon">📊</div>
            </div>
            
            <h2 className="cta-title">Ready to take control of your health?</h2>
            <p className="cta-subtitle">
              Join thousands of users who are already transforming their health journey with AI-powered insights
            </p>
            
            <div className="cta-buttons">
              <button className="cta-btn cta-btn-primary">
                Sign Up Free
              </button>
              <button className="cta-btn cta-btn-secondary">
                Upload Report
              </button>
            </div>
            
            <div className="cta-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Reports Analyzed</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">User Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
