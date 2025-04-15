import React, { useState, useEffect } from 'react';
import { getSubmittedFormsFromS3 } from '../../../services/formsApi';
import '../../Stylesheets/AdminDashboard.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import { useNavigate } from 'react-router-dom';
import { uploadData } from '@aws-amplify/storage';


function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchForms() {
            const allForms = await getSubmittedFormsFromS3();
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setUploadStatus("");
        } else {
            setUploadStatus("Only PDF files are allowed.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("Please select a file first.");
            return;
        }

        const key = `formtemplates/${selectedFile.name}`;
        try {
            await uploadData({
                key,
                data: selectedFile,
                options: { contentType: "application/pdf" }
            }).result;
            setUploadStatus(`Successfully uploaded: ${selectedFile.name}`);
            setSelectedFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus("Upload failed.");
        }
    };

    return (
        <SiteContainer content = {
          <div>
            <div className="admin-dashboard">
                <h1 className="dashboard-title">ADMIN DASHBOARD - VIEW SUBMITTED FORMS</h1>

                <div className="p-4 border rounded shadow max-w-md mx-auto mb-4">
                    <h2 className="text-xl font-semibold mb-2">Upload New Form</h2>
                    <input
                        data-testid="file-input" //jest testing
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="mb-2"
                    />
                    <button
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                    {uploadStatus && <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>}
                </div>

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
                            filteredForms.map((form, index) => (
                                <tr key={index}>
                                    <td>{form.formID}</td>
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
        }/>
    );
}

export default AdminDashboard;
