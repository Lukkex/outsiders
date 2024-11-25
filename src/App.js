import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Settings from './components/Settings';
import Registration from './components/Registration';
import Scheduling from './components/Scheduling';
import SelectPrisonForm from './components/SelectPrisonForm';


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
      </Routes>
    </Router>
  );
}

export default App;
