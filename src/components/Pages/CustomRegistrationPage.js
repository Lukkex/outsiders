import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Stylesheets/CustomLoginPage.css';
import { signUp } from 'aws-amplify/auth'; 

const CustomRegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Registering user with:', {
        username: email,
        password,
        email,
        givenName,
        familyName
      });

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: givenName,
            family_name: familyName
            // You can add phone_number here if you want
          },
          autoSignIn: true
        }
      });

      console.log('Signup result:', {
        isSignUpComplete,
        userId,
        nextStep
      });

      navigate('/confirm-signup', { state: { username: email } });
    } catch (err) {
      console.error('Error registering:', err);
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="custom-login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Create Account</h2>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="given_name">First Name</label>
            <input
              id="givenName"
              type="text"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="Enter your first name"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="family_name">Last Name</label>
            <input
              id="familyName"
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter your last name"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="form-control"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-button">
              Register
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CustomRegistrationPage;