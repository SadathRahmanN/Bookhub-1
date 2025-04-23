import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setFormType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDashboard = location.pathname.includes('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/');
    if (setFormType) setFormType('home');
  };

  return (
    <div className="top-navbar">
      {/* Left: Logo + Search */}
      <div className="navbar-left">
        <div className="logo">📚 BookHub</div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search books or authors..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>

      {/* Center: Nav links (only on home) */}
      {!isDashboard && (
        <div className="nav-links">
          <button className="nav-button" onClick={() => setFormType('home')}>
            Home
          </button>
          <button className="nav-button">Books</button>
          <button className="nav-button">About Us</button>
          <button className="nav-button">Contact Us</button>
        </div>
      )}

      {/* Right: Auth */}
      <div className="auth-links">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="auth-button">
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => setFormType('login')} className="auth-button">
              Login
            </button>
            <button onClick={() => setFormType('signup')} className="auth-button">
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
