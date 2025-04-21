// src/components/requests/ExtensionRequests.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../dashboards/Dashboard.css';

const ExtensionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtensionRequests();
  }, []);

  const fetchExtensionRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/extension-requests/');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching extension requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/approve-extension/${id}/`);
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>Extension Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending extension requests.</p>
      ) : (
        <ul className="pending-list">
          {requests.map((req) => (
            <li key={req.id}>
              <span>
                User: {req.user} — Book: "{req.book}" — Requested Extension: {req.extension_days} days
              </span>
              <button onClick={() => handleApprove(req.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExtensionRequests;
