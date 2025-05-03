import '../../Stylesheets/App.css';
import styles from '../../Stylesheets/Scheduling.module.css';
import { useState, useEffect } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { list } from 'aws-amplify/storage';
import { getCurrentUserInfo } from '../../../services/authConfig';

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
    const availableLocation = ['All Locations', 'Folsom', 'San Quentin'];
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(new Set());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userEvents, setUserEvents] = useState(new Set());
    const [filterLocation, setFilterLocation] = useState('All Locations');
    const [searchDate, setSearchDate] = useState('');

    const [rsvpPage, setRsvpPage] = useState(1);
    const [availablePage, setAvailablePage] = useState(1);
    const eventsPerPage = 10;

    //const [hasFolsomForms, setHasFolsomForms] = useState(Array(4).fill(false));
    //const [hasSanQuentinForms, setHasSanQuentinForms] = useState(Array(3).fill(false));

    const checkAllTrue = (arr) => arr.every(element => element === true);

    /*
    const updateFolsomForms = (index, value) => {
        setHasFolsomForms(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
    };

    const updateSanQuentinForms = (index, value) => {
        setHasSanQuentinForms(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
    };
    */

    const fetchEvents = async () => {
        try {
            console.log("------------------------------");
            const headers = await getAuthHeader();
            const response = await fetch(API_URL, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            console.log(data);
            
            const currentUser = await getCurrentUserInfo();
            const userFiles = await list({
                path: `uploads/${currentUser.email}`
            });
            console.log(userFiles);

            let shownData = data;
            if (userFiles.items.length !== 0) {
                const hasFolsomForms = Array(4).fill(false);
                const hasSanQuentinForms= Array(3).fill(false);

                for (let i=userFiles.items.length - 1; i >= 0; i--) {
                    if (true) {
                        if (userFiles.items[i].path.indexOf("CDCR_2301_A") > -1){
                            hasFolsomForms[0] = true;
                            hasSanQuentinForms[0] = true;
                        }
                        else if (userFiles.items[i].path.indexOf("CDCR_2301_B") > -1){
                            hasFolsomForms[1] = true;
                        }
                        else if (userFiles.items[i].path.indexOf("CDCR_2311") > -1){
                            hasFolsomForms[2] = true;
                            hasSanQuentinForms[1] = true;
                        }
                        else if (userFiles.items[i].path.indexOf("CDCR_PREA") > -1){
                            hasFolsomForms[3] = true;
                        }
                        else if (userFiles.items[i].path.indexOf("CDCR_181") > -1){
                            hasSanQuentinForms[2] = true;
                        }
                    }
                }

                if (!checkAllTrue(hasFolsomForms)) {
                    shownData = shownData.filter(item => item.location !== "Folsom");
                }

                if (!checkAllTrue(hasSanQuentinForms)) {
                    shownData = shownData.filter(item => item.location !== "San Quentin");
                }
                
            } else {
                shownData = [];
            }
            
            console.log(shownData);

            setEvents(shownData);
            setLoading(false);
        } catch (error) {
            setError('Failed to load events. Please try again later.');
            setLoading(false);
        }
    };

    const fetchUserEvents = async () => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            if (!userID) return;
            const headers = await getAuthHeader();
            const response = await fetch(`${USER_EVENT_API_URL}?userID=${userID}`, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to fetch user events');
            const data = await response.json();
            const eventSet = new Set(Array.isArray(data) ? data.map(d => d.eventId) : []);
            setUserEvents(eventSet);
        } catch {
            setUserEvents(new Set());
        }
    };

    useEffect(() => {
        const callFetch = async () => {
            await fetchEvents();
            await fetchUserEvents();
        }
        callFetch();
    }, []);

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    const handleEventSelection = (eventId) => {
        setSelectedEvents(prev => {
            const next = new Set(prev);
            next.has(eventId) ? next.delete(eventId) : next.add(eventId);
            return next;
        });
    };

    const handleConfirmRSVP = async () => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            const headers = await getAuthHeader();

            await Promise.all(Array.from(selectedEvents).map(eventId =>
                fetch(USER_EVENT_API_URL, {
                    method: userEvents.has(eventId) ? 'DELETE' : 'POST',
                    headers,
                    body: JSON.stringify({ userID, eventId })
                })
            ));

            await fetchUserEvents();
            await fetchEvents();
            setSelectedEvents(new Set());
            setError(null);
        } catch {
            setError('Failed to confirm RSVPs. Please try again.');
        }
    };

    const handleConfirmSelection = () => {
        //if (selectedEvents.size === 0) { setError('Please select at least one event to RSVP'); return; }
        console.log("confirmation");
        setShowConfirmation(true);
    };

    const handleUnenroll = async (eventId) => {
        try {
            const session = await fetchAuthSession();
            const userID = session.tokens?.idToken?.payload?.sub;
            const headers = await getAuthHeader();
            await fetch(USER_EVENT_API_URL, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ userID, eventId })
            });
            setShowConfirmation(false);
            await fetchUserEvents();
            await fetchEvents();
        } catch {
            setError('Failed to unenroll from event.');
        }
    };

    const now = new Date();
    events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    const upcomingEvents = events.filter(event => {
        if (!event.date || !event.time) return false;
        return new Date(`${event.date}T${event.time}`) >= now;
    });

    const filteredEvents = upcomingEvents.filter(event => {
        const matchesLoc = filterLocation === 'All Locations' || event.location === filterLocation;
        const matchesDate = !searchDate || formatDate(event.date).toLowerCase().includes(searchDate.toLowerCase());
        return matchesLoc && matchesDate;
    });

    const rsvpEvents = filteredEvents.filter(e => userEvents.has(e.eventID));
    const availableEvents = filteredEvents.filter(e => !userEvents.has(e.eventID));

    const paginated = (arr, page) => arr.slice((page - 1) * eventsPerPage, page * eventsPerPage);
    const totalRsvpPages = Math.ceil(rsvpEvents.length / eventsPerPage);
    const totalAvailablePages = Math.ceil(availableEvents.length / eventsPerPage);

    return (
        <div>
            {/* RSVP'D */}
            <div className={styles.tableContainer}>
                <div style={{ marginBottom: '1em', textAlign: 'center' }}>
                    <h2 className={styles.scheduleTableHeader}>Your Events</h2>
                </div>
                <table className={styles.scheduleTable}>
                    <thead><tr><th>Location</th><th>Date</th><th>Time</th><th>Action</th></tr></thead>
                    <tbody>
                        {paginated(rsvpEvents, rsvpPage).map(event => (
                            <tr key={event.eventID} className={styles.rsvpRow}>
                                <td>{event.location}</td>
                                <td>{formatDate(event.date)}</td>
                                <td>{event.time}</td>
                                <td><button onClick={handleConfirmSelection} className={styles.unenrollButton}>Cancel RSVP</button></td>
                            </tr>
                        ))}
                        {rsvpEvents.length === 0 && !loading && (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>You haven't RSVP'd to any events yet.</td></tr>
                        )}
                        {loading && (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        )}
                    </tbody>
                </table>
                {totalRsvpPages > 1 && (
                    <div className="flex justify-center items-center mt-4 gap-2 w-full">
                        <button onClick={() => setRsvpPage(p => Math.max(p - 1, 1))} disabled={rsvpPage === 1} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&larr;</button>
                        <span className="px-4 py-1">Page {rsvpPage} of {totalRsvpPages}</span>
                        <button onClick={() => setRsvpPage(p => Math.min(p + 1, totalRsvpPages))} disabled={rsvpPage === totalRsvpPages} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&rarr;</button>
                    </div>
                )}
            </div>

            {/* AVAILABLE */}
            <div className={styles.tableContainer} style={{ marginTop: '2rem' }}>
                <div style={{ marginBottom: '1em', textAlign: 'center' }}>
                    <h2 className={styles.scheduleTableHeader}>Available Events</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1em', marginBottom: '0.5em' }}>
                    <div></div>
                    <div style={{ textAlign: 'left' }}>
                        <select
                            value={filterLocation}
                            onChange={(e) => { setFilterLocation(e.target.value); setAvailablePage(1); }}
                            className="px-2 py-1 border rounded w-full"
                        >
                            {availableLocation.map((loc, idx) => (
                                <option key={idx} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <input
                            type="text"
                            placeholder="Search by date"
                            value={searchDate}
                            onChange={(e) => { setSearchDate(e.target.value); setAvailablePage(1); }}
                            className="px-2 py-1 border rounded w-full"
                        />
                    </div>
                    <div></div>
                </div>
                <table className={styles.scheduleTable}>
                    <thead><tr><th>Location</th><th>Date</th><th>Time</th><th>Action</th></tr></thead>
                    <tbody>
                        {paginated(availableEvents, availablePage).map(event => {
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
                        {availableEvents.length === 0 && !loading && (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>There are no current events that you are eligible for.</td></tr>
                        )}
                        {loading && (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        )}
                    </tbody>
                </table>
                {totalAvailablePages > 1 && (
                    <div className="flex justify-center items-center mt-4 gap-2 w-full">
                        <button onClick={() => setAvailablePage(p => Math.max(p - 1, 1))} disabled={availablePage === 1} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&larr;</button>
                        <span className="px-4 py-1">Page {availablePage} of {totalAvailablePages}</span>
                        <button onClick={() => setAvailablePage(p => Math.min(p + 1, totalAvailablePages))} disabled={availablePage === totalAvailablePages} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&rarr;</button>
                    </div>
                )}

                {selectedEvents.size > 0 && (
                    <div className={styles.rsvpActions}>
                        <button onClick={handleConfirmRSVP} className={styles.confirmButton}>Confirm RSVPs ({selectedEvents.size})</button>
                    </div>
                )}
                {showConfirmation && (
                        rsvpEvents.map((event) => (
                            <div className={styles.confirmationModal}>
                                <div className={styles.confirmationContent}>
                                    <h3>Are you sure?</h3>
                                    <p>You are about to cancel this reservation.</p>
                                    <div className={styles.confirmationButtons}>
                                        <button 
                                            onClick={() => handleUnenroll(event.eventID)} 
                                            className={styles.cancelButton}
                                        >
                                            Cancel Reservation
                                        </button>
                                        <button 
                                            onClick={() => setShowConfirmation(false)}
                                            className={styles.confirmButton}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
            </div>
        </div>
    );
}

export default Scheduling;
