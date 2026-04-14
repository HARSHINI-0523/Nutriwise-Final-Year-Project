import React from 'react';
import './community.css';

const Community = () => {
  const challenges = [
    {
      title: '7-Day Hydration Challenge',
      icon: '💧',
      participants: '2,341',
      description: 'Stay hydrated and track your water intake',
      color: '#3b82f6'
    },
    {
      title: '30-Day Fitness Streak',
      icon: '🏃‍♂️',
      participants: '1,892',
      description: 'Complete daily workouts and build healthy habits',
      color: '#10b981'
    },
    {
      title: 'Healthy Meal Prep',
      icon: '🥗',
      participants: '1,567',
      description: 'Plan and prepare nutritious meals for the week',
      color: '#f59e0b'
    }
  ];


  return (
    <section id="community" className="community">
      <div className="container">
        <div className="community-header">
          <h2 className="community-title">Join Our Health Community</h2>
          <p className="community-subtitle">
            Connect, challenge yourself, and achieve your health goals together
          </p>
        </div>
        
        <div className="challenges-section">
          <h3 className="challenges-title">Active Challenges</h3>
          <div className="challenges-grid">
            {challenges.map((challenge, index) => (
              <div key={index} className="challenge-card" style={{ '--challenge-color': challenge.color }}>
                <div className="challenge-icon">{challenge.icon}</div>
                <h4 className="challenge-name">{challenge.title}</h4>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-stats">
                  <span className="participants">{challenge.participants} participants</span>
                </div>
                <button className="join-challenge-btn">Join Challenge</button>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Community;
