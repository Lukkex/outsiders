import '../Stylesheets/App.css';
import { Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import SiteContainer from '../../utils/SiteContainer.js';

function Help() {
    return (
        <SiteContainer content = {
            <div className="Help">
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        
                        <p>Need help? Contact our support team at <u>OutsidersDevTeam@outlook.com</u></p>
                    </div>
                    <br/>
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p>For FAQs, click <Link to="/aboutus#FAQ"><u>here</u></Link>.</p>
                    </div>
                </div>
            </div>
        }/>
    );
  }

  export default Help;