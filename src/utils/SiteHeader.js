import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SignOutButton from './SignOutButton.js';

function SiteHeader() {
    const { userInfo, loading } = useUser();

    if (loading) return null; // Prevent initial flicker
    if (!userInfo) return null; 

    const schedPage = userInfo?.role.includes("admin") ? "/adminscheduling" : "/scheduling";

    return (
        <div>
            <div className="w-full bg-cyan-700 bg-opacity-60">
                <Link to="/">
                    <img src="../images/outsidersinvert.png" className="logoimage py-3 md:flex" alt="Logo" />
                </Link>
            </div>
            
            <div className="site-header font-semibold bg-cyan-700 bg-opacity-60">
                <Link to="/"><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">HOME</button></Link>
                {!userInfo.role.includes("admin") ? (
                    <Link to="/registration"><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">REGISTRATION</button></Link>
                ) : (
                    <Link to="/admindashboard"><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">ADMIN DASH</button></Link>
                )}
                <Link to={schedPage}><button className="rounded-button cyan-gradient xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl">SCHEDULING</button></Link>
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
