// src/components/LoginForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import the LoginForm-specific styles

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Clear error before processing
    setError('');

    try {
      // Send login request to Django backend (no need for CSRF token with JWT)
      const response = await fetch('http://127.0.0.1:8000/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          action: 'login',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        const { role, access, refresh, username, user_id } = data;

        // Store JWT tokens in localStorage (you can also use sessionStorage or cookies)
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role);
        localStorage.setItem('username', username);
        localStorage.setItem('user_id', user_id);

        // Navigate to the respective dashboard based on the role
        navigate(`/${role}-dashboard`);
      } else {
        // Handle login error
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
