import '../Stylesheets/App.css';
import '../Stylesheets/Help.css';
import { Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import SiteContainer from '../../utils/SiteContainer.js';

function Help() {
    return (
        <SiteContainer content = {
            <div className="Help">
                <div class="main-container h-[80vh] text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="contact-container xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        
                        <p>Need help?<br/><br/>Contact our <b>Support Team</b> at <u>OutsidersDevTeam@outlook.com</u></p>
                    </div>
                    <br/>
                    <div class="xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p>For FAQs, click <Link to="/aboutus#FAQ"><u>here</u></Link>.</p>
                    </div>
                </div>
            </div>
        }/>
    );
  }

  export default Help;