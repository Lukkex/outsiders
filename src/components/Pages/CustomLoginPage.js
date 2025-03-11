import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Stylesheets/CustomLoginPage.css';
import { signIn } from '@aws-amplify/auth';

const CustomLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn({
        username: email,
        password: password
      });
      console.log('Success!');
      navigate('/');
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className="custom-login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
        </div>
        
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

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CustomLoginPage;