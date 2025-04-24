import React, { useState } from 'react';
import './ForgotPassword.css';
import { userAPI } from '../../services/api'; // Update this path based on your structure

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.forgotPassword({ email }); // Implement this in your backend
      setMessage(response.data.message || 'Password reset link sent to your email.');
      setError('');
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
