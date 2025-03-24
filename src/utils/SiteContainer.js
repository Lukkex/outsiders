import React from "react";
import { Link } from 'react-router-dom';
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

function SiteContainer({content}) {
    return (
        <div className = "flex flex-col min-h-screen">
            <header className=""> 
                <SiteHeader/>
            </header>
            <main className = "flex-1">
                {content}
            </main>
            <footer className = "">
                <SiteFooter/>
            </footer>
        </div>
    );
}

export default SiteContainer;
