//EventCreation.js
/*
* Notes: - NOT LINKED TO BACKEND, USING DUMMY DATA OR NONE AT ALL.
* TODO: - send eventData to DynamoDB
*       - fetch locations, RSVPs, and user info from DynamoDB
*       - events need to auto delete when the date is passed
*       - delete created events functionality
*/
import React, { useState } from 'react';
import styles from '../../Stylesheets/Scheduling.module.css';

const EventCreation = () => {
    //## Dummy locations (replace with a fetch from DynamoDB later)
    const availableLocation = ["Folsom", "San Quentin"];

    //!!individual event data (replace rsvp:'' with proper fetch and input)
    const [eventData, setEventData] = useState({
        title: '',
        date: '',
        time: '',
        rsvp: ''
    });
    
    //##list of created events (replace with fetch from dynamoDB)
    const [events, setEvents] = useState([]);
    //sort tracking variables
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    //updates eventData variable (the event youre making)
    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value})
    }

    //##currently just updates the event list (replace with send data to DynamoDB)
    const handleSubmit = (e) => {
        e.preventDefault();
        setEvents([...events, eventData]);
        setEventData({ title: "", location: "", date: "", time:"", rsvp:[]});
    }

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

    //sort logic
    const sortedEvents = [...events].sort((a,b) => {
        if (!sortBy) return 0;
        let comparison = 0;

        if (sortBy === "date") comparison = new Date(a.date) - new Date(b.date);
        else if (sortBy === "location") comparison = a.location.localeCompare(b.location);
        return sortOrder === "asc" ? comparison : -comparison;
    });

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
                        <label htmlFor="title">Name:</label>
                        <input 
                            type="text" 
                            name="title"
                            id="title"
                            value={eventData.title}
                            onChange={handleChange}
                            required
                        />
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
                    <button type="submit">Create Event</button>
                </form>
            </div>
            <br></br>
            <div className={styles.tableContainer}>
                {/*List of existing events*/}
                <h2>Upcoming Events</h2>
                {events.length > 0 ? (
                    <table className={styles.scheduleTable} border="1">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th onClick={() => handleSort("location")} style={{ cursor: "pointer" }}>
                                    Location{getArrow("location")}</th>
                                <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                                    Date{getArrow("date")}</th>
                                <th>Time</th>
                                <th>RSVPs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEvents.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.title}</td>
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