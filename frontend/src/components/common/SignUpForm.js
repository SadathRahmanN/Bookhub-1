import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SignUpForm.css'; // reuse same styles

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    countryCode: '+91',
    phone: '',
    address: '',
    userType: 'Patron',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, email, password, phone, address, countryCode, userType } = formData;

    if (!username || !email || !password || !phone || !address) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.loginSignup({
        action: 'signup',
        username,
        email,
        password,
        phone: `${countryCode}${phone}`,
        address,
        role: userType.toLowerCase(),
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'Signup successful. Awaiting approval.',
      });

      // reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        countryCode: '+91',
        phone: '',
        address: '',
        userType: 'Patron',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Signup failed. Please try again.',
      });
    }
  };

  return (
    <div className="login-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Move address field above phone number */}
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className="phone-row">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="country-code-input"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+971">🇦🇪 +971</option>
          </select>
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            className="phone-number-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="Patron">Patron</option>
          <option value="Librarian">Librarian</option>
        </select>

        <button type="submit">Sign Up</button>

        {message.text && (
          <div className={message.type === 'error' ? 'error' : 'success'}>
            {message.text}
          </div>
        )}
      </form>

      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} className="link">
          Login here
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
