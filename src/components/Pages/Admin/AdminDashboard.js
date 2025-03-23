import React, { useState, useEffect } from 'react';
import { getSubmittedForms } from '../../../services/formsApi';
import '../../Stylesheets/AdminDashboard.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedForms();
            setForms(allForms);
            setFilteredForms(allForms);
        }
        fetchForms();
    }, []);

    const handleFilterChange = () => {
        let filtered = forms;
        if (prisonFilter) {
            filtered = filtered.filter(form => form.prison === prisonFilter);
        }
        if (playerFilter) {
            filtered = filtered.filter(form =>
                `${form.firstName} ${form.lastName}`.toLowerCase().includes(playerFilter.toLowerCase())
            );
        }
        setFilteredForms(filtered);
    };

    const handleSort = () => {
        setFilteredForms(prevForms =>
            [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        );
    };

    return (
        <SiteContainer content = {
            <div>
                <div className="admin-dashboard">
                    <h1 className="dashboard-title">ADMIN DASHBOARD - VIEW SUBMITTED FORMS</h1>
                    
                    {/* Filter Controls */}
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
                        <button onClick={() => navigate('/viewplayers')}>View Players</button>
                    </div>

                    {/* Table for Displaying Data */}
                    <table>
                        <thead>
                            <tr>
                                <th>FORM CODE</th>
                                <th>PRISON</th>
                                <th>FIRST NAME</th>
                                <th>LAST NAME</th>
                                <th>EMAIL</th>
                                <th>SUBMISSION DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredForms.length > 0 ? (
                                filteredForms.map(form => (
                                    <tr key={form.formID}>
                                        <td>{form.formID}</td>
                                        <td>{form.prison}</td>
                                        <td>{form.firstName}</td>
                                        <td>{form.lastName}</td>
                                        <td>{form.email}</td>
                                        <td>{new Date(form.submittedAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No forms found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        }/>
    );
}

export default AdminDashboard;
