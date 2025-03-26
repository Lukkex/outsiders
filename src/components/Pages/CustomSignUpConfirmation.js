import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import '../Stylesheets/CustomLoginPage.css';
import { confirmSignUp } from 'aws-amplify/auth';

const CustomSignUpConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Grab the username (email) from state when navigating
  const prefilledUsername = location.state?.username || '';

  const [username, setUsername] = useState(prefilledUsername);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If prefilled username exists, set it
    if (prefilledUsername) {
      setUsername(prefilledUsername);
    }
  }, [prefilledUsername]);

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();

    if (!username) {
      setError('Username is required to confirm sign up');
      return;
    }

    try {
      console.log('Confirming signup for:', username, confirmationCode);

      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });

      console.log('Confirmation result:', { isSignUpComplete, nextStep });

      setSuccess('Account confirmed! You can now log in.');
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error confirming sign up:', error);
      setError(error.message || 'Failed to confirm sign-up');
    }
  };

  return (
    <div className="custom-login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Confirm Your Account</h2>
        </div>

        <form onSubmit={handleConfirmSignUp} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!prefilledUsername && (
            <div className="form-group">
              <label htmlFor="username">Email (Username)</label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-control"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="confirmationCode">Confirmation Code</label>
            <input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter confirmation code"
              required
              className="form-control"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-button">
              Confirm Account
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            Didn’t get a code? <Link to="/resend-code">Resend Code</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomSignUpConfirmation;