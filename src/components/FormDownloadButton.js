import React from 'react';
import '../AdminDashboard.css';
import test from '../public/testFile.pdf';

function downloadForm () {
    return (
    <div className='h-[100vh] flex justify center items-center'> 
        <button className='bg-slate-400 px-6 py-2 rounded'>
            <a href={test} download='test'>Download</a>
        </button>
    </div>

    );
}

export default downloadForm

//The rest of this code is in the AdminDashboard.js