import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SignOutButton from './SignOutButton.js';

function SiteHeader() {
    const { userInfo, loading } = useUser();

    if (loading) return null; // Prevent initial flicker
    if (!userInfo) return null; 

    const schedLink = userInfo?.role.includes("admin") ? "/adminscheduling" : "/scheduling";
    const homeLink = userInfo?.role.includes("admin") ? "/admindashboard" : "/";
    //const schedTitle = userInfo?.role.includes("admin") ? "FORMS" : "REGISTRATION";
    const homeTitle = userInfo?.role.includes("admin") ? "ADMIN DASH" : "HOME";

    return (
        <div>
            <div className="w-[100%] bg-cyan-700 bg-opacity-60">
                <Link to="/">
                    <img src="../images/outsidersinvert.png" className="logoimage py-3 md:flex" alt="Logo" />
                </Link>
            </div>
            
            <div className="site-header font-semibold bg-cyan-700 bg-opacity-60">
                <Link to={homeLink}><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">{homeTitle}</button></Link>
                <Link to="/registration"><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">FORMS</button></Link>
                <Link to={schedLink}><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">SCHEDULING</button></Link>
                
                <div className="dropdown">
                    <button className="rounded-button cyan-gradient dropdown-button xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">ACCOUNT</button>
                    <div className="dropdown-content">
                        <Link to="/settings">Settings</Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteHeader;
