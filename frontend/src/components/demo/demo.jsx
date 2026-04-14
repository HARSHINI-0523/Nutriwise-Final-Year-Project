import React, { useState, useEffect } from 'react';
import './demo.css';

const Demo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const demoScreens = [
    {
      title: 'My Diet Plan',
      description: 'AI-optimized meal recommendations',
      image: '🍽️',
      beforeAfter: {
        before: 'Plain food list',
        after: 'AI-optimized meal plan'
      }
    },
    {
      title: 'Report Analysis',
      description: 'Simplified medical insights',
      image: '📊',
      beforeAfter: {
        before: 'Complex medical jargon',
        after: 'Easy-to-understand explanations'
      }
    },
    {
      title: 'Health Recipes',
      description: 'Personalized cooking suggestions',
      image: '👨‍🍳',
      beforeAfter: {
        before: 'Generic recipes',
        after: 'Health-focused meal plans'
      }
    },
    {
      title: 'Social Features',
      description: 'Connect with health community',
      image: '👥',
      beforeAfter: {
        before: 'Solo health journey',
        after: 'Community support & motivation'
      }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoScreens.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="demo">
      <div className="container">
        <div className="demo-header">
          <h2 className="demo-title">See NutriWise in Action</h2>
          <p className="demo-subtitle">
            Experience the power of AI-driven health insights
          </p>
        </div>
        
        <div className="demo-carousel">
          <div className="carousel-container">
            {demoScreens.map((screen, index) => (
              <div 
                key={index}
                className={`demo-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="slide-content">
                  <div className="slide-visual">
                    <div className="mockup-screen">
                      <div className="screen-header">
                        <div className="screen-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="screen-title">{screen.title}</div>
                      </div>
                      <div className="screen-content">
                        <div className="screen-icon">{screen.image}</div>
                        <div className="screen-text">{screen.description}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="slide-info">
                    <h3 className="slide-title">{screen.title}</h3>
                    <p className="slide-description">{screen.description}</p>
                    
                    <div className="before-after">
                      <div className="before">
                        <span className="label">Before:</span>
                        <span className="text">{screen.beforeAfter.before}</span>
                      </div>
                      <div className="arrow">→</div>
                      <div className="after">
                        <span className="label">After:</span>
                        <span className="text">{screen.beforeAfter.after}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-controls">
            {demoScreens.map((_, index) => (
              <button
                key={index}
                className={`control-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
