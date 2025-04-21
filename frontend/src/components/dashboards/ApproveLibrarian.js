// src/components/dashboards/ApproveLibrarian.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const ApproveLibrarian = () => {
  const [pendingLibrarians, setPendingLibrarians] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingLibrarians();
  }, []);

  const fetchPendingLibrarians = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in as an admin to view pending librarians.');
      return;
    }

    try {
      const response = await axios.get('/api/users/?role=librarian&is_approved=false', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingLibrarians(response.data);
    } catch (error) {
      console.error('Error fetching pending librarians:', error);
      setError('Failed to fetch pending librarians.');
    }
  };

  const approveLibrarian = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await axios.patch(`/api/users/${id}/`, { is_approved: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLibrarians(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error approving librarian:', error);
      setError('Failed to approve librarian.');
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Librarians</h2>
      {error && <p className="error">{error}</p>}
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
