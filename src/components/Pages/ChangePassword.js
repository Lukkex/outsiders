import '../Stylesheets/App.css';
import '../Stylesheets/Settings.css';
import SiteContainer from '../../utils/SiteContainer';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { getCurrentUser, updatePassword } from '@aws-amplify/auth';


function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const user = await getCurrentUser();
      await updatePassword({ user, oldPassword: password, newPassword });
      setSuccess(true);
  
      // Reset fields
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
  
      setTimeout(() => {
        navigate('/settings');
      }, 2000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password');
    }
  };

  return (
    <SiteContainer content={
      <div>
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <div className="settings-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="form-control"
                />
              </div>
              <div className="button-group">
                <button type="submit" className="login-button">Change Password</button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>

        {/* Success Popup */}
        {success && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Password Changed!</h2>
              <p>Your password was updated successfully.</p>
              <button onClick={() => setSuccess(false)} className="popup-button">Close</button>
            </div>
          </div>
        )}
      </div>
    } />
  );
}

export default ChangePassword;