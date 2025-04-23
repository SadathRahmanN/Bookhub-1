// src/components/dashboards/ApproveLibrarian.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';

const API_BASE = 'http://127.0.0.1:8000/api';

const ApproveLibrarian = () => {
  const [pendingLibrarians, setPendingLibrarians] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingLibrarians();
  }, []);

  const fetchPendingLibrarians = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to view pending librarians.');
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_BASE}/pending-librarians/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingLibrarians(data);
    } catch (err) {
      console.error('Error fetching pending librarians:', err);
      setError('Failed to fetch pending librarians.');
    }
  };

  const approveLibrarian = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE}/approve-librarian/${id}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // remove from list once approved
      setPendingLibrarians((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error approving librarian:', err);
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
          {pendingLibrarians.map((user) => (
            <li key={user.id}>
              <span>
                {user.username} — {user.email}
              </span>
              <button onClick={() => approveLibrarian(user.id)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveLibrarian;
