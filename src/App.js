import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import SignUp from './components/SignUp.js';
import SignIn from './components/SignIn.js';
import Settings from './components/Settings.js';
import Registration from './components/Registration.js';
import Scheduling from './components/Pages/User/Scheduling.js';
import SelectPrisonForm from './components/SelectPrisonForm.js';
import AdminDashboard from './components/AdminDashboard.js';
import AdminScheduling from './components/Pages/Admin/AdminScheduling.js';
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports.js';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function App() {
  return (

        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminscheduling" element={<AdminScheduling />} />
          </Routes>
        </Router>

  );
}

export default withAuthenticator(App);
