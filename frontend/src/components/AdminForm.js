// src/components/AdminForm.js

import React from 'react';
import './LoginForm.css';  // You can reuse LoginForm styles or create new ones if needed

const AdminForm = () => {
  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminForm;
