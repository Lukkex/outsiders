import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { UserProvider } from './context/UserContext';

import PrivateRoute from './utils/PrivateRoute';
import SignedOutRoute from './utils/SignedOutRoute';

import Home from './components/Pages/Home';
import AccessDenied from './components/Pages/AccessDenied';
import Settings from './components/Pages/Settings';
import ChangePassword from './components/Pages/ChangePassword';
import Help from './components/Pages/Help';
import AboutUs from './components/Pages/AboutUs';
import Registration from './components/Pages/User/Registration';
import Scheduling from './components/Pages/User/Scheduling';
import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import AdminScheduling from './components/Pages/Admin/AdminScheduling';
import AccountInfo from './components/Pages/User/AccountInfo';
import CustomLoginPage from './components/Pages/CustomLoginPage';
import CustomRegistrationPage from './components/Pages/CustomRegistrationPage';
import CustomSignUpConfirmation from './components/Pages/CustomSignUpConfirmation';
import MFASetup from './components/Pages/User/MFASetup';
import UserAccountDeletion from './components/Pages/User/UserAccountDeletion';
import ViewPlayers from './components/Pages/Admin/ViewPlayers';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  ...awsExports,
  Storage: {
    AWSS3: {
      bucket: awsExports.aws_user_files_s3_bucket,
      region: awsExports.aws_user_files_s3_bucket_region,
    },
  },
});

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignedOutRoute content={<Home />} />} />
          <Route path="/access-denied" element={<SignedOutRoute content={<AccessDenied />} />} />
          <Route path="/signup" element={<CustomRegistrationPage />} />
          <Route path="/login" element={<CustomLoginPage />} />
          <Route path="/settings" element={<SignedOutRoute content={<Settings />} />} />
          <Route path="/help" element={<SignedOutRoute content={<Help />} />} />
          <Route path="/aboutus" element={<SignedOutRoute content={<AboutUs />} />} />
          <Route path="/registration" element={<SignedOutRoute content={<Registration />} />} />
          <Route path="/scheduling" element={<SignedOutRoute content={<Scheduling />} />} />
          <Route path="/admindashboard" element={<PrivateRoute content={<AdminDashboard />} redirectPage="/access-denied" />} />
          <Route path="/adminscheduling" element={<PrivateRoute content={<AdminScheduling />} redirectPage="/access-denied" />} />
          <Route path="/accountinfo" element={<SignedOutRoute content={<AccountInfo />} />} />
          <Route path="/changepassword" element={<SignedOutRoute content={<ChangePassword />} />} />
          <Route path="/setup-mfa" element={<MFASetup />} />
          <Route path="/confirm-signup" element={<CustomSignUpConfirmation />} />
          <Route path="/useraccountdeletion" element={<UserAccountDeletion />} />
          <Route path="/viewplayers" element={<ViewPlayers />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
