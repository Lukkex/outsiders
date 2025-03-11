import React from "react";
import { Link } from 'react-router-dom';
import '../components/Stylesheets/App.css'; //global styles
import SignOutButton from './SignOutButton.js';

function SiteHeader() {
    return (
        <div>
            <div className="w-full bg-cyan-700 bg-opacity-60">
                <Link to="/">
                    <img src="../images/outsidersinvert.png" className="logoimage py-3 md:flex" alt="Logo" />
                </Link>
            </div>
            
            <div className="site-header font-semibold bg-cyan-700 bg-opacity-60">
                <Link to="/"><button className="rounded-button cyan-gradient">HOME</button></Link>
                <Link to="/registration"><button className="rounded-button cyan-gradient">REGISTRATION</button></Link>
                <Link to="/scheduling"><button className="rounded-button cyan-gradient">SCHEDULING</button></Link>
                <div className="dropdown">
                    <button className="rounded-button cyan-gradient dropdown-button">ACCOUNT</button>
                    <div className="dropdown-content">
                        <Link to="/settings">Settings</Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteHeader; // Remove withAuthenticator