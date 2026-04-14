import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserLoginContext.jsx';
import './navbar.css';

const Navbar = () => {
  const { isAuthenticated, currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLogout = () => {
    logOut();
    navigate('/login');
  };

  const userName = currentUser?.displayName || currentUser?.email || 'User Profile';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="logo-icon">
            <img src="/nutriwise.jpg" alt="NutriWise Logo" />
          </div>
          <span className="logo-text">NutriWise</span>
        </div>
        
        <div className="nav-links">
          <a 
            href="#home" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
          >
            Home
          </a>
          <a 
            href="#features" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('how-it-works');
            }}
          >
            How It Works
          </a>
          <a 
            href="#demo" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('demo');
            }}
          >
            Demo
          </a>
          <a 
            href="#community" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('community');
            }}
          >
            Community
          </a>
        </div>
        
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
    <Link 
      to="/profile" 
      className="nav-profile-link" 
      title={userName}
    >
     {userName}
    </Link>
    <button 
      onClick={handleLogout} 
      className="nav-btn nav-btn-primary"
    >
      Log Out
    </button>
  </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-secondary">
                Sign In
              </Link>
              <Link to="/login" className="nav-btn nav-btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;