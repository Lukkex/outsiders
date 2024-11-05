import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import TextBlackBG from './TextBlackBG';
import { useNavigate, Link } from "react-router-dom";

function Settings() {
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
            <div className="signin-container">
                <h1 class="font-semibold">Settings</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <button type="submit" className="rounded-button">Reset Passowrd</button>
                        <button type="submit" className="rounded-button">Account Info</button>
                        <button type="submit" className="rounded-button">Help</button>
                        
                    </form>
                </div>
            </div>
        
    </div>
    );
}

export default Settings; //sends function when imported