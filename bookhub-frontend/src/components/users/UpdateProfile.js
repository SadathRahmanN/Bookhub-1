// src/components/users/UpdateProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data (for demonstration purposes, we assume the user is already logged in)
    const userId = 1; // Replace with actual user ID from context or props
    axios.get(`http://127.0.0.1:8000/api/users/${userId}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user profile
    const userId = 1; // Replace with actual user ID
    axios.put(`http://127.0.0.1:8000/api/users/${userId}`, user)
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile', error);
      });
  };

  return (
    <div className="update-profile">
      <h2>👤 Update Profile</h2>

      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="update-btn">Update Profile</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;
