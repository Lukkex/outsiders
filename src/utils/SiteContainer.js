import React from "react";
import { Link } from 'react-router-dom';
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

function SiteContainer({content}) {
    return (
        <div class = "site-container w-[100%]">
            <div className = "flex flex-col min-h-screen">
                <header className="w-[100%]">
                    <SiteHeader/>
                </header>
                <main className = "flex-1">
                    {content}
                </main>
                <footer className = "w-[100%]">
                    <SiteFooter/>
                </footer>
            </div>
        </div>
    );
}

export default SiteContainer;
