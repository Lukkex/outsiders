import React, { useState, useEffect } from 'react';
import { getSubmittedFormsFromS3 } from '../../../services/getSubmittedFormsFromS3';
import { getUrl, uploadData } from 'aws-amplify/storage';
import '../../Stylesheets/AdminDashboard.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import { fetchAuthSession } from '@aws-amplify/auth';
const API_URL= 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/events';
const USER_EVENT_API_URL = 'https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/user-events';


function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const getAuthHeader = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [eventsModalOpen, setEventsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadMessage, setUploadMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentEventInfo, setCurrentEventInfo] = useState([]);
    const [eventsForForms, setEventsForForms] = useState([{
        email: '',
        locations: [],
        eventNameTime: []
       
    }]);
    /*
    email: greg@gmail.com
    locations: ['Folsom', 'San Quentin']
    eventNameTime: ['Folsom: 2025-08-12, 13:35', 'San Quentin: 2025-10-11, 10:30']
    */

    const formsPerPage = 15;


    async function fetchForms() {
        const allForms = await getSubmittedFormsFromS3();
        const formatted = allForms.map(form => ({
            ...form,
            firstName: capitalizeName(form.firstName || ''),
            lastName: capitalizeName(form.lastName || '')
        }));
        setForms(formatted);
        setFilteredForms(formatted);
    }

    useEffect(() => { fetchForms(); }, []);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            setFilteredForms(forms);
            return;
        }

        const filtered = forms.filter(form =>
            `${form.firstName} ${form.lastName} ${form.email} ${form.formCode} ${form.submittedAt}`.toLowerCase().includes(term)
        );
        setFilteredForms(filtered);
        setCurrentPage(1);
    };

    const handleSort = () => {
        setFilteredForms(prevForms =>
            [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleFormDownload = async (s3Key) => {
        try {
            const result = await getUrl({ path: s3Key, options: { expiresIn: 300 } });
            window.open(result.url, '_blank');
        } catch (error) {
            console.error("Error getting file URL:", error);
            alert("Could not retrieve the form. Please try again.");
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.type === 'application/pdf');

        if (validFiles.length !== files.length) {
            alert('Only PDF files are allowed.');
        }

        setSelectedFiles(validFiles);
    };

    const handleUpload = async () => {
        try {
            for (const file of selectedFiles) {
                const key = `formtemplates/${file.name}`;
                await uploadData({
                    path: key,
                    data: file,
                    contentType: 'application/pdf'
                }).result;
            }
            setUploadModalOpen(false);
            setUploadMessage(`${selectedFiles.length} file(s) uploaded successfully.`);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        }
    };

     
    const fetchUserEvents = async (eventId) => {
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
        const headers = {
            'Content-Type': 'application/json',
            ...(await getAuthHeader()),
        };
        

        const response = await fetch(API_URL, {
            method: 'GET',
            headers
        });

        if(!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        //console.log("Fetched events:", data);
        //alert("All known Events:\n" + data.map(item => item.eventID).join('\n'));
        
        const now = new Date();
        const filteredEvents = data
        .map(ev => {
            const [y, m, d] = ev.date.split('-').map(Number);
            const [hh, mm] = ev.time.split(':').map(Number);
            const dt = new Date(y, m - 1, d, hh, mm);
            return { ...ev, when: dt.getTime() };
        })
        .filter(ev => ev.when >= now.getTime())
        .sort((a, b) => a.when - b.when);

        const userEvents = await Promise.all(
            filteredEvents.map(async (event) => [event.eventID, await fetchUserEvents(event.eventID)])
        );

        const allUserEvents = Object.fromEntries(userEvents);

        const allUserIDs = Array.from(new Set(Object.values(allUserEvents).flat().map(r => r.userID)));
        if (allUserIDs.length > 0) {
            const users = await fetch('https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/get-user-names', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(await getAuthHeader()) },
                body: JSON.stringify({ userIDs: allUserIDs })
            });
            if (users.ok) {
                const userInfo = await users.json();
                
                const result = [];
                userInfo.forEach(user => {
                    const locations = new Set();
                    const eventNameTime = [];

                    // Check all events to see if user attended
                    Object.entries(allUserEvents).forEach(([eventID, attendees]) => {
                        if (attendees.some(att => att.userID === user.userID)) {
                            const attendedEvent = data.find(ev => ev.eventID === eventID);
                            if (!attendedEvent) return;

                            // Add location and formatted name/time
                            locations.add(attendedEvent.location);
                            eventNameTime.push({
                                location: attendedEvent.location,
                                date: attendedEvent.date,
                                time: attendedEvent.time
                                });
                        }
                    });

                    if (eventNameTime.length > 0) {
                        result.push({
                            email: user.email,
                            locations: Array.from(locations),
                            eventNameTime
                        });
                    }
                });
                
                setEventsForForms(result);
            }
        }
    }

    useEffect(() => { fetchEvents(); }, []);



    function setUserEventNameTime(email)
    {
        const currentUser = eventsForForms.find(item => item.email === email);

        if (!currentUser) {
            console.warn("User not found in eventsForForms for email:", email);
            alert("No event info found for this user.");
            setEventsModalOpen(false);
            return;
        }

        setCurrentEventInfo(currentUser.eventNameTime);

    }

    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
    const totalPages = Math.ceil(filteredForms.length / formsPerPage);

    return (
        <SiteContainer content={
            <div>
                <div className="admin-dashboard">
                    <div className="filters flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search by name, form code, date, or email"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                value={searchTerm}
                                className="px-3 py-2 border rounded w-80"
                            />
                            <button onClick={handleSearch} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Filter</button>
                            <button onClick={handleSort} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Sort by Most Recent</button>
                            <button onClick={() => { setFilteredForms(forms); setSearchTerm(''); }} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Clear</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setUploadModalOpen(true)}
                                className="bg-sky-700 text-white px-3 py-2 rounded shadow"
                            >
                                Upload Files
                            </button>
                            <button
                                onClick={() => window.location.href = '/viewplayers'}
                                className="bg-sky-700 text-white px-3 py-2 rounded shadow"
                            >
                                View Users
                            </button>
                        </div>
                    </div>

                    {uploadMessage && <p className="mt-2 text-green-700 font-medium">{uploadMessage}</p>}

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>FORM CODE</th>
                                <th style={{ width: '20%', textAlign: 'center'  }}>EVENTS</th>
                                <th style={{ width: '10%', paddingLeft: '30px' }}>FIRST</th>
                                <th style={{ width: '10%' }}>LAST</th>
                                <th style={{ width: '25%' }}>EMAIL</th>
                                <th style={{ width: '20%' }}>SUBMISSION DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentForms.length > 0 ? (
                                currentForms.map((form, index) => (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFormDownload(form.s3Key);
                                                }}
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                {form.formCode || form.fileName}
                                            </a>
                                        </td>
                                        <td>
                                        <div className="flex justify-center items-center h-full w-full">
                                        {(() => {
                                            const user = eventsForForms.find(e => e.email === form.email);
                                            if (!user || !user.locations || user.locations.length === 0) {
                                                return <span className="text-gray-500">No Events</span>;
                                            }

                                            return (
                                            <button
                                                onClick={() => {
                                                setEventsModalOpen(true);
                                                setUserEventNameTime(form.email);
                                                }}
                                                className="text-blue-700 bg-white-200 hover:text-white hover:bg-blue-500 text-sm px-4 py-2 rounded"
                                            >
                                                {user.locations.map((location, index) => (
                                                <span key={index}style={{ fontSize: '1.0rem' }}>
                                                    {location}
                                                    {index < user.locations.length - 1 && ','}
                                                    {index < user.locations.length - 1 && <br />} {/* Adds a line break between locations */}
                                                </span>
                                                ))}
                                            </button>
                                            );
                                        })()}
                                        </div>
                                        </td>
                                        <td style={{ paddingLeft: '30px' }}>{form.firstName || '-'}</td>
                                        <td>{form.lastName || '-'}</td>
                                        <td>{form.email}</td>
                                        <td>
                                            {form.submittedAt
                                                ? new Date(form.submittedAt).toLocaleString('en-US', {
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No forms found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-center items-center mt-4 gap-2 w-full">
                    <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="bg-sky-700 text-white px-3 py-1 rounded shadow"
                            disabled={currentPage === 1}
                        >
                            &larr;
                        </button>
                        <span className="px-4 py-1">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="bg-sky-700 text-white px-3 py-1 rounded shadow"
                            disabled={currentPage === totalPages}
                        >
                            &rarr;
                        </button>
                    </div>
                </div>

                {uploadModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/2 relative">
                            <button onClick={() => setUploadModalOpen(false)} className="absolute top-2 right-2 text-lg">✖</button>
                            <h2 className="text-xl font-bold mb-4">Upload PDF Files</h2>
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={handleFileSelect}
                                className="mb-4"
                            />
                            {selectedFiles.length > 0 && (
                                <ul className="mb-4 list-disc list-inside">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Upload
                            </button>
                        </div>
                    </div>
                )}

                {eventsModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/2 relative">
                            <button onClick={() => setEventsModalOpen(false)} className="absolute top-2 right-2 text-lg">✖</button>
                            <h2 className="text-xl font-bold mb-4">RSVPs:</h2>
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-sky-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Location</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Date</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEventInfo.map((event, index) => {
                                        const combinedDateTime = `${event.date}T${event.time}`;
                                        const dateObject = new Date(combinedDateTime);

                                        const formattedDate = dateObject.toLocaleString('en-US', {
                                            month: 'numeric',
                                            day: 'numeric',
                                            year: 'numeric',
                                        });

                                        const formattedTime = dateObject.toLocaleString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        });

                                        return (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{event.location}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{formattedDate}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{formattedTime}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        } />
    );
}

export default AdminDashboard;
