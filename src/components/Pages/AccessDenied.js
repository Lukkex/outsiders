import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import SiteHeader from '../../utils/SiteHeader.js';

function AccessDenied() {
    return (
            <div className="AccessDenied">
                <SiteHeader></SiteHeader>
                
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p>ERROR 403: Access Denied.</p>
                    </div>
                </div>
            </div>
    );
  }

  export default AccessDenied;