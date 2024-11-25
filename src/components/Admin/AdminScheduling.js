import '../../App.css'; //global styles
import '../../Scheduling.css';
import { useState } from 'react';
import SiteHeader from '../SiteHeader';
import TextBlackBG from '../TextBlackBG';

//nothing is hooked up to backend for obvious reasons
function AdminScheduling() {
    //const [shScheduling, setShScheduling] = useState(false);

    return (
        <div>
            <SiteHeader className="navbar"></SiteHeader>
            <TextBlackBG label="Admin Scheduling"></TextBlackBG>
            <br></br>
            <br></br>
        </div>
    );
}

export default AdminScheduling;