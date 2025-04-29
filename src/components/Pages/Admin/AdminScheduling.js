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
               <div className={styles.topButtonContainer}>
                    <button
                        className={styles.topButton}
                        onClick={() => setActiveSection('event')}
                    >
                        Event Creation
                    </button>
                    <button
                        className={styles.topButton}
                        onClick={() => setActiveSection('user')}
                    >
                        User Search & RSVP
                    </button>
                </div>
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
