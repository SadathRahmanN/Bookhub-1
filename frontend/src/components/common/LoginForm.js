import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api'; // Assuming this is your API service
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.loginSignup({
        username,
        password,
        action: 'login',
      });
      const data = response.data;

      // Store tokens & user data
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('user_id', data.user_id);

      // Redirect to dashboard
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again .';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="form-footer">
        <a href="/forgot-password" className="link">Forgot password?</a>
        <p>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="link">
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;