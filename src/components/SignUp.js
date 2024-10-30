import '../App.css';
import '../SignUp.css';
import { useNavigate, Link } from "react-router-dom";
import SiteHeader from './SiteHeader';

function SignUp() {
    const navigate = useNavigate();

    //When users submit their sign up info, redirects to Landing page without rereshing
    //*** No error checking atm: users can submit nothing, etc
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };
    
    return (
        <div>
            <SiteHeader></SiteHeader>
            
            <br></br>
            <br></br>
            <br></br>
            <div className="signup-container">
                <h1 class="font-semibold">Create Your Account</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="First Name" className="form-input" />
                        <input type="text" placeholder="Last Name" className="form-input" />
                        <input type="email" placeholder="Email" className="form-input" />
                        <input type="password" placeholder="Password" className="form-input" />
                        <input type="password" placeholder="Confirm Password" className="form-input" />
                        <br></br>
                        <button type="submit" className="rounded-button">Sign Up</button>
                    </form>
                    <br></br>
                    <p class="font-semibold">Already have an account?</p>
                    <p><Link class="underline" to="/signin">Sign in here</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;