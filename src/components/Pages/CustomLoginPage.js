import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, confirmSignIn, signOut, resetPassword, confirmResetPassword } from '@aws-amplify/auth';
import '../Stylesheets/CustomLoginPage.css';
import { useUser } from '../../context/UserContext';

const CustomLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [nextStep, setNextStep] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState('REQUEST_CODE'); // REQUEST_CODE, CONFIRM_RESET
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { refreshUserData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // First try to sign out any existing session
      try {
        await signOut({ global: true });
      } catch (signOutError) {
        console.log('No existing session to sign out');
      }

      const output = await signIn({
        username: email,
        password: password
      });

      console.log('Sign-in output:', output);

      const step = output.nextStep?.signInStep;

      if (!step || step === 'DONE') {
        console.log('Login successful!');
        await refreshUserData(); // Refresh user data after successful login
        navigate('/');
      } else {
        console.log('Next step:', step);
        setUser(output);
        setNextStep(step);
      }

    } catch (err) {
      console.error('Error signing in:', err);
      if (err.name === 'UserAlreadyAuthenticatedException') {
        // If we get here, try to sign out and ask user to try again
        try {
          await signOut({ global: true });
          setError('Previous session detected. Please try logging in again.');
        } catch (signOutError) {
          setError('Error handling authentication. Please refresh the page and try again.');
        }
      } else {
        setError(err.message || 'Failed to sign in');
      }
    }
  };

  const handleConfirmSignIn = async () => {
    setError('');
    try {
      const output = await confirmSignIn({
        challengeResponse: mfaCode,
        signInSession: user.signInSession
      });

      const step = output.nextStep?.signInStep;

      if (!step || step === 'DONE') {
        console.log('MFA complete!');
        await refreshUserData();
        navigate('/');
      } else {
        console.log('Next step after MFA:', step);
        setUser(output);
        setNextStep(step);
      }
    } catch (err) {
      console.error('Error confirming MFA:', err);
      setError(err.message || 'Failed to confirm MFA');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const output = await resetPassword({ username: resetEmail });
      const { nextStep } = output;
      
      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setResetStep('CONFIRM_RESET');
        setSuccess(`Confirmation code sent to your email`);
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(err.message || 'Failed to request password reset');
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await confirmResetPassword({
        username: resetEmail,
        confirmationCode: resetCode,
        newPassword: newPassword
      });
      
      setSuccess('Password reset successful! You can now login with your new password.');
      // Reset form and state
      setIsResetPassword(false);
      setResetStep('REQUEST_CODE');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Error confirming password reset:', err);
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="custom-login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>{isResetPassword ? 'Reset Password' : 'Welcome Back!'}</h2>
        </div>

        {!isResetPassword ? (
          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-control"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="login-button">
                Sign In
              </button>
            </div>

            <div className="forgot-password">
              <button 
                type="button"
                onClick={() => setIsResetPassword(true)}
                className="text-button"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <div className="reset-password-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {resetStep === 'REQUEST_CODE' ? (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="resetEmail">Email Address</label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="form-control"
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="login-button">
                    Send Reset Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="login-button secondary"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset}>
                <div className="form-group">
                  <label htmlFor="resetCode">Confirmation Code</label>
                  <input
                    id="resetCode"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter code from email"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
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
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
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
                  <button type="submit" className="login-button">
                    Reset Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetStep('REQUEST_CODE')}
                    className="login-button secondary"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {(nextStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' || nextStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') && (
          <div className="mfa-form">
            <h3 className="mfa-header">Enter your MFA Code</h3>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="mfaCode" className="mfa-label">Please enter the verification code from your authenticator app</label>
              <input
                id="mfaCode"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter here"
                required
                className="form-control"
              />
            </div>

            <div className="button-group">
              <button onClick={handleConfirmSignIn} className="login-button">
                Verify Code
              </button>
            </div>
          </div>
        )}

        {!isResetPassword && (
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomLoginPage;