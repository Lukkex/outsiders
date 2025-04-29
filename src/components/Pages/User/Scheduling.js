import '../../Stylesheets/App.css'; //global styles
import styles from '../../Stylesheets/Scheduling.module.css';
import { useState, useEffect } from 'react';
import SiteContainer from '../../../utils/SiteContainer.js';
import { fetchAuthSession } from '@aws-amplify/auth';

const API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/events';
const USER_EVENT_API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/user-events';

const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
    };
};

function Scheduling() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(new Set());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userEvents, setUserEvents] = useState(new Set());

    const fetchEvents = async () => {
        try {
            const headers = await getAuthHeader();
            const response = await fetch(API_URL, {
                method: 'GET',
                headers
            });

            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please try again later.');
            setLoading(false);
        }
    };

    const fetchUserEvents = async () => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            if (!userID) {
                console.error('No userID found in session');
                return;
            }

            const headers = await getAuthHeader();
            const response = await fetch(`${USER_EVENT_API_URL}?userID=${userID}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                console.error('User events response not OK:', response.status);
                throw new Error('Failed to fetch user events');
            }
            const data = await response.json();
            console.log('User events API response:', data);

            // Handle empty object response
            if (!data || typeof data !== 'object') {
                console.log('No user events found or invalid response');
                setUserEvents(new Set());
                return;
            }

            // If data is an array, process it
            if (Array.isArray(data)) {
                const userEventSet = new Set(data.map(ue => ue.eventId));
                console.log('Processed user events:', Array.from(userEventSet));
                setUserEvents(userEventSet);
            } else {
                // If data is an object but not an array, it might be empty or have a different structure
                console.log('No user events found');
                setUserEvents(new Set());
            }
        } catch (error) {
            console.error('Error fetching user events:', error);
            setUserEvents(new Set());
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchUserEvents();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const month = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"][date.getMonth()];
        
        return `${month} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const handleEventSelection = (eventId) => {
        setSelectedEvents(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(eventId)) {
                newSelection.delete(eventId);
            } else {
                newSelection.add(eventId);
            }
            return newSelection;
        });
    };

    const handleConfirmSelection = () => {
        if (selectedEvents.size === 0) {
            setError('Please select at least one event to RSVP');
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmRSVP = async () => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            if (!userID) {
                throw new Error('User not authenticated');
            }

            const headers = await getAuthHeader();

            // Handle RSVPs and un-RSVPs
            const promises = Array.from(selectedEvents).map(async (eventId) => {
                const isRSVPing = !userEvents.has(eventId);
                const method = isRSVPing ? 'POST' : 'DELETE';
                
                const response = await fetch(USER_EVENT_API_URL, {
                    method,
                    headers,
                    body: JSON.stringify({
                        userID: userID,
                        eventId: eventId
                    })
                });

                if (!response.ok) {
                    console.error(`RSVP ${method} failed:`, response.status);
                    throw new Error(`Failed to ${isRSVPing ? 'RSVP' : 'un-RSVP'} for event`);
                }
            });

            await Promise.all(promises);
            
            // Refresh user events
            await fetchUserEvents();
            
            // Clear selection and close modal
            setSelectedEvents(new Set());
            setShowConfirmation(false);
            setError(null);
        } catch (err) {
            console.error('Error confirming RSVPs:', err);
            setError('Failed to confirm RSVPs. Please try again.');
        }
    };

    const handleUnenroll = async (eventId) => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            if (!userID) {
                throw new Error('User not authenticated');
            }

            const headers = await getAuthHeader();
            
            const response = await fetch(USER_EVENT_API_URL, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({
                    userID: userID,
                    eventId: eventId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to unenroll from event');
            }

            // Refresh user events
            await fetchUserEvents();
        } catch (err) {
            console.error('Error unenrolling from event:', err);
            setError('Failed to unenroll from event. Please try again.');
        }
    };

    const renderEvents = () => {
        if (loading) {
            return <div className={styles.loading}>Loading events...</div>;
        }

        if (error) {
            return <div className={styles.error}>{error}</div>;
        }

        if (events.length === 0) {
            return <div className={styles.noEvents}>No upcoming events available.</div>;
        }

        // Filter out past events
        const now = new Date();
        const upcomingEvents = events.filter(event => {
            if (!event.date || !event.time) return false;
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            return eventDateTime >= now;
        });

        // Split events into RSVP'd and not RSVP'd
        const rsvpEvents = upcomingEvents.filter(event => {
            const eventId = event.eventID;
            return userEvents.has(eventId);
        });

        const availableEvents = upcomingEvents.filter(event => {
            const eventId = event.eventID;
            return !userEvents.has(eventId);
        });

        return (
            <div>
                <br></br>
                {/* RSVP'd Events Section */}
                <div className={styles.tableContainer}>
                    <table className={styles.scheduleTable}>
                        <caption className={styles.scheduleTableHeader}>Your Events</caption>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rsvpEvents.length > 0 ? (
                                rsvpEvents.map((event) => (
                                    <tr key={event.eventID} className={styles.rsvpRow}>
                                        <td>{event.location}</td>
                                        <td>{formatDate(event.date)}</td>
                                        <td>{event.time}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleUnenroll(event.eventID)}
                                                className={styles.unenrollButton}
                                            >
                                                Cancel RSVP
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>
                                        You haven't RSVP'd to any events yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Available Events Section */}
                <div className={styles.tableContainer} style={{ marginTop: '2rem' }}>
                    <table className={styles.scheduleTable}>
                        <caption className={styles.scheduleTableHeader}>Available Events</caption>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableEvents.map((event) => {
                                const isSelected = selectedEvents.has(event.eventID);
                                return (
                                    <tr key={event.eventID}>
                                        <td>{event.location}</td>
                                        <td>{formatDate(event.date)}</td>
                                        <td>{event.time}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleEventSelection(event.eventID)}
                                                className={`${styles.rsvpButton} ${isSelected ? styles.selectedButton : ''}`}
                                            >
                                                {isSelected ? 'Selected' : 'RSVP'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {selectedEvents.size > 0 && (
                        <div className={styles.rsvpActions}>
                            <button 
                                onClick={handleConfirmSelection}
                                className={styles.confirmButton}
                            >
                                Confirm RSVPs ({selectedEvents.size})
                            </button>
                        </div>
                    )}
                    {showConfirmation && (
                        <div className={styles.confirmationModal}>
                            <div className={styles.confirmationContent}>
                                <h3>Confirm RSVPs</h3>
                                <p>You are about to RSVP for {selectedEvents.size} event(s).</p>
                                <div className={styles.confirmationButtons}>
                                    <button 
                                        onClick={handleConfirmRSVP}
                                        className={styles.confirmButton}
                                    >
                                        Confirm
                                    </button>
                                    <button 
                                        onClick={() => setShowConfirmation(false)}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <br></br>
            </div>
        );
    };

    return (
        <SiteContainer content={
            <div>
                {renderEvents()}
            </div>
        }/>
    );
}

export default Scheduling;