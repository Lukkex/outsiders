import '../Stylesheets/App.css'; //global styles
import SiteHeader from '../../utils/SiteHeader';
import { useNavigate, Link } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div>
            <SiteHeader />
            <br />
            <br />
            <br />
            <div className="signin-container">
                <h1 className="font-semibold">Settings</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <button type="submit" className="rounded-button">Reset Password</button>
                        <Link to="/accountinfo" className="accountinfo_link">
                            <button type="button" className="rounded-button">Account Information</button>
                        </Link>
                        <Link to="/help" className="accountinfo_link">
                            <button type="submit" className="rounded-button">Help</button>
                        </Link>
                        <Link to="/admindashboard" className="admin-link">
                            <button type="button" className="rounded-button">Admin Dashboard</button>
                        </Link>
                        <button type="submit" className="Deletion">Delete Account</button>
                        <br />
                    </form>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Settings;
