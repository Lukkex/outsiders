import React, { useState, useEffect } from 'react';
import { getSubmittedFormsFromS3 } from '../../../services/getSubmittedFormsFromS3';
import { getUrl } from 'aws-amplify/storage';
import '../../Stylesheets/AdminDashboard.css';
import SiteContainer from '../../../utils/SiteContainer.js';

function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedFormsFromS3();
            const formatted = allForms.map(form => ({
                ...form,
                firstName: capitalizeName(form.firstName || ''),
                lastName: capitalizeName(form.lastName || '')
            }));
            setForms(formatted);
            setFilteredForms(formatted);
        }
        fetchForms();
    }, []);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            setFilteredForms(forms);
            return;
        }

        const filtered = forms.filter(form =>
            `${form.firstName} ${form.lastName} ${form.email} ${form.formCode} ${form.submittedAt}`.toLowerCase().includes(term)
        );
        setFilteredForms(filtered);
    };

    const handleSort = () => {
        setFilteredForms(prevForms =>
            [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleFormDownload = async (s3Key) => {
        try {
            const result = await getUrl({
                path: s3Key,
                options: { expiresIn: 300 }
            });
            window.open(result.url, '_blank');
        } catch (error) {
            console.error("Error getting file URL:", error);
            alert("Could not retrieve the form. Please try again.");
        }
    };

    return (
        <SiteContainer content={
            <div>
                <div className="admin-dashboard">

                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search by name, form code, date, or email"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={searchTerm}
                            className="mr-2"
                        />
                        <button onClick={handleSearch}>Filter</button>
                        <button onClick={handleSort}>Sort by Most Recent</button>
                        <button onClick={() => { setFilteredForms(forms); setSearchTerm(''); }}>Clear</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>FORM CODE</th>
                                <th style={{ width: '20%' }}>EVENT</th>
                                <th style={{ width: '10%', paddingLeft: '30px' }}>FIRST NAME</th>
                                <th style={{ width: '10%' }}>LAST NAME</th>
                                <th style={{ width: '25%' }}>EMAIL</th>
                                <th style={{ width: '20%' }}>SUBMISSION DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredForms.length > 0 ? (
                                filteredForms.map((form, index) => (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFormDownload(form.s3Key);
                                                }}
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                {form.formCode || form.fileName}
                                            </a>
                                        </td>
                                        <td>{form.prison || '-'}</td>
                                        <td style={{ paddingLeft: '30px' }}>{form.firstName || '-'}</td>
                                        <td>{form.lastName || '-'}</td>
                                        <td>{form.email}</td>
                                        <td>
                                            {form.submittedAt
                                                ? new Date(form.submittedAt).toLocaleString('en-US', {
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })
                                                : '-'}
                                        </td>
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
        } />
    );
}

export default AdminDashboard;
