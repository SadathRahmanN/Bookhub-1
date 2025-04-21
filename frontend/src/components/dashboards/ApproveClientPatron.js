// src/components/dashboards/ApproveClientPatron.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const ApproveClientPatron = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in as an admin to view pending users.');
      return;
    }

    try {
      const response = await axios.get('/api/users/?is_approved=false', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filtered = response.data.filter(user =>
        user.role === 'client' || user.role === 'patron'
      );
      setPendingUsers(filtered);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setError('Failed to fetch pending users.');
    }
  };

  const approveUser = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await axios.patch(`/api/users/${id}/`, { is_approved: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Failed to approve user.');
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Clients & Patrons</h2>
      {error && <p className="error">{error}</p>}
      {pendingUsers.length === 0 ? (
        <p>No pending clients or patrons.</p>
      ) : (
        <ul className="pending-list">
          {pendingUsers.map(user => (
            <li key={user.id}>
              <span>{user.username} - {user.email} ({user.role})</span>
              <button onClick={() => approveUser(user.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveClientPatron;
