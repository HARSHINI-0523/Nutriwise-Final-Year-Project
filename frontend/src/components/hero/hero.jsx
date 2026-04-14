import React from 'react';
import './hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Your Health, Simplified with AI
          </h1>
          <p className="hero-subtitle">
            Personalized Diet & Lab Report Insights Powered by AI
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Get My Diet Plan
            </button>
            <button className="btn btn-secondary">
              Analyze My Report
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="ai-brain-glow"></div>
          <div className="floating-icons">
            <div className="food-icon">🍎</div>
            <div className="food-icon">🥗</div>
            <div className="food-icon">💊</div>
            <div className="food-icon">🏃</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
