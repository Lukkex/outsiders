import React from "react";
import { Link } from 'react-router-dom';
import '../App.css'; //global styles

function SiteHeader() {
    return (
    <div>
        <div class="w-full bg-cyan-700 bg-opacity-60">
            <Link to="/"><img src="../images/outsidersinvert.png" class="logoimage py-3 md:flex" alt="Logo"></img></Link>
            </div>
            
            <div class="site-header font-semibold bg-cyan-700 bg-opacity-60">
                <Link to="/"><button class="rounded-button cyan-gradient">HOME</button></Link>
                <Link to="/registration"><button class="rounded-button cyan-gradient">REGISTRATION</button></Link>
                <Link to="/scheduling"><button class="rounded-button cyan-gradient">SCHEDULING</button></Link>
                <div class="dropdown">
                    <button class="rounded-button cyan-gradient dropdown-button">ACCOUNT</button>
                    <div class="dropdown-content">
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign up</Link>
                        <Link to="/settings">Settings</Link>
                    </div>
                </div>
            </div>
    </div>
    );
}

export default SiteHeader; //sends function when imported