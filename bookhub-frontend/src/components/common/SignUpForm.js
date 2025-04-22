// src/components/SignUpForm.js

import React, { useState } from 'react';
import './LoginForm.css';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    countryCode: '+91',
    phone: '',
    address: '',
    userType: 'Client',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, phone, address } = formData;

    if (!username || !email || !password || !phone || !address) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup', // Let the backend know it's a signup
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: `${formData.countryCode}${formData.phone}`,
          address: formData.address,
          role: formData.userType.toLowerCase(), // match your backend role naming
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Signup successful. Pending admin approval.',
        });

        // Optionally clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          countryCode: '+91',
          phone: '',
          address: '',
          userType: 'Client',
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' });
    }
  };

  return (
    <div className="login-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="phone-row">
          <select
            className="country-code-input"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+971">🇦🇪 +971</option>
          </select>
          <input
            type="tel"
            className="phone-number-input"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="Client">Client</option>
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
    </div>
  );
};

export default SignUpForm;
