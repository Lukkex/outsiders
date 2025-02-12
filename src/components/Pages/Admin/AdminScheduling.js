//AdminScheduling.js
import { useState } from 'react';
import SiteHeader from '../../SiteHeader.js';
import EventCreation from './EventCreation.js';
import UserSearch from './UserSearch.js';
import '../../../App.css'; //global styles
import '../../Stylesheets/Scheduling.css';

const AdminScheduling = () => {
    const [activeSection, setActiveSection] = useState('event');

    return (
        <div className="admin-scheduling-page">
            <SiteHeader className="navbar"></SiteHeader>
            <nav>
                <ul>
                    <li onClick={() => setActiveSection('event')}>
                        Event Creation
                    </li>
                    <li onClick={() => setActiveSection('user')}>
                        User Search & RSVP
                    </li>
                </ul>
            </nav>
            <main className="admin-main-content">
                {activeSection === 'event' && <EventCreation />}
                {activeSection === 'user' && <UserSearch />}
            </main>
        </div>
    );
}

export default AdminScheduling;