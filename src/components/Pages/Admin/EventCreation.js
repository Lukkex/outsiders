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

const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};

const EventCreation = () => {
    const availableLocation = ["Folsom", "San Quentin"];
    const [eventData, setEventData] = useState({ location: '', date: '', time: '' });
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [modal, setModal] = useState({ open: false, event: null });

    const createEvent = async (eventData) => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(eventData) });
            if (!response.ok) throw new Error('Failed to create event');
            return await response.json();
        } catch (err) {
            console.error('Error creating event:', err);
            throw err;
        }
    };

    const fetchEvents = async () => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(API_URL, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
            const response = await fetch(`${API_URL}/${eventId}`, { method: 'DELETE', headers });
            if (!response.ok) throw new Error('Failed to delete event');
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "location") {
            const defaultTime = value === "Folsom" ? "09:30" : value === "San Quentin" ? "11:45" : "";
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
            setEventData({ location: "", date: "", time: "" });
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    };

    const openDeleteModal = (event) => {
        setModal({ open: true, event });
    };

    const closeModal = () => {
        setModal({ open: false, event: null });
    };

    const confirmDelete = async () => {
        if (modal.event) {
            closeModal();
            await deleteEvent(modal.event.id);
            await fetchEvents();
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const sortedEvents = [...events].sort((a, b) => {
        if (!sortBy) return 0;
        if (sortBy === "date") return sortOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        if (sortBy === "location") return sortOrder === "asc"
            ? a.location.localeCompare(b.location)
            : b.location.localeCompare(a.location);
        return 0;
    });

    const dayCutoff = new Date();
    const timeCutoff = new Date(dayCutoff.getTime() - 2 * 60 * 60 * 1000);
    const filteredEvents = sortedEvents.filter(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        return eventDateTime >= timeCutoff;
    });

    const getArrow = (key) => sortBy === key ? (sortOrder === "asc" ? "⬆" : "⬇") : "↕";

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
    }
    

    return (
        <div>
            <div className={styles.formContainer}>
                <h2>Create a New Event</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="location">Prison:</label>
                        <select
                            name="location"
                            id="location"
                            value={eventData.location}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Location</option>
                            {availableLocation.map((loc, index) => (
                                <option key={index} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date">Date:</label>
                        <input type="date" name="date" id="date" value={eventData.date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="time">Time:</label>
                        <input type="time" name="time" id="time" value={eventData.time} onChange={handleChange} required />
                    </div>
                    <div className={styles.centeredButton}>
                        <button type="submit" className={styles.dashboardButton}>Create Event</button>
                    </div>
                </form>
            </div>

            <br />

            <div className={styles.tableContainer}>
                {events.length > 0 ? (
                    <table className={styles.scheduleTable}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("location")} style={{ cursor: "pointer" }}>
                                    Location {getArrow("location")}
                                </th>
                                <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                                    Date {getArrow("date")}
                                </th>
                                <th>Time</th>
                                <th>Head Count</th>
                                <th>RSVPs</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.location}</td>
                                    <td>{formatDate(event.date)}</td>
                                    <td>{event.time}</td>
                                    <td></td>
                                    <td>
                                        <details>
                                            <summary>View RSVP List</summary>
                                            <ul>{/* future rsvp data */}</ul>
                                        </details>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => openDeleteModal(event)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No events scheduled yet.</p>
                )}
            </div>

            {modal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/2 relative">
                        <h2 className="text-xl font-bold mb-4">Delete Event?</h2>
                        <p>Are you sure you want to delete the event <strong>"{modal.event.location} on {formatDate(modal.event.date)}"</strong>?</p>
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCreation;
