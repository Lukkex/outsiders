   import '../Stylesheets/App.css';
    import '../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
    import SiteContainer from '../../utils/SiteContainer';
    import { useNavigate, Link } from "react-router-dom";

    function ChangePassword() {
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
                                    <form onSubmit={handleSubmit}>
                                    <input type="password" placeholder="Current Password" className="form-input" />
                                    <input type="password" placeholder="New Password" className="form-input" />
                                    <input type="password" placeholder="Confirm New Password" className="form-input" />
                                    <button type="submit" className="settings-button">
                                            Change Password
                                        </button>
                                <br></br>
                            </form>
                                    
                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }/>
        );
    }

    export default ChangePassword;