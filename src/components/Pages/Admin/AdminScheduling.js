import { useState } from 'react'; 
import SiteContainer from '../../../utils/SiteContainer.js';
import EventCreation from './EventCreation';
import UserSearch from './UserSearch';
//import '../../../App.css'; //global styles
import styles from '../../Stylesheets/Scheduling.module.css';

const AdminScheduling = () => {
    const [activeSection, setActiveSection] = useState('event');

    return (
        <SiteContainer content = {
            <div className="admin-scheduling-page">
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
                <br/>
                <br/>
            </div>
        }/>
    );
}

export default AdminScheduling;