import '../Stylesheets/App.css';
import '@aws-amplify/ui-react/styles.css';
import '../Stylesheets/AboutUs.css';
import SiteContainer from '../../utils/SiteContainer.js';
import FadeInSection from '../../utils/FadeInSection.js';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
    useEffect(() => {
        // This effect runs whenever the component mounts or updates
        const hash = window.location.hash; // Get the current URL hash
        if (hash) {
            const targetElement = document.querySelector(hash); // Find the element with that ID
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the element
            }
        }
    }, []);

    return (
        <SiteContainer class = "w-[100vw]" content = {
            <FadeInSection>
                <div className="AboutUs">
                    <br/>
                    <br/>
                    <div className = "shortcut-buttons-container flex justify-center items-center">
                        <div className="justify-center text-white text-center text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            <a href="#AboutUs">About Us!</a>
                        </div>
                        <div className="justify-center text-white text-center text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            <a href="#FAQ">FAQs</a>
                        </div>
                        <div className="justify-center text-white text-center text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            <a href="#Contact">Contact</a>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br id = "AboutUs"/>
                    <div class = "content-section flex items-center">
                        <div class = "w-1/2 flex justify-center">
                            <img class = "" src="/images/teamphoto2.jpg"/>
                        </div>
                        <div class = "w-1/2 p-20 font-sarif text-2xl">
                            <p>The Outsiders are a volunteer soccer program that competes against the inmate teams in various prisons across California. <br/><br/> Soccer has been played on the yard for decades and the Outsiders are the most frequent opponent for the host team(s).</p>
                            <br/>
                            <p>With almost a hundred men across two rosters, we have players of varying ages, backgrounds and abilities. We bring in rotating line-ups of fifteen players on a fortnightly and monthly basis depending on which team is playing. We play 11-a-side games on the yard itself.</p>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br/>

                    <div class = "content-section flex items-center">
                        <div class = "w-1/2 p-20 font-sarif text-2xl">
                            <p>The Sacramento branch of the Outsiders plays at Sacramento State Prison in Folsom. <br/> <br/> The team plays once a month on a Saturday (9 &#8211; 1 pm) and is open to players of all ages and abilities.</p>
                            <br/> 
                            <p><strong>**PLEASE NOTE**</strong>: Although we are always looking for new players, everyone must be processed on a game-by-game basis. <br/> <br/> Part of this processing requires submitting information such as your driving license and social security number. <br/> <br/> Whilst all data is handled <em><u>extremely</u></em> securely, this requirement is non-negotiable and standard practice for all CSP-SAC volunteer programs.</p>
                        </div>

                        <div class = "w-1/2 flex justify-center">
                            <img class = "" src="/images/teamphoto3.png"/>
                        </div>
                    </div>

                    <br/>
                    <br/>
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br/>

                    <div class = "content-section flex items-center">
                        <div class = "w-1/2 flex justify-center">
                            <img class = "" src="/images/teamphoto4.jpg"/>
                        </div>

                        <div class = "w-1/2 p-20 font-sarif text-2xl">
                            <p>The Outsiders branch in San Francisco plays at San Quentin Prison every fortnight (Saturdays, 12:30 &#8211; 3pm). <br/><br/> The team has a roster of roughly fifty players of varying ages and abilities, but is open to new players.</p>
                        </div>
                    </div>

                    <br/>
                    <br/>
                    
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br id = "FAQ"/>

                    <div className = "flex justify-center items-center">
                        <div className="content-section justify-center text-white text-center text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                            
                            <p>FAQs</p>
                        </div>
                    </div>
                    <br/>
                    <br/>

                    <div class = "FAQs p-20 font-sarif justify-center text-white text-xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                        <p class = "text-2xl"><strong><u>What is the standard of play like among the prison teams?</u></strong></p>
                        <br/>
                        <p>The standard of play is equivalent to a good high school program. A few of the inmate team have played at a higher level and everyone is in good shape so the games are very competitive.</p>
                        <br/><br/>
                        <p class = "text-2xl"><strong><u>What is the standard of play like for the Outsiders team?</u></strong></p>
                        <br/>
                        <p>The current roster is a mix of rec league players, college players from the D1, D2 and D3 levels as well as former professionals. So long as you played at the high school level (or there about) and are enthused about soccer, you’ll fit in just fine.</p>
                        <br/><br/>
                        <p class = "text-2xl"><strong><u>How long does the season last?</u></strong></p>
                        <br/>
                        <p>The SQ soccer season goes from March until November.</p>
                        <br/><br/>
                        <p class = "text-2xl"><strong><u>When do games get played?</u></strong></p>
                        <br/>
                        <p>Most games take place on a Saturday afternoon. Once the SFSFL leagues end in the fall, the San Francisco branch of the Outsiders play a couple of Sunday games as well.</p>
                        <br/><br/>
                        <p class = "text-2xl"><strong><u>What is the commitment required for the Outsiders?</u></strong></p>
                        <br/>
                        <p>Some players play every fortnight, some play once or twice a year. So long as you reply to availability requests in a timely fashion and make those games, we find a way to get everyone involved.</p>
                        <br/><br/>
                        <p class = "text-2xl"><strong><u>Can women play for the Outsiders?</u></strong></p>
                        <br/>
                        <p>No. Whilst we have a number of female players who help coach and manage the Outsider teams, we are not able to field women in the games themselves.</p>
                    </div>

                    <br/>
                    <br/>
                    
                    
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br id = "Contact"/>

                    <div>
                        <div className = "flex justify-center items-center">
                            <div className="content-section justify-center text-white text-center text-3xl cyan-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-cyan-900 bg-cyan-600">
                                
                                <p>Contact</p>
                            </div>
                        </div>
                        <br/>
                        <div class = "content-section p-20 font-sarif text-center justify-center text-xl">
                            <p>Support email: OutsidersDevTeam@outlook.com</p>
                        </div>
                    </div>
                    <div class="w-[100vw] border-t-2 border-gray-400 my-4"/>
                    <br/>
                    <br/>

                    <div class = "content-section flex justify-center">
                        <img class = "" src="/images/teamphoto5.jpg"/>
                    </div>
                    
                    <br/>
                    <br/>

                    <div class = "text-center content-section p-5 font-sarif text-3xl cyan-gradient text-white">
                        <p>We look forward to seeing you out there on the field!</p></div>  

                    <br/>
                    <br/>
                </div>
            </FadeInSection>
           
        }/>
    );
  }

  export default AboutUs;