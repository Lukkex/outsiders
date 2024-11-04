import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import '../SignUp.css';
import { useNavigate, Link } from "react-router-dom";
import TextBlackBG from './TextBlackBG';

function SignIn() {
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
            <div className="signin-container">
                <h1 class="font-semibold">Log In to Your Account</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" className="form-input" />
                        <input type="text" placeholder="Password" className="form-input" />
                        <br></br>
                        <button type="submit" className="rounded-button">Submit</button>
                        <br></br>
                    </form>
                    <br></br>
                </div>
            </div>
        </div>
    );
}

export default SignIn; //sends function when imported