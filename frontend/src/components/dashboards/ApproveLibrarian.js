// src/components/dashboards/ApproveLibrarian.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const ApproveLibrarian = () => {
  const [pendingLibrarians, setPendingLibrarians] = useState([]);

  useEffect(() => {
    fetchPendingLibrarians();
  }, []);

  const fetchPendingLibrarians = async () => {
    try {
      const response = await axios.get('/api/users/?role=librarian&is_approved=false');
      setPendingLibrarians(response.data);
    } catch (error) {
      console.error('Error fetching pending librarians:', error);
    }
  };

  const approveLibrarian = async (id) => {
    try {
      await axios.patch(`/api/users/${id}/`, { is_approved: true });
      setPendingLibrarians(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error approving librarian:', error);
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Librarians</h2>
      {pendingLibrarians.length === 0 ? (
        <p>No pending librarians.</p>
      ) : (
        <ul className="pending-list">
          {pendingLibrarians.map(user => (
            <li key={user.id}>
              <span>{user.username} - {user.email}</span>
              <button onClick={() => approveLibrarian(user.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveLibrarian;
