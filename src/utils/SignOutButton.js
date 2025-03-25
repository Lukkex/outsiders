import React from 'react';
import { signOut } from '@aws-amplify/auth';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

function SignOutButton() {
    const navigate = useNavigate();
    const { clearUserData } = useUser();

    const handleSignOut = async () => {
        try {
            
            await signOut();
            clearUserData();
            navigate('/login'); // Redirect to login page after sign out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Link onClick={handleSignOut}>Sign Out</Link>
    );
}

export default SignOutButton; // Remove withAuthenticator