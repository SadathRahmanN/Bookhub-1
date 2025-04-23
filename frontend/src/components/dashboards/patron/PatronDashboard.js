// src/components/dashboards/PatronDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const PatronDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleViewBorrowedBooks = () => navigate('/borrowed-books');
  const handleRequestBookReturn = () => navigate('/return-request');
  const handleRequestBookExtension = () => navigate('/extension-request');
  const handleUpdateProfile = () => navigate('/update-profile');
  const handleSearchBooks = () => navigate('/search-books');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        <h2>📘 Patron Dashboard</h2>
        <div className="button-grid">
          <button onClick={handleSearchBooks} className="dash-btn primary">🔍 Search Books</button>
          <button onClick={handleViewBorrowedBooks} className="dash-btn warning">📚 View Borrowed Books</button>
          <button onClick={handleRequestBookReturn} className="dash-btn success">🔄 Request Book Return</button>
          <button onClick={handleRequestBookExtension} className="dash-btn success">⏳ Request Extension</button>
          <button onClick={handleUpdateProfile} className="dash-btn info">📝 Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default PatronDashboard;
