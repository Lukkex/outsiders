import '../App.css'; //global styles
import React from 'react';

const TextBlackBG = ({label}) => {
    return (
    <div>
        <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                <h1 class="rounded-3xl border-gray-600 border shadow-gray-800 shadow-lg text-white text-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl bg-gray-800 p-7 bg-opacity-80">
                    {label}</h1>
        </div>
    </div>
    );
}

export default TextBlackBG; //sends function when imported