// src/components/dashboards/LibrarianDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleAddBook = () => navigate('/book-form');
  const handleEditBook = () => navigate('/book-list');
  const handleDeleteBook = () => navigate('/book-list');
  const handleViewInventory = () => navigate('/book-list');
  const handleApproveClientPatron = () => navigate('/approve-client-patron');
  const handleManageBorrowedBooks = () => navigate('/borrowed-books');
  const handleManageReturnRequests = () => navigate('/return-requests');
  const handleManageExtensionRequests = () => navigate('/extension-requests');
  const handleIssuedBooks = () => navigate('/issued-books');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        <h2>📚 Librarian Dashboard</h2>
        <div className="button-grid">
          <button onClick={handleAddBook} className="dash-btn primary">📕 Add Book</button>
          <button onClick={handleEditBook} className="dash-btn info">📖 Edit Book</button>
          <button onClick={handleDeleteBook} className="dash-btn danger">📛 Delete Book</button>
          <button onClick={handleViewInventory} className="dash-btn warning">📚 View Inventory</button>
          <button onClick={handleApproveClientPatron} className="dash-btn success">✅ Approve Client/Patron</button>
          <button onClick={handleManageBorrowedBooks} className="dash-btn primary">📚 Manage Borrowed Books</button>
          <button onClick={handleManageReturnRequests} className="dash-btn info">🔄 Manage Return Requests</button>
          <button onClick={handleManageExtensionRequests} className="dash-btn warning">⏳ Manage Extension Requests</button>
          <button onClick={handleIssuedBooks} className="dash-btn info">📘 Issued Books</button>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
