// src/components/users/UserList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in as an admin to view users.');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/users/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => {
      console.error(err);
      setError('Failed to fetch users.');
    });
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('access_token');
    axios.delete(`http://127.0.0.1:8000/api/users/delete/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setUsers(users.filter(u => u.id !== userId)))
    .catch(err => {
      console.error(err);
      setError('Failed to delete user.');
    });
  };

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="delete-button"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
