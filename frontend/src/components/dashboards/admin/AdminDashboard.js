import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Assuming you have a CSS file for styling

const AdminDashboard = ({ setUserToEdit }) => {
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleManageUsers = () => navigate('/user-list');
  const handleAddUser = () => navigate('/user-form');  // Add User page
  const handleAddBook = () => navigate('/book-form'); // Add Book page
  const handleManageBooks = () => navigate('/book-list') // Manage Books page
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
          {/* Manage Users Section */}
          <button onClick={handleAddUser} className="dash-btn success">➕ Add User</button>
          <button onClick={handleManageUsers} className="dash-btn primary">👥 Manage Users</button>
          <button onClick={handleApproveLibrarian} className="dash-btn success">✅ Pending Librarian</button>
          <button onClick={handleApproveClientPatron} className="dash-btn success">🧾 Pending Client/Patron</button>

          {/* Manage Books Section */}
          <button onClick={handleAddBook} className="dash-btn success">📚 Add Book</button>
          <button onClick={handleManageBooks} className="dash-btn warning">📖 Manage Books</button>

          {/* Other Admin Actions */}
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
