import React from "react";
import { Link } from 'react-router-dom';
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

function SiteContainer({content}) {
    return (
        <div className="site-container flex flex-col min-h-screen">
            <header className="w-full">
                <SiteHeader />
            </header>
            <main className="flex-1 pb-[80px]">
                {content}
            </main>
            <footer className="w-full">
                <SiteFooter />
            </footer>
        </div>
    );
}

export default SiteContainer;
