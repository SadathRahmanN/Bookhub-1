import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';
import { userAPI } from '../../services/api'; // Import the userAPI

const UserForm = ({ userToEdit, onSubmit, isProfileUpdate = false }) => {
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

    // Build the user object to send
    const newUser = {
      username,
      email,
      phone,
      role,
    };

    // Include password only if filled
    if (password) {
      newUser.password = password;
    }

    // Basic client-side validation
    if (!username || !email) {
      setErrorMessage('Username and Email are required.');
      setIsLoading(false);
      return;
    }

    if (!userToEdit && !password) {
      setErrorMessage('Password is required for creating a new user.');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (userToEdit) {
        // Update existing user
        response = await userAPI.update(userToEdit.id, newUser);
      } else {
        // Create a new user
        response = await userAPI.create({ ...newUser, password });
      }

      if (response.status === 200 || response.status === 201) {
        if (onSubmit) onSubmit(newUser);

        // Reset form on success
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('client');

        // Navigate depending on context
        if (isProfileUpdate) {
          navigate('/patron-dashboard'); // If user updates their own profile
        } else {
          navigate('/admin-dashboard'); // If admin adds/edits a user
        }
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
      <h2>{userToEdit ? (isProfileUpdate ? 'Update Profile' : 'Edit User') : 'Add User'}</h2>
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
          <label>{userToEdit ? 'New Password (leave blank to keep current)' : 'Password'}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!userToEdit && !isProfileUpdate}
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

        {/* Show Role selection only if NOT a profile update */}
        {!isProfileUpdate && (
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="client">Client</option>
              <option value="patron">Patron</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button type="submit" className="update-btn" disabled={isLoading}>
          {isLoading
            ? 'Submitting...'
            : userToEdit
            ? isProfileUpdate
              ? 'Update Profile'
              : 'Update User'
            : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
