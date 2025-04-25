import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';
import { userAPI } from '../../services/api'; // Import the userAPI

const UserForm = ({ userToEdit, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Populate form fields if editing an existing user
  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username || '');
      setEmail(userToEdit.email || '');
      setPhone(userToEdit.phone || '');
      setRole(userToEdit.role || 'client');
    }
  }, [userToEdit]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const newUser = { username, email, password, phone, role };

    // Basic client-side validation
    if (!username || !email || !password) {
      setErrorMessage('Username, Email, and Password are required.');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (userToEdit) {
        // Update user if editing
        response = await userAPI.update(userToEdit.id, newUser); // Use the update API method for PUT request
      } else {
        // Create a new user if adding
        response = await userAPI.create(newUser); // Assuming you have a `create` API method for POST request
      }

      if (response.status === 200 || response.status === 201) {
        if (onSubmit) onSubmit(newUser);

        // Reset form and navigate on success
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('client');
        navigate('/admin-dashboard');
      } else {
        throw new Error('Failed to submit user data');
      }
    } catch (error) {
      console.error('Error submitting user:', error);
      setErrorMessage('An error occurred while submitting the data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-profile">
      <h2>{userToEdit ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!userToEdit}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="patron">Patron</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="update-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : userToEdit ? 'Update User' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
