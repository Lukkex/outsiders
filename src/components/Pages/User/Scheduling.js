/*
* Notes: - NOT LINKED TO BACKEND, USING DUMMY DATA OR NONE AT ALL.
* TODO: - send eventData to DynamoDB
*       - fetch locations, RSVPs, and user info from DynamoDB
*       - events need to auto delete when the date is passed
*       - delete created events functionality
*/
import '../../Stylesheets/App.css';
import styles from '../../Stylesheets/Scheduling.module.css';
import { useState, useEffect } from 'react';
import SiteContainer from '../../../utils/SiteContainer.js';
import { fetchAuthSession } from '@aws-amplify/auth';

const API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/user-events';
const EVENTS_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/events';

function Scheduling() {
  const [shScheduling, setShScheduling] = useState(true);
  const [selectedMeetings, setSelectedMeetings] = useState(new Set());
  const [meetingTimes, setMeetingTimes] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showNoSelection, setShowNoSelection] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const availableLocations = ["Folsom", "San Quentin"];

  const fetchMeetings = async () => {
    const res = await fetch(EVENTS_URL);
    const allEvents = await res.json();
    const now = new Date();

    const futureEvents = allEvents.filter(ev => {
      const evDateTime = new Date(`${ev.date}T${ev.time}`);
      return evDateTime >= now;
    });

    setMeetingTimes(futureEvents);
  };

  const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    return {
      Authorization: session.tokens?.accessToken?.toString() ?? '',
    };
  };

  // Generate a unique key for each event
  const getEventKey = (event) => `${event.location}_${event.date}_${event.time}`;

  const toggleMeeting = (key) => {
    setSelectedMeetings(prev => {
      const updated = new Set(prev);
      if (updated.has(key)) {
        updated.delete(key);
      } else {
        updated.add(key);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (selectedMeetings.size === 0) {
      setShowNoSelection(true);
      setTimeout(() => setShowNoSelection(false), 2000);
      return;
    }

    const headers = { 'Content-Type': 'application/json', ...(await getAuthHeader()) };

    await Promise.all([...selectedMeetings].map(key => {
      const [location, date, time] = key.split('_');
      return fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location, date, time })
      });
    }));

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleClear = () => {
    setLocationFilter('');
    setSortOrder('asc');
  };

  useEffect(() => { fetchMeetings(); }, []);

  const filteredMeetings = meetingTimes
    .filter(({ location }) => {
      return locationFilter ? location === locationFilter : true;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  return (
    <SiteContainer content={
      <div>
        <br /><br />
        <div className={styles.alertContainer}>
          <h1>Please RSVP to available events below.</h1>
        </div>
        <br /><br />

        {shScheduling && (
          <div className={styles.tableContainer}>

            {/* Filters */}
            <div className="flex gap-2 mb-6 items-center justify-start">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border rounded w-64"
              >
                <option value="">All Locations</option>
                {availableLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <button
                onClick={toggleSortOrder}
                className={styles.dashboardButton}
              >
                Sort by {sortOrder === 'asc' ? 'Most Recent' : 'Oldest'}
              </button>

              <button
                onClick={handleClear}
                className={styles.dashboardButton}
              >
                Clear
              </button>
            </div>

            {/* Table */}
            <table className={styles.scheduleTable}>
              <caption className={styles.scheduleTableHeader}>Select Available Dates</caption>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>RSVP</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeetings.map((event) => {
                  const key = getEventKey(event);
                  return (
                    <tr key={key}>
                      <td>{event.location}</td>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.time}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedMeetings.has(key)}
                          onChange={() => toggleMeeting(key)}
                          className="accent-sky-700"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSave}
                className={styles.saveButton}
              >
                Confirm Selection
              </button>
            </div>

            {showSaved && <div className={styles.savedMessage}>Dates saved!</div>}
            {showNoSelection && <div className={styles.errorMessage}>Please select at least one date</div>}
          </div>
        )}
      </div>
    } />
  );
}

export default Scheduling;
