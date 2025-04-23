// src/components/dashboards/AdminDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Assuming you have a CSS file for styling

const AdminDashboard = ({ setUserToEdit }) => {
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleAddUser = () => navigate('/user-form');
  const handleEditUser = () => {
    setUserToEdit(null);
    navigate('/user-list');
  };
  const handleDeleteUser = () => navigate('/user-list');
  const handleViewUsers = () => navigate('/user-list');
  const handleApproveLibrarian = () => navigate('/approve-librarian');
  const handleApproveClientPatron = () => navigate('/approve-client-patron');
  const handleManageBorrowedBooks = () => navigate('/borrowed-books');
  const handleManageReturnRequests = () => navigate('/return-requests');
  const handleManageExtensionRequests = () => navigate('/extension-requests');
  const handleIssuedBooks = () => navigate('/issued-books');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        <h2>👑 Admin Dashboard</h2>
        <div className="button-grid">
          <button onClick={handleAddUser} className="dash-btn primary">➕ Add User</button>
          <button onClick={handleEditUser} className="dash-btn info">📝 Edit User</button>
          <button onClick={handleDeleteUser} className="dash-btn danger">❌ Delete User</button>
          <button onClick={handleViewUsers} className="dash-btn warning">📜 View All Users</button>
          <button onClick={handleApproveLibrarian} className="dash-btn success">✅ Approve Librarian</button>
          <button onClick={handleApproveClientPatron} className="dash-btn success">🧾 Approve Client/Patron</button>
          <button onClick={handleManageBorrowedBooks} className="dash-btn primary">📚 Manage Borrowed Books</button>
          <button onClick={handleManageReturnRequests} className="dash-btn info">🔄 Manage Return Requests</button>
          <button onClick={handleManageExtensionRequests} className="dash-btn warning">⏳ Manage Extension Requests</button>
          <button onClick={handleIssuedBooks} className="dash-btn info">📘 Issued Books</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
