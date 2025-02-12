import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';

function SignOutButton() {
    return(
        <Link onClick={() => signOut()}>Sign Out</Link>
    );
}


export default withAuthenticator(SignOutButton);