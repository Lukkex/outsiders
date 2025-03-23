import React, { useState, useEffect } from 'react';
import { getCurrentUserInfo, getUserRole } from '../../../services/authConfig';
import SiteContainer from '../../../utils/SiteContainer.js';
import '../../Stylesheets/AccountInfo.css';

function AccountInfo() {
    const [userInfo, setUserInfo] = useState({
        name: "Loading...",
        email: "Loading...",
        role: "Loading...",
        sub: null,
    });

    const [preferredPrisons, setPreferredPrisons] = useState([]);
    const [upcomingDates, setUpcomingDates] = useState(["2023-11-15", "2023-12-01"]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const user = await getCurrentUserInfo();
                const roleGroups = await getUserRole();

                var displayRole = "Unknown";
                if (roleGroups.includes("admin")) {
                    displayRole = "Admin";
                } else if (roleGroups.includes("basic_users")) {
                    displayRole = "User";
                }

                console.log("User Info:", user);
                console.log("User Roles:", roleGroups);

                if (user) {
                    setUserInfo({
                        name: `${user.given_name} ${user.family_name}`,
                        email: user.email,
                        //role: roleGroups.length > 0 ? roleGroups.join(", ") : "Unknown",
                        role: displayRole,
                        sub: user.sub
                    });

                    const savedPrisons = JSON.parse(localStorage.getItem(`userPrisons_${user.sub}`)) || [];
                    setPreferredPrisons(savedPrisons);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserInfo({
                    name: "Error retrieving user",
                    email: "N/A",
                    role: "N/A",
                    sub: null
                });
            }
        }

        fetchUserData();
    }, []);

    const handleSave = () => {
        if (userInfo.sub) {
            localStorage.setItem(`userPrisons_${userInfo.sub}`, JSON.stringify(preferredPrisons));
        }
        setIsEditing(false);
    };

    return (
        <SiteContainer content = {
            <div>
                <div className="profile-container">
                    <h1 className="font-semibold">Account Information</h1>
                    <div className="user-details">
                        <p><strong>Name:</strong> {userInfo.name || "Unknown User"}</p>
                        <p><strong>Email:</strong> {userInfo.email || "Unknown"}</p>
                        <p><strong>Role:</strong> {userInfo.role || "Unknown"}</p>
                        <p><strong>Upcoming Dates:</strong> {upcomingDates.length > 0 ? upcomingDates.join(', ') : "No upcoming dates"}</p>
                        <p><strong>Preferred Prisons:</strong></p>
                        {isEditing ? (
                            <form onSubmit={handleSave} className="edit-form">
                                {["San Quentin", "Folsom Prison"].map(prison => (
                                    <label key={prison} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={preferredPrisons.includes(prison)}
                                            onChange={() => {
                                                setPreferredPrisons(prev => prev.includes(prison)
                                                    ? prev.filter(p => p !== prison)
                                                    : [...prev, prison]);
                                            }}
                                        />
                                        {prison}
                                    </label>
                                ))}
                                <button type="submit" className="rounded-button">Save Preferences</button>
                            </form>
                        ) : (
                            <ul>
                                {preferredPrisons.length > 0 ? (
                                    preferredPrisons.map(prison => <li key={prison}>{prison}</li>)
                                ) : (
                                    <li>No preferred prisons selected</li>
                                )}
                            </ul>
                        )}
                        <button type="button" className="rounded-button" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                </div>
            </div>
        }/>
    );
}

export default AccountInfo;
