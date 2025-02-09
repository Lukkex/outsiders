import '../../../App.css'; //global styles
import '../../Stylesheets/Scheduling.css';
import { useState, useEffect } from 'react';
import SiteHeader from '../../SiteHeader';

// Meeting dummy data simulating backend tables
const dummyMeetingTimes = [
  { meetId: 1, date: '2024-03-20', location: 'Folsom State Prison' },
  { meetId: 2, date: '2024-03-21', location: 'San Quentin State Prison' },
  { meetId: 3, date: '2024-03-22', location: 'Folsom State Prison' }
];

function Scheduling() {
    const [shScheduling, setShScheduling] = useState(false);

    // Storing the meetingIds, meeting times, selected meetings, and setting flags for temporary messages
    const [selectedMeetings, setSelectedMeetings] = useState(new Set());
    const [meetingTimes, setMeetingTimes] = useState([]);
    const [showSaved, setShowSaved] = useState(false);
    const [showNoSelection, setShowNoSelection] = useState(false);

    // Simulate call to fetch meeting times
    useEffect(() => {
        // In real implementation fetch from backend
        setMeetingTimes(dummyMeetingTimes);
    }, []);

    // Add/remove meetingids from selected meetings
    const toggleMeeting = (meetId) => {
        setSelectedMeetings(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(meetId)) {
                newSelection.delete(meetId);
            } else {
                newSelection.add(meetId);
            }
            return newSelection;
        });
    };

    const handleSave = () => {
        if (selectedMeetings.size === 0) {
            setShowNoSelection(true);
            setTimeout(() => setShowNoSelection(false), 2000);
            return;
        }
        console.log('Saving selected meetings:', Array.from(selectedMeetings));
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    const hideComponent = (component) => {
        switch (component) {
            case "shScheduling":
                setShScheduling(prevShScheduling => !prevShScheduling);
                break;
            default:
                return;
        }
    };
    
    // Returns table of available meeting times, allowing for user selection
    function Schedule() {
        return (
        <div className='form-container'>
            <table className='schedule-table'>
                <caption classname='schedule-table-header'>Select Available Dates</caption>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Availability</th>
                    </tr>
                </thead> 
                <tbody>
                    {meetingTimes.map(({ meetId, location, date }) => (
                        <tr key={meetId}>
                            <td>{location}</td>
                            <td>{new Date(date).toLocaleDateString()}</td>
                            <td>
                                <input 
                                    type="checkbox"
                                    checked={selectedMeetings.has(meetId)}
                                    onChange={() => toggleMeeting(meetId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave} className="save-button">
                Confirm Selection
            </button>
            {showSaved && <div className="saved-message">Dates saved!</div>}
            {showNoSelection && <div className="error-message">Please select at least one date</div>}
        </div>
        );
    }

    return (
        <div>
            <SiteHeader className="navbar"></SiteHeader>
            <br></br>
            <br></br>
            <br></br>
            <div className="alert-container">
                <h1>Please Complete Registration to Continue.</h1>
                <button onClick={() => hideComponent("shScheduling")} className="toggle-button">[debug] Toggle Registration </button>
            </div>
            <br></br>
            <br></br>
            {shScheduling && <Schedule />}
        </div>
    );
}

export default Scheduling;