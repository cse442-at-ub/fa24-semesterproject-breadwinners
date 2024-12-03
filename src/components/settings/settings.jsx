import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const navigate = useNavigate(); 
  const [currentFirstName, setCurrentFirstName] = useState('');
  const [currentLastName, setCurrentLastName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [isNameLocked, setIsNameLocked] = useState(true); // Track if name fields are locked

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [deletePassword, setDeletePassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchCurrentName();
  }, []);

  const fetchCurrentName = async () => {
    const response = await fetch('./backend/settings_backend.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'fetch_name' }),
    });
    const data = await response.json();
    if (data.success) {
      setCurrentFirstName(data.first_name);
      setCurrentLastName(data.last_name);
    } else {
      alert(data.message);
      showSnackbar(data.message, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNameChangeUnlock = () => {
    setNewFirstName(currentFirstName);
    setNewLastName(currentLastName);
    setIsNameLocked(false);
  };

  const handleNameSave = async () => {
    const response = await fetch('./backend/settings_backend.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'update_name', newFirstName, newLastName }),
    });
    const data = await response.json();
    if (data.success) {
      setCurrentFirstName(newFirstName);
      setCurrentLastName(newLastName);
      setIsNameLocked(true);
      showSnackbar('Name updated successfully!', 'success');
    } else {
      showSnackbar(data.message, 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showSnackbar('Passwords do not match!', 'error');
      return;
    }

    const response = await fetch('./backend/settings_backend.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'update_password', currentPassword, newPassword }),
    });
    const data = await response.json();
    if (data.success) {
      showSnackbar('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showSnackbar(data.message, 'error');
    }
  };


  const handleDeleteAccount = () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    fetch('./backend/delete_account.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        password: deletePassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          showSnackbar(data.message, 'success');
          setTimeout(() => {
            navigate('/login'); // Navigate to login page on success
          }, 2000);
        } else {
          showSnackbar(data.message, 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showSnackbar('Failed to delete account. Please try again later.', 'error');
      });
  };
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        {/* Name Change Section */}
        <div className="settings-section">
          <label htmlFor="first-name">First Name:</label>
          <input
            type="text"
            id="first-name"
            value={isNameLocked ? currentFirstName : newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            disabled={isNameLocked}
            className={`settings-input ${isNameLocked ? 'locked' : ''}`}
          />
          <br />
          <label htmlFor="last-name">Last Name:</label>
          <input
            type="text"
            id="last-name"
            value={isNameLocked ? currentLastName : newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            disabled={isNameLocked}
            className={`settings-input ${isNameLocked ? 'locked' : ''}`}
          />
          {isNameLocked ? (
            <button onClick={handleNameChangeUnlock} className="settings-button">Change</button>
          ) : (
            <>
              <button onClick={handleNameSave} className="settings-button save">Save</button>
              <button onClick={() => setIsNameLocked(true)} className="settings-button cancel">Cancel</button>
            </>
          )}
        </div>

        {/* Password Change Section */}
        <div className="settings-section">
          <h1>Change Password</h1>
          <label htmlFor="current-password">Current Password:</label>
          <input
            type="password"
            id="current-password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="settings-input"
          />
          <br />
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="settings-input"
          />
          <br />
          <label htmlFor="confirm-password">Confirm New Password:</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="settings-input"
          />

          <button onClick={handlePasswordChange} className="settings-button save">Change Password</button>
        </div>

        {/* Delete Account Section */}
        <div className="settings-section delete-account">
          <h3>Delete Account</h3>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <label htmlFor="delete-password">Enter Password:</label>
          <input
            type="password"
            id="delete-password"
            placeholder="Enter your password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="settings-input"
          />
          <button onClick={handleDeleteAccount} className="settings-button delete">Delete Account</button>
        </div>
      </div>

      {/* Snackbar for Success and Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Settings;
