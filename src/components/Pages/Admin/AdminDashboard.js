import React, { useState, useEffect, useRef } from 'react';
import { getSubmittedForms, filterSubmittedForms } from '../../../services/formsApi';
import '../../Stylesheets/AdminDashboard.css';
import SiteHeader from '../../../utils/SiteHeader';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [prisonFilter, setPrisonFilter] = useState('');
    const [playerFilter, setPlayerFilter] = useState('');
    const [hoverData, setHoverData] = useState({ text: '', x: 0, y: 0, visible: false, pinned: false });

    const hoverRef = useRef(null);

    useEffect(() => {
        // Dummy Data for Persistent Testing
        const dummyForms = [
            {
                formID: "ABC123456",
                prison: "Folsom",
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                submittedAt: "2024-02-22T14:30:00Z",
            },
            {
                formID: "XYZ789012",
                prison: "San Quentin",
                firstName: "Jane",
                lastName: "Smith",
                email: "janesmith@example.com",
                submittedAt: "2024-02-21T09:15:00Z",
            }
        ];

        setForms(dummyForms);
        setFilteredForms(dummyForms);

        async function fetchForms() {
            const allForms = await getSubmittedForms();
            if (allForms.length > 0) {
                setForms(allForms);
                setFilteredForms(allForms);
            }
        }

        fetchForms();
    }, []);

    const handleFilterChange = async () => {
        const filtered = await filterSubmittedForms(prisonFilter, playerFilter);
        setFilteredForms(filtered);
    };

    const handleSort = () => {
        setFilteredForms(prevForms =>
            [...prevForms].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        );
    };

    const navigate = useNavigate();

    const handleMouseEnter = (e, text) => {
        if (hoverData.pinned) return;
        const rect = e.target.getBoundingClientRect();
        setHoverData({
            text,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 5,
            visible: true,
            pinned: false
        });
    };

    const handleMouseLeave = () => {
        if (!hoverData.pinned) {
            setHoverData({ ...hoverData, visible: false });
        }
    };

    const handleClick = (e, text) => {
        e.stopPropagation(); 
        const rect = e.target.getBoundingClientRect();
        setHoverData({
            text,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 5,
            visible: true,
            pinned: true 
        });
    };

    const handleOutsideClick = (e) => {
        if (hoverRef.current && !hoverRef.current.contains(e.target)) {
            setHoverData({ ...hoverData, visible: false, pinned: false });
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

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
                    <button onClick={() => navigate('/viewplayers')}>View Players</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Form Code</th>
                            <th>Prison</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredForms.map(form => (
                            <tr key={form.formID}>
                                <td
                                    className="hoverable"
                                    onMouseEnter={(e) => handleMouseEnter(e, form.formID)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={(e) => handleClick(e, form.formID)}
                                >
                                    {form.formID}
                                </td>
                                <td>{form.prison}</td>
                                <td>{form.firstName}</td>
                                <td>{form.lastName}</td>
                                <td
                                    className="hoverable"
                                    onMouseEnter={(e) => handleMouseEnter(e, form.email)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={(e) => handleClick(e, form.email)}
                                >
                                    {form.email}
                                </td>
                                <td>{new Date(form.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {hoverData.visible && (
                    <div
                        ref={hoverRef}
                        className="hover-tooltip"
                        style={{ top: hoverData.y, left: hoverData.x }}
                    >
                        {hoverData.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
