import React, { useState, useEffect } from 'react';
import { getSubmittedFormsFromS3 } from '../../../services/getSubmittedFormsFromS3';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import '../../Stylesheets/AdminDashboard.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedFormsFromS3();
            setForms(allForms);
            setFilteredForms(allForms);
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
                    <h1 className="dashboard-title">ADMIN DASHBOARD - VIEW SUBMITTED FORMS</h1>

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
                                <th>FORM CODE</th>
                                <th>EVENT</th>
                                <th>FIRST NAME</th>
                                <th>LAST NAME</th>
                                <th>EMAIL</th>
                                <th>SUBMISSION DATE</th>
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
                                        <td>{form.firstName || '-'}</td>
                                        <td>{form.lastName || '-'}</td>
                                        <td>{form.email}</td>
                                        <td>{form.submittedAt ? new Date(form.submittedAt).toLocaleString() : '-'}</td>
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
