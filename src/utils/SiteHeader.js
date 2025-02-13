import React from "react";
import { Link } from 'react-router-dom';
import '../components/Stylesheets/App.css'; //global styles
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import CustomAuthenticator from './CustomAuthenticator.js';
import SignOutButton from './SignOutButton.js';

function SiteHeader() {
    return (
        <CustomAuthenticator content={
        
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
                            {/*<Link to="/signin">Sign In</Link>
                            {<Link to="/signup">Sign up</Link>}*/}
                            <Link to="/settings">Settings</Link>
                            <SignOutButton/>
                        </div>
                    </div>
                </div>
        </div>
        }>
        </CustomAuthenticator>

    );
}

export default withAuthenticator(SiteHeader); //sends function when imported