import React, { useState } from 'react';
import '../Stylesheets/AssociatedForms.css';

const AssociatedForms = ({ prison }) => {
    const [formData, setFormData] = useState({}); // Store form data for the prison

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => field === '')) {
            alert('Please fill out all fields before proceeding.');
            return;
        }
        alert('Form submitted successfully!');
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h1>Form for {prison}</h1>
            <div className="form-group">
                <label htmlFor="field1">Field 1:</label>
                <input
                    type="text"
                    id="field1"
                    name="field1"
                    value={formData.field1 || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="field2">Field 2:</label>
                <input
                    type="text"
                    id="field2"
                    name="field2"
                    value={formData.field2 || ''}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default AssociatedForms;
