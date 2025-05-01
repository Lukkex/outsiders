/*
* Notes: - NOT LINKED TO BACKEND, USING DUMMY DATA OR NONE AT ALL.
* TODO: - send eventData to DynamoDB
*       - fetch locations, RSVPs, and user info from DynamoDB
*       - events need to auto delete when the date is passed
*       - delete created events functionality
*/
import React, { useState, useEffect } from 'react';
import styles from '../../Stylesheets/Scheduling.module.css';
import { fetchAuthSession } from '@aws-amplify/auth';

const API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/events';
const USER_EVENT_API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/user-events';

const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};

const EventCreation = () => {
    const availableLocation = ['All Locations', 'Folsom', 'San Quentin'];
    const [eventData, setEventData] = useState({ location: '', date: '', time: '' });
    const [events, setEvents] = useState([]);
    const [formatMap, setFormatMap] = useState({});
    const [rsvpData, setRsvpData] = useState({});
    const [userNames, setUserNames] = useState({});
    const [eventToDelete, setEventToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterLocation, setFilterLocation] = useState('All Locations');
    const [searchDate, setSearchDate] = useState('');
    const eventsPerPage = 10;

    const createEvent = async (eventData) => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(eventData) });
            if (!response.ok) throw new Error('Failed to create event');
            const result = await response.json();
            return result;
        } catch (err) {
            console.error('Error creating event:', err);
            throw err;
        }
    };

    const deleteEvent = async (eventID) => {
        console.log("Deleting event ID:", eventID);
        try {
            const headers = { ...(await getAuthHeader()) };
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers,
                body: `{\"eventID\": \"${eventID}\"}`
            });
            if (!response.ok) throw new Error('Failed to delete event');
            console.log("Event deleted successfully");

            console.log("Deleting rsvps for eventID:", eventID);
            const response2 = await fetch(USER_EVENT_API_URL, {
                method: 'DELETE',
                headers,
                body: `{\"eventID\": \"${eventID}\", \"all\": \"true\"}`
            });
            if (!response2.ok && response2.status !== 404) throw new Error('Failed to delete event');
            if (response2.status == 404) { console.log("No RSVPs found, Event has still been deleted.") }
            await fetchEvents();
            setEventToDelete(null); 
        } catch (err) {
            console.error('Error deleting event:', err); 
        }
    };
    
    const fetchRsvpData = async (eventId) => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(`${USER_EVENT_API_URL}?eventId=${encodeURIComponent(eventId)}`, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to fetch RSVP data');
            return await response.json();
        } catch (err) {
            console.error('Error fetching RSVP data:', err);
            return [];
        }
    };

    const fetchEvents = async () => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(API_URL, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to fetch events');
            const eventsFromAPI = await response.json();

            const formatMap = {};
            const now = new Date();
            const futureEvents = eventsFromAPI
                .map(ev => {
                    const [y, m, d] = ev.date.split('-').map(Number);
                    const [hh, mm] = ev.time.split(':').map(Number);
                    const dt = new Date(y, m - 1, d, hh, mm);
                    formatMap[ev.eventID] = `${ev.location}-${ev.date}-${ev.time}`;
                    return { ...ev, when: dt.getTime() };
                })
                .filter(ev => ev.when >= now.getTime())
                .sort((a, b) => a.when - b.when);

            setEvents(futureEvents);
            setFormatMap(formatMap);

            const rsvpResults = await Promise.all(
                futureEvents.map(async (event) => [event.eventID, await fetchRsvpData(event.eventID)])
            );
            const rsvpMap = Object.fromEntries(rsvpResults);
            setRsvpData(rsvpMap);

            const allUserIDs = Array.from(new Set(Object.values(rsvpMap).flat().map(r => r.userID)));
            if (allUserIDs.length > 0) {
                const nameResp = await fetch('https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/get-user-names', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...(await getAuthHeader()) },
                    body: JSON.stringify({ userIDs: allUserIDs })
                });
                if (nameResp.ok) {
                    const userInfos = await nameResp.json();
                    const idToName = {};
                    userInfos.forEach(u => idToName[u.userID] = u.name);
                    setUserNames(idToName);
                }
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'location') {
            let defaultTime = value === 'Folsom' ? '09:30' : value === 'San Quentin' ? '11:45' : '';
            setEventData(prev => ({ ...prev, location: value, time: defaultTime }));
        } else {
            setEventData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEvent(eventData);
            await fetchEvents();
            setEventData({ location: '', date: '', time: '' });
        } catch (err) {
            console.error('Failed to create event:', err);
        }
    };

    const handleAdminRemoveRsvp = async (userID, eventId) => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(USER_EVENT_API_URL, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ userID, eventId })
            });
            if (response.ok) {
                await fetchEvents();
                const updatedRsvps = await fetchRsvpData(eventId);
                setRsvpData(prev => ({ ...prev, [eventId]: updatedRsvps }));
            }
        } catch (err) {
            console.error('Error removing RSVP:', err);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    const filteredEvents = events.filter(event => {
        const matchesLocation = filterLocation === 'All Locations' || event.location === filterLocation;
        const formattedDate = formatDate(event.date).toLowerCase();
        const searchLower = searchDate.trim().toLowerCase();
        const matchesDate = !searchLower || formattedDate.includes(searchLower);
        return matchesLocation && matchesDate;
    });

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

    return (
        <div>
            {/* Admin Event Creation Form */}
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="location">Prison: </label>
                        <select name="location" id="location" value={eventData.location} onChange={handleChange} required>
                            <option value="">Select Location</option>
                            {availableLocation.slice(1).map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date">Date: </label>
                        <input type="date" name="date" id="date" value={eventData.date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="time">Time: </label>
                        <input type="time" name="time" id="time" value={eventData.time} onChange={handleChange} required />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1em' }}>
                        <button className={`${styles.buttonStyled} ${styles.selectedButton}`} type="submit">Create Event</button>
                    </div>
                </form>
            </div>

            {/* Admin Event Table with Filters */}
            <div className={styles.tableContainer}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', marginBottom: '1em', gap: '0.5em' }}>
                    <div>
                        <select
                            value={filterLocation}
                            onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}
                            className="px-2 py-1 border rounded w-full"
                        >
                            {availableLocation.map((loc, idx) => (
                                <option key={idx} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Search by date"
                            value={searchDate}
                            onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }}
                            className="px-2 py-1 border rounded w-full"
                        />
                    </div>
                </div>

                {paginatedEvents.length > 0 ? (
                    <>
                        <table className={styles.scheduleTable} border="1">
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>RSVP Count</th>
                                    <th>RSVP List</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.map((event, idx) => {
                                    const rsvps = rsvpData[event.eventID] || [];
                                    return (
                                        <tr key={idx}>
                                            <td>{event.location}</td>
                                            <td>{formatDate(event.date)}</td>
                                            <td>{event.time}</td>
                                            <td>{rsvps.length}</td>
                                            <td>
                                                <details>
                                                    <summary>View RSVP List ({rsvps.length})</summary>
                                                    <ul className={styles.rsvpList}>
                                                        {rsvps.length ? (
                                                            rsvps.map((r, i) => (
                                                                <li key={i} className={styles.rsvpItem}>
                                                                    {userNames[r.userID] || r.userID}
                                                                    <button style={{ marginLeft: '1em', color: 'red' }} onClick={() => handleAdminRemoveRsvp(r.userID, event.eventID)}>
                                                                        Remove
                                                                    </button>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>No RSVPs</li>
                                                        )}
                                                    </ul>
                                                </details>
                                            </td>
                                            <td>
                                                <button className={styles.cancelButton} onClick={() => setEventToDelete(event.eventID)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="flex justify-center items-center mt-4 gap-2 w-full">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&larr;</button>
                            <span className="px-4 py-1">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="bg-sky-700 text-white px-3 py-1 rounded shadow">&rarr;</button>
                        </div>
                    </>
                ) : <p>No events scheduled yet.</p>}
            </div>

            {eventToDelete && (
                <div className={styles.confirmationModal}>
                    <div className={styles.confirmationContent}>
                        <h3>Are you sure you want to delete this event?</h3>
                        <div className={styles.confirmationButtons}>
                            <button className={styles.confirmButton} onClick={() => setEventToDelete(null)}>Cancel</button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => deleteEvent(eventToDelete)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EventCreation;
