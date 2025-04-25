// src/components/dashboards/librarian/ApproveClientPatron.js
import React, { useEffect, useState } from 'react';
import { userAPI } from '../../../services/api';

const ApprovePatrons = () => {
  const [pendingPatrons, setPendingPatrons] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPatrons();
  }, []);

  const fetchPendingPatrons = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in as an admin to view pending patrons.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await userAPI.getPendingPatrons(token);
      const patronsOnly = data.filter(user => user.role === 'patron');
      setPendingPatrons(patronsOnly);
    } catch (err) {
      console.error('Error fetching pending patrons:', err);
      setError('Failed to fetch pending patrons.');
    } finally {
      setLoading(false);
    }
  };

  const approvePatron = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await userAPI.approveUser(id, token);
      setPendingPatrons(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error approving patron:', err);
      setError('Failed to approve patron.');
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Patrons</h2>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading pending patrons...</p>
      ) : pendingPatrons.length === 0 ? (
        <p>No pending patrons.</p>
      ) : (
        <ul className="pending-list">
          {pendingPatrons.map(user => (
            <li key={user.id}>
              <span>{user.username} - {user.email} ({user.role})</span>
              <button onClick={() => approvePatron(user.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovePatrons;
