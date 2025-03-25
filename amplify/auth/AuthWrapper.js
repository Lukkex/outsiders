import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { Navigate } from 'react-router-dom';

const AuthWrapper = ({ element }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? element : <Navigate to="/signin" replace />;
};

export default AuthWrapper;