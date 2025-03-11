import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserInfo, getUserRole } from '../services/authConfig';

//PrivateRoute util is used to ensure that the currently logged-in user 
//has admin permissions before accessing the page.
const PrivateRoute = ({content, redirectPage = "/"}) => {
    //Accessing authentication state using useAuthenticator()
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
          try {
            //Attempts to get the current user - will only work if they're signed in
            const user = await getCurrentUserInfo();
            const groups = await getUserRole();
            
            console.log(user);
            console.log(groups);
            
            //Check to see if user is an admin (in the admin group)
            if (groups && groups.includes("admin")) {
              setIsAdmin(true); //Is an admin
            }

            setIsAuthenticated(true);
            } 
        catch (error) {
            console.error("Error getting user", error);
            setIsAuthenticated(false);
        } 
        finally 
        {
            setLoading(false);
        }
        };
    
        checkUser();
    }, []);
    
    //Shows the page as "Loading" whilst waiting on async function to finish
    if (loading) {
        return <div>Loading...</div>;
    }

    //Redirect to access denied page if not an admin
    if (!isAdmin) {
        return <Navigate to={redirectPage} />;
    }

    //If an admin, render the component's contents
    return content;
};
   
export default PrivateRoute;
   