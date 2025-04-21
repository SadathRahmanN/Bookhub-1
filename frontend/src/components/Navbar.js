// src/components/Navbar.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setFormType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isDashboard = location.pathname.includes('dashboard');

  useEffect(() => {
    // Check if there's a JWT token in localStorage (or you could use a context)
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token); // If token exists, set logged in state to true
  }, []);

  const handleLogout = () => {
    // Clear the JWT token and update state
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
    if (setFormType) setFormType('home'); // Reset formType state to home
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
        {isLoggedIn ? (
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
