import React from 'react';
import './howItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload Reports / Fill Info',
      description: 'Upload your lab reports or fill out your health information to get started',
      icon: '📄',
      color: '#3b82f6'
    },
    {
      number: '2',
      title: 'Get AI Recommendations',
      description: 'Receive personalized diet plans and risk assessments powered by AI',
      icon: '🤖',
      color: '#10b981'
    },
    {
      number: '3',
      title: 'Track Progress & Connect',
      description: 'Monitor your health journey and connect with friends for motivation',
      icon: '📈',
      color: '#f59e0b'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How It Works</h2>
          <p className="how-it-works-subtitle">
            Get started in just 3 simple steps
          </p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card" style={{ '--step-color': step.color }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
