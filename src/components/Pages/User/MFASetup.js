import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  setUpTOTP, 
  verifyTOTPSetup, 
  updateMFAPreference,
  fetchMFAPreference
} from 'aws-amplify/auth';
import { QRCodeCanvas } from 'qrcode.react';
import SiteHeader from '../../../utils/SiteHeader';
import '../../Stylesheets/MFASetup.css';

function MFASetup() {
    const navigate = useNavigate();
    const [setupUri, setSetupUri] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [showConfirmDisable, setShowConfirmDisable] = useState(false);

    // Check if MFA is already enabled when the component loads
    useEffect(() => {
        const checkMfaStatus = async () => {
            try {
                const output = await fetchMFAPreference();
                const isTOTPEnabled = output.enabled.includes('TOTP');
                setMfaEnabled(isTOTPEnabled);
            } catch (error) {
                console.error('Error checking MFA status:', error);
                // Removed the setError line to not show the fail MFA status check error
            }
        };

        checkMfaStatus();
    }, []);

    const handleTOTPSetup = async () => {
        setIsLoading(true);
        try {
            const totpSetupDetails = await setUpTOTP();
            const appName = 'outsiders';
            const uri = totpSetupDetails.getSetupUri(appName).toString();
            setSetupUri(uri);
            setError('');
            setSuccess('Scan the QR code or use the URI in your authenticator app.');
        } catch (error) {
            console.error('Error setting up TOTP:', error);
            setError('Failed to set up TOTP: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTOTPVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verifyTOTPSetup({ code: totpCode });
            setSuccess('TOTP setup verified successfully!');
            setError('');
            await handleUpdateMFAPreference();
        } catch (error) {
            console.error('Error verifying TOTP setup:', error);
            setError('Failed to verify TOTP setup: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMFAPreference = async () => {
        try {
            await updateMFAPreference({ totp: 'PREFERRED' });
            setSuccess('MFA preferences updated successfully! You can now use MFA to sign in.');
            setMfaEnabled(true);
            
            // Wait for 2 seconds before navigating back to account info
            setTimeout(() => {
                navigate('/accountinfo');
            }, 2000);
        } catch (error) {
            console.error('Error updating MFA preferences:', error);
            setError('Failed to update MFA preferences: ' + error.message);
        }
    };

    const handleDisableMFA = async () => {
        setIsLoading(true);
        try {
            // Disable TOTP MFA
            await updateMFAPreference({ totp: 'DISABLED' });
            setSuccess('MFA has been disabled successfully.');
            setMfaEnabled(false);
            setShowConfirmDisable(false);
            
            // Wait for 2 seconds before navigating back to account info
            setTimeout(() => {
                navigate('/accountinfo');
            }, 2000);
        } catch (error) {
            console.error('Error disabling MFA:', error);
            setError('Failed to disable MFA: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <SiteHeader />
            <div className="mfa-setup-container">
                <div className="mfa-card">
                    <div className="mfa-header">
                        <h2>{mfaEnabled ? 'Manage MFA Settings' : 'Set Up Multi-Factor Authentication'}</h2>
                    </div>
                    
                    <div className="mfa-content">
                        {/* If MFA is enabled, show management options */}
                        {mfaEnabled && !showConfirmDisable && (
                            <div>
                                <p className="mfa-instructions success-message">
                                    Multi-factor authentication is currently enabled for your account.
                                </p>
                                <div className="button-group">
                                    <button 
                                        className="mfa-button secondary"
                                        onClick={() => setShowConfirmDisable(true)}
                                        disabled={isLoading}
                                    >
                                        Disable MFA
                                    </button>
                                    <button
                                        type="button"
                                        className="mfa-button"
                                        onClick={() => navigate('/accountinfo')}
                                    >
                                        Back to Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Confirmation for disabling MFA */}
                        {mfaEnabled && showConfirmDisable && (
                            <div>
                                <p className="mfa-instructions error-message">
                                    Are you sure you want to disable multi-factor authentication? 
                                    This will make your account less secure.
                                </p>
                                <div className="button-group">
                                    <button 
                                        className="mfa-button secondary"
                                        onClick={handleDisableMFA}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Disabling...' : 'Yes, Disable MFA'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mfa-button"
                                        onClick={() => setShowConfirmDisable(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* If MFA is not enabled and setup not started */}
                        {!mfaEnabled && !setupUri && (
                            <div>
                                <p className="mfa-instructions">
                                    Multi-factor authentication adds an extra layer of security to your account.
                                    You'll be asked for a code from your authenticator app when signing in.
                                </p>
                                <div className="button-group">
                                    <button 
                                        className="mfa-button"
                                        onClick={handleTOTPSetup}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Setting up...' : 'Start MFA Setup'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mfa-button secondary"
                                        onClick={() => navigate('/accountinfo')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* If setup is in progress (QR code showing) */}
                        {!mfaEnabled && setupUri && (
                            <div>
                                <p className="mfa-instructions">
                                    Scan this QR code with your authenticator app
                                    (like Google Authenticator or Microsoft Authenticator)
                                </p>
                                
                                <div className="mfa-qr-container">
                                    <QRCodeCanvas value={setupUri} size={200} />
                                </div>
                                
                                <p className="mfa-instructions">
                                    Or enter this setup code manually in your app:
                                </p>
                                
                                <div className="mfa-uri">
                                    {setupUri}
                                </div>
                                
                                <form onSubmit={handleTOTPVerification}>
                                    <div className="input-group">
                                        <label htmlFor="totpCode">Enter the verification code from your app:</label>
                                        <input
                                            id="totpCode"
                                            type="text"
                                            value={totpCode}
                                            onChange={(e) => setTotpCode(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="button-group">
                                        <button 
                                            type="submit" 
                                            className="mfa-button"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Verifying...' : 'Verify Code'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mfa-button secondary"
                                            onClick={() => navigate('/accountinfo')}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        {/* Error and success messages */}
                        {error && <div className="status-message error-message">{error}</div>}
                        {success && <div className="status-message success-message">{success}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MFASetup;