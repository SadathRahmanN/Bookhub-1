// src/components/requests/ReturnRequests.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../dashboards/Dashboard.css';

const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/return-requests/');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching return requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/approve-return/${id}/`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error('Error approving return request:', error);
    }
  };

  return (
    <div className="approve-librarian-container">
      <h2>Return Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending return requests.</p>
      ) : (
        <ul className="pending-list">
          {requests.map((req) => (
            <li key={req.id}>
              <span>
                User: {req.user} — Book: "{req.book}" — Return Date: {req.return_date}
              </span>
              <button onClick={() => handleApprove(req.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReturnRequests;
