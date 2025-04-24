import React, { useState, useEffect } from 'react';
import './UserList.css';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api'; // Adjust path based on file location

const UserList = ({ setUserToEdit }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in as an admin to view users.');
      return;
    }

    userAPI.list()
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

    userAPI.remove(userId)
      .then(() => setUsers(users.filter(u => u.id !== userId)))
      .catch(err => {
        console.error(err);
        setError('Failed to delete user.');
      });
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    navigate('/user-form');
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
                  <button onClick={() => handleEdit(user)} className="edit-button">✏️ Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">❌ Delete</button>
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
