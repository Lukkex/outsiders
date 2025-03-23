import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import SiteHeader from '../../utils/SiteHeader.js';
import SiteFooter from '../../utils/SiteFooter.js';

function AboutUs() {
    return (
            <div className="AboutUs">
                <SiteHeader></SiteHeader>
                
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        
                        <p>About Us!</p>
                    </div>
                </div>

                <SiteFooter/>
                
            </div>
    );
  }

  export default AboutUs;