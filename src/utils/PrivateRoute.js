import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

//PrivateRoute util is used to ensure that the currently logged-in user 
//has admin permissions before accessing the page.
const PrivateRoute = ({content, redirectPage = "/"}) => {
    //Accessing authentication state using useAuthenticator()
    const { user, signOut, isAuthenticated } = useAuthenticator((context) => [context.user, context.signOut, context.isAuthenticated]);
    const [isAdmin, setIsAdmin] = useState(false);
   
    //Check if user is apart of admin group
    useEffect(() => {
        if (isAuthenticated && user) {
            const groups = user?.signInUserSession?.idToken?.payload['cognito:groups'];
            if (groups && groups.includes('admin')) {
            setIsAdmin(true);
            } else {
            setIsAdmin(false);
            }
        }
    }, [isAuthenticated, user]);
   
    //Redirect to access denied page if not signed in
    if (!isAuthenticated) {
       return <Navigate to="/" />;
    }
   
    //Redirect to access denied page if not an admin
    if (!isAdmin) {
        return <Navigate to={redirectPage} />;
    }

    //If an admin, render the component's contents
    return content;
};
   
export default PrivateRoute;
   