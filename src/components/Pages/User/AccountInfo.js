import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SiteHeader from '../../../utils/SiteHeader';
import '../../Stylesheets/AccountInfo.css' // Import the new CSS file

function AccountInfo() {
    const navigate = useNavigate();
    const [selectedPrisons, setSelectedPrisons] = useState([]);
    const [availablePrisons, setAvailablePrisons] = useState([]);
    const [notification, setNotification] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [upcomingDates, setUpcomingDates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Load initial data 
    useEffect(() => {
        // Mock data for now
        const mockPrisons = ['Folsom Prison', 'San Quentin'];
        const savedPrisons = JSON.parse(localStorage.getItem('userPrisons')) || [];
        const mockUserName = 'John Doe';
        const mockUserEmail = 'john.doe@example.com';
        const mockUpcomingDates = ['2023-11-15', '2023-12-01'];

        setAvailablePrisons(mockPrisons);
        setSelectedPrisons(savedPrisons);
        setUserName(mockUserName);
        setUserEmail(mockUserEmail);
        setUpcomingDates(mockUpcomingDates);
    }, []);

    const handlePrisonSelect = (prison) => {
        setSelectedPrisons(prev => {
            const newSelection = prev.includes(prison)
                ? prev.filter(p => p !== prison)
                : [...prev, prison];
            return newSelection;
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('userPrisons', JSON.stringify(selectedPrisons));
        setNotification('Prison preferences updated successfully!');
        setTimeout(() => setNotification(''), 3000);
        setIsEditing(false);
    };

    return (
        <div>
            <SiteHeader />
            <div className="profile-container">
                <h1 className="font-semibold">Account Information</h1>
                <div className="user-details">
                    <p><strong>Name:</strong> {userName}</p>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <p><strong>Upcoming Dates:</strong> {upcomingDates.join(', ')}</p>
                    <p><strong>Preferred Prisons:</strong></p>
                    {isEditing ? (
                        <form onSubmit={handleSave} className="edit-form">
                            {availablePrisons.map(prison => (
                                <label key={prison} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedPrisons.includes(prison)}
                                        onChange={() => handlePrisonSelect(prison)}
                                    />
                                    {prison}
                                </label>
                            ))}
                            <button type="submit" className="rounded-button">
                                Save Preferences
                            </button>
                        </form>
                    ) : (
                        <ul>
                            {selectedPrisons.map(prison => (
                                <li key={prison}>{prison}</li>
                            ))}
                        </ul>
                    )}
                    <button 
                        type="button" 
                        className="rounded-button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>
                {notification && (
                    <div className="notification-message">
                        {notification}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountInfo; 