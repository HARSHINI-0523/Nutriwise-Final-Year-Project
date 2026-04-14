import React from 'react';
import './features.css';

const Features = () => {
  const features = [
    {
      icon: '🍎',
      title: 'AI Diet Plans',
      description: 'Personalized meal recommendations based on your health data and preferences',
      color: '#10b981'
    },
    {
      icon: '🧪',
      title: 'Lab Report Analysis',
      description: 'Upload & understand your medical reports with AI-powered explanations',
      color: '#3b82f6'
    },
    {
      icon: '📅',
      title: 'Health Tracker',
      description: 'Set reminders, schedule checkups, and monitor your progress',
      color: '#8b5cf6'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">Powerful AI Features</h2>
          <p className="features-subtitle">
            Everything you need to take control of your health journey
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ '--accent-color': feature.color }}>
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
