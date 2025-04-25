import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const handleAddBook = () => navigate('/book-form'); // Add Book page
  const handleManageBooks = () => navigate('/book-list'); // Manage Books page
  const handleApprovePatron = () => navigate('/approve-patron');
  const handleManageBorrowedBooks = () => navigate('/borrowed-books');
  const handleManageReturnRequests = () => navigate('/return-requests');
  const handleManageExtensionRequests = () => navigate('/extension-requests');
  const handleIssuedBooks = () => navigate('/issued-books');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2>📚 Librarian Dashboard</h2>
        <div className="button-grid">
          <button onClick={handleApprovePatron} className="dash-btn success">✅ Pending Patron</button>
          <button onClick={handleAddBook} className="dash-btn primary">📕 Add Book</button>
          <button onClick={handleManageBooks} className="dash-btn warning">📖 Manage Books</button>
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
