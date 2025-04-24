import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api'; // Adjust path based on your project structure
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Store user ID on login
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    userAPI.get(userId)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    userAPI.update(userId, user)
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch((err) => {
        console.error('Error updating profile', err);
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
