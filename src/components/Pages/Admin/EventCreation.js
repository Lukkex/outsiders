//EventCreation.js
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
    //## Dummy locations (replace with a fetch from DynamoDB later)
    const availableLocation = ["Folsom", "San Quentin"];

    //!!individual event data (replace rsvp:'' with proper fetch and input)
    const [eventData, setEventData] = useState({
        location: '',
        date: '',
        time: ''
    });
    
    //##local list of created events
    const [events, setEvents] = useState([]);
    const [formatMap, setFormatMap] = useState({});
    //sort tracking variables
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [rsvpData, setRsvpData] = useState({}); // New state for RSVP data
    const [allRsvps, setAllRsvps] = useState([]);

    const createEvent = async (eventData) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...(await getAuthHeader()),
            };
    
            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(eventData)
            });
    
            if(!response.ok) throw new Error('Failed to create event');
            const result = await response.json();
            console.log('Event created:', result);
            return result;
        } catch (err) {
            console.error('Error creating event:', err);
            throw err;
        }
    };
    
    const fetchRsvpData = async (eventId) => {
        try {
          // (1) Fetch all RSVP records (no query string)
          const headers  = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };
          const response = await fetch(`${USER_EVENT_API_URL}?userID=dummy`, {
            method: 'GET',
            headers
          });
          if (!response.ok) throw new Error('Failed to fetch RSVP data');
      
          const allRsvps = await response.json();
      
          // (2) Client-side filter by eventId
          return allRsvps.filter(rsvp => rsvp.eventId === eventId);
        } catch (err) {
          console.error('Error fetching RSVP data:', err);
          return [];
        }
      };

    const fetchEvents = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...(await getAuthHeader()),
            };

            const response = await fetch(API_URL, {
                method: 'GET',
                headers
            });

            if (!response.ok) throw new Error('Failed to fetch events');
            const eventsFromAPI = await response.json();
            console.log('Fetched events:', eventsFromAPI);

            // format map
            const formatMap = {};
            const now = new Date();
            const futureEvents = eventsFromAPI
                .map(ev => {
                    const [y, m, d] = ev.date.split('-').map(Number);
                    const [hh, mm] = ev.time.split(':').map(Number);
                    const dt = new Date(y, m - 1, d, hh, mm);
                    const composite = `${ev.location}-${ev.date}-${ev.time}`;
                    formatMap[ev.eventID] = composite;
                    return { ...ev, when: dt.getTime() };
                })
                .filter(ev => ev.when >= now.getTime());

            setEvents(futureEvents);
            setFormatMap(formatMap);

            // Fetch RSVP data for each event
            const rsvpPromises = futureEvents.map(async (event) => {
                const eventId = event.id || `${event.location}-${event.date}-${event.time}`;
                console.log('Processing event:', eventId);
                const rsvps = await fetchRsvpData(eventId);
                return [eventId, rsvps];
            });

            const rsvpResults = await Promise.all(rsvpPromises);
            console.log('All RSVP results:', rsvpResults);
            const rsvpMap = Object.fromEntries(rsvpResults);
            console.log('RSVP map:', rsvpMap);
            setRsvpData(rsvpMap);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchAllRsvps = async () => {
        const response = await fetch(USER_EVENT_API_URL, { method: 'GET', headers });
        const all = await response.json();
        setAllRsvps(all);
    };

    //updates eventData variable (the event youre making)
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "location") {
            let defaultTime = "";
            if (value === "Folsom") { defaultTime = "09:30"; } 
            else if (value === "San Quentin") { defaultTime = "11:45"; }
            
            setEventData(prev => ({
                ...prev,
                location: value,
                time: defaultTime  // Set time when location changes
            }));
        } else {
            setEventData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    
        //setEventData({ ...eventData, [e.target.name]: e.target.value})
    }

    //##currently just updates the event list (replace with send data to DynamoDB)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createEvent(eventData);
            //console.log('Event created!', result);
            await fetchEvents();
            setEventData({ location: "", date: "", time: ""})
        } catch (error) {
            console.error('Failed to create event:', error);
        }
        //([...events, eventData]);
        //setEventData({ title: "", location: "", date: "", time:""});
    };

    //table sorting
    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }
        else {
            setSortBy(key);
            setSortOrder("asc");
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    //sort logic
    const sortedEvents = [...events].sort((a,b) => {
        if (!sortBy) return 0;
        let comparison = 0;

        if (sortBy === "date") comparison = new Date(a.date) - new Date(b.date);
        else if (sortBy === "location") comparison = a.location.localeCompare(b.location);
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const now = new Date();
    const filteredEvents = sortedEvents.filter(event => {
        const [year, month, day] = event.date.split('-');
        const [hour, minute] = event.time.split(':');
        const eventDateTime = new Date(
            Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)
        );
        return eventDateTime >= now;
    });

    const getArrow = (key) => {
        return sortBy === key ? (sortOrder === "asc" ? "⬆" : "⬇") : "↕";
    };
    
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        var monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return (monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
    }

    return (
        <div>
            <div className={styles.formContainer}>
                <h2 className="" >Create a New Event</h2>
                {/*Create event form*/}
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
                                <option key={index} value={loc}> {loc} </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date">Date:</label>
                        <input 
                            type="date" 
                            name="date"
                            id="date"
                            value={eventData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                    <label htmlFor="time">Time:</label>
                        <input 
                            type="time" 
                            name="time"
                            id="time"
                            value={eventData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Create Event</button>
                </form>
            </div>
            <br></br>

            <div className={styles.tableContainer}>
                {/*List of existing events*/}
                <h1>Upcoming Events</h1>
                {events.length > 0 ? (
                    <table className={styles.scheduleTable} border="1">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("location")} style={{ cursor: "pointer" }}>
                                    Location {getArrow("location")}</th>
                                <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                                    Date {getArrow("date")}</th>
                                <th>Time</th>
                                <th>RSVP Count</th>
                                <th>RSVP List</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => {
                                const eventId = event.id || `${event.location}-${event.date}-${event.time}`;
                                const rsvps = rsvpData[eventId] || [];
                                console.log(`Rendering event ${eventId} with RSVPs:`, rsvps);
                                return (
                                    <tr key={index}>
                                        <td>{event.location}</td>
                                        <td>{formatDate(event.date)}</td>
                                        <td>{event.time}</td>
                                        <td>{rsvps.length}</td>
                                        <td>
                                            <details>
                                                <summary>View RSVP List ({rsvps.length})</summary>
                                                <ul className={styles.rsvpList}>
                                                    {rsvps.length > 0 ? (
                                                        rsvps.map((rsvp, i) => (
                                                            <li key={i} className={styles.rsvpItem}>
                                                                {rsvp.userID}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No RSVPs</li>
                                                    )}
                                                </ul>
                                            </details>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No events scheduled yet.</p>
                )}
            </div>
        </div>
    );
}

export default EventCreation;