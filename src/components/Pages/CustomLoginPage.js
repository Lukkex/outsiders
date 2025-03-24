import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, confirmSignIn } from '@aws-amplify/auth';
import '../Stylesheets/CustomLoginPage.css';
import { signIn } from '@aws-amplify/auth';
import { useUser } from '../../context/UserContext';

const CustomLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [nextStep, setNextStep] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { refreshUserData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const output = await signIn({
        username: email,
        password: password
      });

      console.log('Sign-in output:', output);

      const step = output.nextStep?.signInStep;

      if (!step || step === 'DONE') {
        console.log('Login successful!');
        navigate('/');
      } else {
        console.log('Next step:', step);
        setUser(output);
        setNextStep(step);
      }

    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message || 'Failed to sign in');
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

  return (
    <div className="custom-login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
        </div>

        {!nextStep && (
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
          </form>
        )}

        {(nextStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' || nextStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') && (
          <div className="mfa-form">
            <h3>Enter your MFA Code</h3>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="mfaCode">MFA Code</label>
              <input
                id="mfaCode"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter MFA code"
                required
                className="form-control"
              />
            </div>

            <div className="button-group">
              <button onClick={handleConfirmSignIn} className="login-button">
                Confirm MFA
              </button>
            </div>
          </div>
        )}

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CustomLoginPage;