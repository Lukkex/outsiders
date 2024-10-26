import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="Home">
            <img src="../images/outsiders4.png" alt="Logo"></img>
            <h1>Welcome to Outsiders Football Club for Folsom and San Quentin!</h1>
            <div class="site-header">
                <button class="rounded-button">HOME</button>
                <button class="rounded-button">REGISTRATION</button>
                <button class="rounded-button">SCHEDULING</button>
                <div class="dropdown">
                    <button class="rounded-button dropdown-button">ACCOUNT</button>
                    <div class="dropdown-content">
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  export default Home;