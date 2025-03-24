import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import SignedOutRoute from './utils/SignedOutRoute';
import AccessDenied from './components/Pages/AccessDenied';
import Home from './components/Pages/Home';
import Settings from './components/Pages/Settings';
import ChangePassword from './components/Pages/ChangePassword';
import Help from './components/Pages/Help';
import AboutUs from './components/Pages/AboutUs';
import Registration from './components/Pages/User/Registration';
import Scheduling from './components/Pages/User/Scheduling';
import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import AdminScheduling from './components/Pages/Admin/AdminScheduling';
import ViewPlayers from './components/Pages/Admin/ViewPlayers';
import AccountInfo from './components/Pages/User/AccountInfo';
import CustomLoginPage from './components/Pages/CustomLoginPage';
import CustomRegistrationPage from './components/Pages/CustomRegistrationPage';
import CustomSignUpConfirmation from './components/Pages/CustomSignUpConfirmation';
import MFASetup from './components/Pages/User/MFASetup';
import { Amplify } from 'aws-amplify';

//import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsmobile from './aws-exports';

// Configure Amplify once with awsExports
Amplify.configure(awsmobile);

function App() {
  return (
 <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<CustomRegistrationPage />} />
            <Route path="/login" element={<CustomLoginPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminscheduling" element={<AdminScheduling />} />
            <Route path="/viewplayers" element={<ViewPlayers />} />
            <Route path="/accountinfo" element={<AccountInfo />} />
            <Route path="/setup-mfa" element={<MFASetup />} />
            <Route path="/confirm-signup" element={<CustomSignUpConfirmation />} />
            
          </Routes>
        </Router>
  );
}

export default App;