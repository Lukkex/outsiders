import '../App.css';
import '../SignUp.css';
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    //When users submit their sign up info, redirects to Landing page without rereshing
    //*** No error checking atm: users can submit nothing, etc
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };
    
    return (
        <div className="Home">
            <img src="../images/outsiders4.png" alt="Logo" />
            <div className="site-header">
                <Link to="/">
                    <button className="rounded-button">HOME</button>
                </Link>
                <Link to="/registration">
                    <button className="rounded-button">REGISTRATION</button>
                </Link>
                <Link to="/scheduling">
                    <button className="rounded-button">SCHEDULING</button>
                </Link>
                <div className="dropdown">
                    <button className="rounded-button dropdown-button">ACCOUNT</button>
                    <div className="dropdown-content">
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
            <div className="signup-container">
                <h1>Create Your Account</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="First Name" className="form-input" />
                        <input type="text" placeholder="Last Name" className="form-input" />
                        <input type="text" placeholder="Username" className="form-input" />
                        <input type="email" placeholder="Email" className="form-input" />
                        <input type="password" placeholder="Password" className="form-input" />
                        <input type="password" placeholder="Confirm Password" className="form-input" />
                        <button type="submit" className="rounded-button">Sign Up</button>
                    </form>
                    <p>Already have an account? <Link to="/signin">Sign in here</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;