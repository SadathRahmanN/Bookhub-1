import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setFormType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDashboard = location.pathname.includes('dashboard');

  // This effect runs when the component mounts and on changes to localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Only check on initial render and on localStorage changes

  // Handle logout (clear token and update state)
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/');
    if (setFormType) setFormType('home');
  };

  // Scroll to section with offset for fixed navbar
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Adjust this value based on your navbar height
      const position = element.offsetTop - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
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

      {/* Center: Nav links */}
      {!isDashboard && (
        <div className="nav-links">
          <button className="nav-button" onClick={() => scrollToSection('home')}>
            Home
          </button>
          <button className="nav-button" onClick={() => scrollToSection('books')}>
            Books
          </button>
          <button className="nav-button" onClick={() => scrollToSection('about')}>
            About Us
          </button>
          <button className="nav-button" onClick={() => scrollToSection('contact')}>
            Contact Us
          </button>
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
