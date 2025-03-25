import React from 'react';
import { signOut } from '@aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function SignOutButton() {
    const navigate = useNavigate();
    const { refreshUserData } = useUser();

    const handleSignOut = async () => {
        try {
            await signOut({ global: true });
            
            refreshUserData();
            
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Link onClick={handleSignOut}>Sign Out</Link>
    );
}

export default SignOutButton;