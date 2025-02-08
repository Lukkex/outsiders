import '../../../App.css'; //global styles
import styles from '../../Stylesheets/Scheduling.module.css';
import { useState } from 'react';
import SiteHeader from '../../SiteHeader';

//nothing is hooked up to backend for obvious reasons
//Ill comment more/better tomorrow
function Scheduling() {
    const [shScheduling, setShScheduling] = useState(false);

    const hideComponent = (component) => {
        switch (component) {
            case "shScheduling":
                setShScheduling(prevShScheduling => !prevShScheduling);
                break;
            default:
                return;
        }
    };
    
    function Schedule() {
        return (
        <div className={styles.tableContainer}>
            <table className={styles.scheduleTable}>
                <caption>Schedule</caption>
                <tr>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Availability</th>
                </tr>
                <tr>
                    <td>This be an example</td>
                    <td>6/17/1945</td>
                    <td><input type="checkbox"></input></td> 
                </tr>
            </table>
        </div>
        );
    }

    return (
        <div>
            <SiteHeader className="navbar"></SiteHeader>
            <br></br>
            <br></br>
            <br></br>
            <div className={styles.alertContainer}>
                <h1>Please Complete Registration to Continue.</h1>
                <button onClick={() => hideComponent("shScheduling")} className={styles.toggleButton}>[debug] Toggle Registration </button>
            </div>
            <br></br>
            <br></br>
            {shScheduling && <Schedule />}
        </div>
    );
}

export default Scheduling;