import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home';
import SignUp from './components/Pages/SignUp';
import SignIn from './components/Pages/SignIn';
import Settings from './components/Pages/Settings';
import Help from './components/Pages/Help';
import Registration from './components/Pages/User/Registration';
import Scheduling from './components/Pages/User/Scheduling';
import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import AdminScheduling from './components/Pages/Admin/AdminScheduling';
import ViewPlayers from './components/Pages/Admin/ViewPlayers';
import AccountInfo from './components/Pages/User/AccountInfo';
import CustomLoginPage from './components/Pages/CustomLoginPage';
import CustomRegistrationPage from './components/Pages/CustomRegistrationPage';
import { Amplify } from 'aws-amplify';

//import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';

// Configure Amplify once with awsExports
Amplify.configure(awsconfig);

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
          </Routes>
        </Router>
  );
}

export default App;