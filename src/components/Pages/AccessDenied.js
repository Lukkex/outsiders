import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import SiteContainer from '../../utils/SiteContainer.js';

function AccessDenied() {
    return (
        <SiteContainer content = {
            <div className="AccessDenied">
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p>ERROR 403: Access Denied.</p>
                    </div>
                </div>
            </div>
        }/>
    );
  }

  export default AccessDenied;