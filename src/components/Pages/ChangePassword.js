    import '../Stylesheets/App.css';
        import '../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
        import SiteContainer from '../../utils/SiteContainer';
        import { useNavigate, Link } from "react-router-dom";
        import { signIn, confirmSignIn, signOut, resetPassword, confirmResetPassword } from '@aws-amplify/auth';
        import React, { useState } from 'react';

        function ChangePassword() {
            const navigate = useNavigate();
            const [newPassword, setNewPassword] = useState('');
            const [confirmNewPassword, setConfirmNewPassword] = useState('');
            const [password, setPassword] = useState('');
            const [success, setSuccess] = useState('');


            const handleSubmit = async (e) => {
                e.preventDefault();
                setError('');
            
                if (newPassword !== confirmNewPassword) {
                setError('Passwords do not match');
                return;
                }
                try {
                await confirmResetPassword({
                    newPassword: newPassword
                });
                setSuccess('Password change successful!');
                //setIsResetPassword(true);
                setResetStep('REQUEST_CODE');
                setResetEmail('');
                setResetCode('');
                setNewPassword('');
                setConfirmNewPassword('');
                navigate('/');
                } catch (err) {
                console.error('Error confirming password reset:', err);
                setError(err.message || 'Failed to reset password');
                }
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
                                        <div className="form-group">
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                            required
                                            className="form-control"
                                            />
                                            </div>
                                        <div className="form-group">
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            required
                                            className="form-control"
                                        />
                                        </div>
                                        <div className="form-group">
                                        <input
                                        id="confirmNewPassword"
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        className="form-control"
                                      />
                                      </div>
                                    <div className="button-group">
                                    <button type="submit" className="login-button"> Change Password </button>
                                    </div>
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