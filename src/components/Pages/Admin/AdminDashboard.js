import React, { useState, useEffect } from 'react';
import { getSubmittedFormsFromS3 } from '../../../services/getSubmittedFormsFromS3';
import { getUrl, uploadData } from 'aws-amplify/storage';
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
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadMessage, setUploadMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const formsPerPage = 15;

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
        setCurrentPage(1);
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
            const result = await getUrl({ path: s3Key, options: { expiresIn: 300 } });
            window.open(result.url, '_blank');
        } catch (error) {
            console.error("Error getting file URL:", error);
            alert("Could not retrieve the form. Please try again.");
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.type === 'application/pdf');

        if (validFiles.length !== files.length) {
            alert('Only PDF files are allowed.');
        }

        setSelectedFiles(validFiles);
    };

    const handleUpload = async () => {
        try {
            for (const file of selectedFiles) {
                const key = `formtemplates/${file.name}`;
                await uploadData({
                    path: key,
                    data: file,
                    contentType: 'application/pdf'
                }).result;
            }
            setUploadModalOpen(false);
            setUploadMessage(`${selectedFiles.length} file(s) uploaded successfully.`);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        }
    };

    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
    const totalPages = Math.ceil(filteredForms.length / formsPerPage);

    return (
        <SiteContainer content={
            <div>
                <div className="admin-dashboard">
                    <div className="filters flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search by name, form code, date, or email"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                value={searchTerm}
                                className="px-3 py-2 border rounded w-80"
                            />
                            <button onClick={handleSearch} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Filter</button>
                            <button onClick={handleSort} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Sort by Most Recent</button>
                            <button onClick={() => { setFilteredForms(forms); setSearchTerm(''); }} className="bg-sky-700 text-white px-3 py-2 rounded shadow">Clear</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setUploadModalOpen(true)}
                                className="bg-sky-700 text-white px-3 py-2 rounded shadow"
                            >
                                Upload Files
                            </button>
                            <button
                                onClick={() => window.location.href = '/viewplayers'}
                                className="bg-sky-700 text-white px-3 py-2 rounded shadow"
                            >
                                View Users
                            </button>
                        </div>
                    </div>

                    {uploadMessage && <p className="mt-2 text-green-700 font-medium">{uploadMessage}</p>}

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>FORM CODE</th>
                                <th style={{ width: '20%' }}>EVENT</th>
                                <th style={{ width: '10%', paddingLeft: '30px' }}>FIRST</th>
                                <th style={{ width: '10%' }}>LAST</th>
                                <th style={{ width: '25%' }}>EMAIL</th>
                                <th style={{ width: '20%' }}>SUBMISSION DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentForms.length > 0 ? (
                                currentForms.map((form, index) => (
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

                    <div className="flex justify-center items-center mt-4 gap-2 w-full">
                    <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="bg-sky-700 text-white px-3 py-1 rounded shadow"
                            disabled={currentPage === 1}
                        >
                            &larr;
                        </button>
                        <span className="px-4 py-1">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="bg-sky-700 text-white px-3 py-1 rounded shadow"
                            disabled={currentPage === totalPages}
                        >
                            &rarr;
                        </button>
                    </div>
                </div>

                {uploadModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/2 relative">
                            <button onClick={() => setUploadModalOpen(false)} className="absolute top-2 right-2 text-lg">✖</button>
                            <h2 className="text-xl font-bold mb-4">Upload PDF Files</h2>
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={handleFileSelect}
                                className="mb-4"
                            />
                            {selectedFiles.length > 0 && (
                                <ul className="mb-4 list-disc list-inside">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Upload
                            </button>
                        </div>
                    </div>
                )}
            </div>
        } />
    );
}

export default AdminDashboard;
