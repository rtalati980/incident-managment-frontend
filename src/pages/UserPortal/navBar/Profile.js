import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
//import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfile(data[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePasswordChangeClick = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${profile.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id; // Adjust based on your token structure
      fetchProfile(userId);
    }
  }, []);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
      {isEditing ? (
        <div className="password-change-container">
          <h2>Change Password</h2>
          <form className="password-change-form">
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <br />
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <br />
            <button type="button" onClick={handlePasswordChangeClick}>Change Password</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)}>Change Password</button>
      )}
    </div>
  );
}
