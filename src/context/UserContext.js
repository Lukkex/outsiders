import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUserInfo, getUserRole } from '../services/authConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize state from localStorage synchronously
    const storedUser = localStorage.getItem('userInfo');
    const initialUserInfo = storedUser ? JSON.parse(storedUser) : null;
    const [userInfo, setUserInfo] = useState(initialUserInfo);
    const [loading, setLoading] = useState(initialUserInfo ? false : true);

    const refreshUserData = async () => {
        setLoading(true);
        try {
            const user = await getCurrentUserInfo();
            const roleGroups = await getUserRole();
            if (user) {
                const userData = {
                    name: `${user.given_name} ${user.family_name}`,
                    email: user.email,
                    role: roleGroups.length > 0 ? roleGroups.join(", ") : "Unknown",
                    sub: user.sub
                };
                setUserInfo(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData));
                localStorage.setItem('userRole', JSON.stringify(roleGroups));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserInfo({
                name: "Error retrieving user",
                email: "N/A",
                role: "N/A",
                sub: null
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if no user data in state
        if (!userInfo) {
            refreshUserData();
        }
    }, []); // runs on mount

    // Clears user state from local storage
    const clearUserData = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userRole');
    };

    return (
        <UserContext.Provider value={{ userInfo, loading, clearUserData, refreshUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
