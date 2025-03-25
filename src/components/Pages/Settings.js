// src/components/Pages/Settings.js
import '../Stylesheets/App.css';
import '../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
import SiteContainer from '../../utils/SiteContainer.js';
import { useNavigate, Link } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <SiteContainer content = {
            <div>
                <div className="settings-container">
                    <h1 className="settings-title">Settings</h1>
                    <div className="settings-form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="settings-button-group">
                                <Link to="/accountinfo" className="settings-link">
                                    <button type="button" className="settings-button">
                                        Account Information
                                    </button>
                                </Link>
                                <Link to="/changepassword">
                                    <button type="submit" className="settings-button">
                                        Change Password
                                    </button>
                                </Link>
                                <Link to="/help" className="settings-link">
                                    <button type="button" className="settings-button">
                                        Help
                                    </button>
                                </Link>
                                <button type="submit" className="settings-button delete-button">
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }/>
    );
}

export default Settings;