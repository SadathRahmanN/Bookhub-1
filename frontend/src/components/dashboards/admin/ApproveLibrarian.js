import React, { useEffect, useState } from 'react';
import { userAPI } from '../../../services/api';  // Importing userAPI
import '../Dashboard.css';

const ApproveLibrarian = () => {
  const [pendingLibrarians, setPendingLibrarians] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLibrarians();
  }, []);

  const fetchPendingLibrarians = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to view pending librarians.');
      setLoading(false);
      return;
    }

    try {
      // Using the correct API method: userAPI.pending()
      const { data } = await userAPI.pending();
      const librariansOnly = data.filter(user => user.role === 'librarian');
      setPendingLibrarians(librariansOnly);
    } catch (err) {
      console.error('Error fetching pending librarians:', err);
      setError('Failed to fetch pending librarians.');
    } finally {
      setLoading(false);
    }
  };

  const approveLibrarian = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await userAPI.approve(id); // Using the approve method from userAPI
      setPendingLibrarians(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error approving librarian:', err);
      setError('Failed to approve librarian.');
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>✅ Approve Librarians</h2>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading pending librarians...</p>
      ) : pendingLibrarians.length === 0 ? (
        <p>No pending librarians.</p>
      ) : (
        <ul className="pending-list">
          {pendingLibrarians.map(user => (
            <li key={user.id}>
              <span>{user.username} - {user.email} ({user.role})</span>
              <button onClick={() => approveLibrarian(user.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveLibrarian;
