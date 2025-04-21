// src/components/Navbar.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setFormType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.includes('dashboard');

  const handleLogout = () => {
    navigate('/');
    if (setFormType) setFormType('home');
  };

  return (
    <div className="top-navbar">
      {/* BookHub Heading and Icon */}
      <div className="logo">
        <span>📚 BookHub</span>
      </div>

      {/* Search bar (always visible) */}
      <div className="search-container">
        <input type="text" placeholder="Search books or users..." className="search-input" />
        <button className="search-button">🔍</button>
      </div>

      {/* Navigation Links (only on home) */}
      {!isDashboard && (
        <div className="nav-links">
          <a href="#home" className="nav-button" onClick={() => setFormType('home')}>Home</a>
          <a href="#books" className="nav-button">Books</a>
          <a href="#about" className="nav-button">About Us</a>
          <a href="#contact" className="nav-button">Contact Us</a>
        </div>
      )}

      {/* Auth buttons or Logout */}
      <div className="auth-links">
        {isDashboard ? (
          <button onClick={handleLogout} className="auth-button">Logout</button>
        ) : (
          <>
            <button onClick={() => setFormType('login')} className="auth-button">Login</button>
            <button onClick={() => setFormType('signup')} className="auth-button">Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
