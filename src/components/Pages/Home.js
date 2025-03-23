import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import SiteContainer from '../../utils/SiteContainer.js';
import { Link } from 'react-router-dom';
import CustomAuthenticator from '../../utils/CustomAuthenticator.js';

function Home() {
    return ( 
    <SiteContainer content = {
        <div className="Home">
            <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                <h1 class="rounded-3xl border-gray-600 border shadow-gray-800 shadow-lg text-white text-center xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl bg-gray-800 p-7 bg-opacity-80">
                    Welcome to the official site for the <br/><p class="font-semibold xl:text-8xl">Outsiders Football Club!</p>
                </h1>
                <br></br>
                <br></br>
                <br></br>
                <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                    
                    <p>New here? Head over to <Link to="/registration" class="underline font-semibold">registration</Link> to get started.</p>
                </div>
                
                
            </div>
        </div>
    }/>
    );
  }

  export default Home;