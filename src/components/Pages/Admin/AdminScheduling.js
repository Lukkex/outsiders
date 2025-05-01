/*
* Notes: - This page is the main container for admin scheduling.
* TODO: - Keep switching between Event Creation and User Search clean
*       - Ensure toggle buttons are styled consistently
*/

import { useState } from 'react'; 
import SiteContainer from '../../../utils/SiteContainer.js';
import EventCreation from './EventCreation';
import Scheduling from '../User/Scheduling'; 
import styles from '../../Stylesheets/Scheduling.module.css';

const AdminScheduling = () => {
    const [activeSection, setActiveSection] = useState('event');

    const pageContent = (
        <div className="admin-scheduling-page">
            <div className={styles.topButtonContainer}>
                <button className={styles.buttonStyled} onClick={() => setActiveSection('event')}>Event Creation</button>
                <button className={styles.buttonStyled} onClick={() => setActiveSection('user')}>RSVP as Admin</button>
            </div>
            <main className="admin-main-content">
                {activeSection === 'event' && <EventCreation />}
                {activeSection === 'user' && <Scheduling />}
            </main>
        </div>
    );

    return <SiteContainer content={pageContent} />;  
};

export default AdminScheduling;
