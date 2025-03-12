// src/components/Pages/CustomRegistrationPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Stylesheets/CustomLoginPage.css'; // Reusing the same CSS
import { signUp } from '@aws-amplify/auth';


const CustomRegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [given_name, setGivenName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // work pelase
      console.log('Attempting registration with:', {
        email,
        given_name,
        family_name
      });

      //debuggging
      console.log('Password state:', password);

      await signUp({
        username: email,
        password,
        ttributes: {
            email: email,
            given_name: given_name,  
            family_name: family_name, 
          }
      });

      console.log('Registration successful!');
      navigate('/login'); // Redirect to login after successful registration
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
              id="given_name"
              name="given_name"
              type="text"
              autoComplete="given-name"
              value={given_name}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="Enter your first name"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="family_name">Last Name</label>
            <input
              id="family_name"
              name="family_name"
              type="text"
              autoComplete="family-name"
              value={family_name}
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
              name="email"
              type="email"
              autoComplete="email"
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
              name="password"
              type="password"
              autoComplete="new-password"
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
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
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