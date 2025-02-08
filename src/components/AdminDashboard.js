import React, { useState, useEffect } from 'react';
import { getSubmittedForms, filterSubmittedForms } from '../services/formsApi';
import '../AdminDashboard.css';
import SiteHeader from './SiteHeader';

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    
    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedForms();
            setForms(allForms);
            setFilteredForms(allForms);
        }
        fetchForms();
    }, []);

    const handleFilterChange = async () => {
        const filtered = await filterSubmittedForms(prisonFilter, playerFilter);
        setFilteredForms(filtered);
    };

    const handleSort = () => {
        setFilteredForms(prevForms => [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    };

    return (
        <div>
            <SiteHeader />
            <div className="admin-dashboard">
                <h1>Admin Dashboard - View Submitted Forms</h1>
                <div className="filters">
                    <select onChange={(e) => setPrisonFilter(e.target.value)}>
                        <option value="">All Prisons</option>
                        <option value="Folsom">Folsom</option>
                        <option value="San Quentin">San Quentin</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="Search by Player" 
                        onChange={(e) => setPlayerFilter(e.target.value)} 
                    />
                    <button onClick={handleFilterChange}>Filter</button>
                    <button onClick={handleSort}>Sort by Most Recent</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Form ID</th>
                            <th>Prison</th>
                            <th>Player</th>
                            <th>Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredForms.map(form => (
                            <tr key={form.formID}>
                                <td>{form.formID}</td>
                                <td>{form.prison}</td>
                                <td>{form.player}</td>
                                <td>{new Date(form.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
