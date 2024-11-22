import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import './Settings.css';

function Settings() {
  const [currentName, setCurrentName] = useState('John Doe'); // Default current name
  const [newName, setNewName] = useState(''); // Editable name field
  const [isNameLocked, setIsNameLocked] = useState(true); // Tracks if the name field is locked

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [deletePassword, setDeletePassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNameChangeUnlock = () => {
    setNewName(currentName);
    setIsNameLocked(false);
  };

  const handleNameSave = () => {
    setCurrentName(newName);
    setIsNameLocked(true);
    showSnackbar('Name updated successfully!', 'success');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      showSnackbar('Passwords do not match!', 'error');
      return;
    }
    showSnackbar('Password updated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (deletePassword !== 'user_password') { // Replace with backend password validation
      showSnackbar('Incorrect password!', 'error');
      return;
    }
    showSnackbar('Account deleted successfully!', 'success');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">

        {/* Name Change Section */}
        <div className="settings-section">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={isNameLocked ? currentName : newName}
            onChange={(e) => setNewName(e.target.value)}
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
