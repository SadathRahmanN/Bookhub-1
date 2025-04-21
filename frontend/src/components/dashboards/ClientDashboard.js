import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();

  // Logout function to redirect to home
  const handleLogout = () => navigate('/');

  // View books function to navigate to the books page
  const handleViewBooks = () => navigate('/books');

  // Search books function to navigate to search page (without search bar)
  const handleSearchBooks = () => navigate('/search-books');

  // Update profile function to navigate to the update profile page
  const handleUpdateProfile = () => navigate('/update-profile');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        <h2>📖 Client Dashboard</h2>

        {/* Button Grid for dashboard actions */}
        <div className="button-grid">
          <button onClick={handleViewBooks} className="dash-btn primary">📚 View Books</button>
          <button onClick={handleSearchBooks} className="dash-btn info">🔍 Search Books</button>
          <button onClick={handleUpdateProfile} className="dash-btn warning">👤 Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
