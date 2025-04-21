// src/components/dashboards/ApproveClientPatron.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const ApproveClientPatron = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/api/users/?is_approved=false');
      const filtered = response.data.filter(user =>
        user.role === 'client' || user.role === 'patron'
      );
      setPendingUsers(filtered);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.patch(`/api/users/${id}/`, { is_approved: true });
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Clients & Patrons</h2>
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
