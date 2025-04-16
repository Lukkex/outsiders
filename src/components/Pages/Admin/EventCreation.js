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
const API_URL = 'https://f1z25x3dj5.execute-api.us-west-1.amazonaws.com/dev';

const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};

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

const fetchEvents = async () => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...(await getAuthHeader()),
        };
        //console.log('Fetch headers:', headers);

        const response = await fetch(API_URL, {
            method: 'GET',
            headers
        });

        if(!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
    }catch (error) {
        console.error('Error fetching events:', error);
    }
}

const EventCreation = () => {
    //## Dummy locations (replace with a fetch from DynamoDB later)
    const availableLocation = ["Folsom", "San Quentin"];

    /* testing just OPTIONS method (should work)
    useEffect(() => {
        const testOptions = async () => {
          try {
            const response = await fetch(API_URL, { method: 'OPTIONS' });
            console.log('OPTIONS Response:', response.status);
            console.log(await response.text());
          } catch (err) {
            console.error('OPTIONS failed:', err);
          }
        };
      
        testOptions();
    }, []);
    */

    //!!individual event data (replace rsvp:'' with proper fetch and input)
    const [eventData, setEventData] = useState({
        location: '',
        date: '',
        time: '',
        rsvp: ''
    });
    
    //const [name, setName] = useState('');
    //const [location, setLocation] = useState('');
    //const [date, setDate] = useState('');
    
    //##list of created events (replace with fetch from dynamoDB)
    const [events, setEvents] = useState([]);
    //sort tracking variables
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

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
            console.log('Event created!', result);
            await fetchEvents();
            setEventData({ location: "", date: "", time: "", rsvp: [] })
        } catch (error) {
            console.error('Failed to create event:', error);
        }
        //([...events, eventData]);
        //setEventData({ title: "", location: "", date: "", time:"", rsvp:[]});
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

    const filteredEvents = sortedEvents.filter(event => new Date(event.date) >= new Date());

    const getArrow = (key) => {
        return sortBy === key ? (sortOrder === "asc" ? "⬆" : "⬇") : "↕";
      };

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
                                <th>RSVPs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.location}</td>
                                    <td>{event.date}</td>
                                    <td>{event.time}</td>
                                    <td>
                                        <details>
                                            <summary>View RSVP List</summary>
                                            <ul>
                                                {event.rsvp.length > 0 ? (
                                                    event.rsvp.map((user,i) => <li key={i}>{user}</li>)
                                                ) : ( 
                                                    <li>No RSVPs</li>
                                                )}
                                            </ul>
                                        </details>
                                    </td>
                                </tr>
                            ))}
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