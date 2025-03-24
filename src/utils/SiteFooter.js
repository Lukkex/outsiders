import React from "react";
import { Link } from 'react-router-dom';

function SiteFooter() {
    return (
        <div>
            <div className="site-footer flex justify-center items-center space-x-10 site-header font-semibold cyan-gradient">
                <Link to="/aboutus">
                    <p>About Us</p>
                </Link>
                <Link to="/Help">
                    <p>Help</p>
                </Link>
            </div>
        </div>
    );
}

export default SiteFooter;
