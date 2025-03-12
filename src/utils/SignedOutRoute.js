import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserInfo, getUserRole } from '../services/authConfig';

//SignedOutRoute util is used to ensure that the user is logged in
const SignedOutRoute = ({content}) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
          try {
            //Attempts to get the current user - will only work if they're signed in
            const user = await getCurrentUserInfo();
            if (user !== null)
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
        return <div>
                <div class="text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>;
    }

    //Redirect to access denied page if not an admin
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    //If an admin, render the component's contents
    return content;
};
   
export default SignedOutRoute;
   