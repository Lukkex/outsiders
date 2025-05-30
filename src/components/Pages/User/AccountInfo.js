import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ⬅️ NEW IMPORT
import { getCurrentUserInfo, getUserRole } from '../../../services/authConfig';
import SiteContainer from '../../../utils/SiteContainer.js';
import '../../Stylesheets/AccountInfo.css';
import { fetchMFAPreference } from 'aws-amplify/auth'; // Correct import

function AccountInfo() {
    const navigate = useNavigate(); 
    const [mfaStatus, setMfaStatus] = useState('Loading...'); // Add this state variable

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

    useEffect(() => {
        const fetchMfaStatus = async () => {
            try {
                const output = await fetchMFAPreference();
                console.log(`Enabled MFA types for the user: ${output.enabled}`);
                console.log(`Preferred MFA type for the user: ${output.preferred}`);
                
                // Check if TOTP is enabled and/or preferred
                const isTOTPEnabled = output.enabled.includes('TOTP');
                setMfaStatus(isTOTPEnabled ? 'Enabled' : 'Disabled');
            } catch (error) {
                console.error('Error fetching MFA status:', error);
                setMfaStatus('Not enabled');
            }
        };

        fetchMfaStatus();
    }, []);

    const handleSave = () => {
        if (userInfo.sub) {
            localStorage.setItem(`userPrisons_${userInfo.sub}`, JSON.stringify(preferredPrisons));
        }
        setIsEditing(false);
    };

    const handleNavigateToMFASetup = () => {
        navigate('/setup-mfa');
    };

    return (
        <SiteContainer content = {
            <div>
                <div className="profile-container">
                    <h1 className="font-semibold">Account Information</h1>
                    <div className="user-details">
                        <p><strong>Name:</strong> {userInfo.name || "Unknown User"}</p><br/>
                        <p><strong>Email:</strong> {userInfo.email || "Unknown"}</p><br/>
                        <p><strong>Role:</strong> {userInfo.role || "Unknown"}</p><br/>
                        <p><strong>MFA Status:</strong> {mfaStatus}</p>
                    <br/>
                    <br/>
                    <p>
                        {mfaStatus === 'Enabled' ? (
                            <span>(Manage your MFA settings <Link to="/setup-mfa" className="mfa-link">here)</Link></span>
                        ) : (
                            <span>Enable multi-factor authentication <Link to="/setup-mfa" className="mfa-link">here</Link> to improve your account security</span>
                        )}
                    </p>

                    </div>
                </div>
            </div>
        }/>
    );
}

export default AccountInfo;