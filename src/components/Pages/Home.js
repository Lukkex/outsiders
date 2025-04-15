import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import SiteContainer from '../../utils/SiteContainer.js';
import FadeInSection from '../../utils/FadeInSection.js';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import CustomAuthenticator from '../../utils/CustomAuthenticator.js';

function Home() {
    const { userInfo, loading } = useUser();
    const isAdmin = userInfo?.role.includes("admin") ? true : false;

    return ( 
    <SiteContainer content = {
        <div className="Home">
            <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                <h1 class="rounded-3xl border-gray-600 border shadow-gray-800 shadow-lg text-white text-center xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl bg-gray-800 p-7 bg-opacity-80">
                    <FadeInSection duration={1500}>
                    <p>Welcome to the official site for the </p>
                    </FadeInSection>
                    
                    <FadeInSection duration={2500}>
                    <p class="font-semibold xl:text-8xl">Outsiders Football Club!</p>
                    </FadeInSection>
                </h1>

                <br></br>
                <br></br>
                <br></br>

                <FadeInSection duration={3500}>
                    {!isAdmin ? (
                        <div class="xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            <p>New here?<br/>Head over to <Link to="/registration" class="underline font-semibold">forms</Link> to get started.</p>
                        </div>
                    ) 
                    : 
                    (
                        <div class="xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            <p>Welcome Admin. <br/>Click <Link to="/admindashboard" class="underline font-semibold">here</Link> access your dashboard.</p>
                        </div>
                    )}

                </FadeInSection>
            </div>
        </div>
    }/>
    );
  }

  export default Home;