import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="Home">
            <div class="w-full bg-cyan-700 bg-opacity-60">
                <img src="../images/outsidersinvert.png" class="logoimage py-3 md:flex" alt="Logo"></img>
            </div>
            
            <div class="site-header font-semibold bg-cyan-700 bg-opacity-60">
                <button class="rounded-button cyan-gradient">HOME</button>
                <Link to="/registration"><button class="rounded-button cyan-gradient">REGISTRATION</button></Link>
                <button class="rounded-button cyan-gradient">SCHEDULING</button>
                <div class="dropdown">
                    <button class="rounded-button cyan-gradient dropdown-button">ACCOUNT</button>
                    <div class="dropdown-content">
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign up</Link>
                        <Link to="/settings">Settings</Link>
                    </div>
                </div>
            </div>
            
            <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                <h1 class="rounded-3xl border-gray-600 border shadow-gray-800 shadow-lg text-white text-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl bg-gray-800 p-7 bg-opacity-80">Welcome to Outsiders Football Club for Folsom and San Quentin!</h1>
                <br></br>
                <br></br>
                <br></br>
                <div class="text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                    
                    <p>Sign up for an account <Link to="/signup" class="underline font-semibold">here</Link> to get started.</p>
                </div>
            </div>
        </div>
    );
  }

  export default Home;