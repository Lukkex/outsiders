import React, { useState } from "react";
import "../../../Form.css";
import { submitForm } from "../../../services/formsApi"; 
import SiteHeader from "../../SiteHeader";

const FillForm = () => {
    const [selectedPrison, setSelectedPrison] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        reason: "",
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPrison || !formData.name || !formData.age || !formData.reason) {
            setSubmissionStatus("All fields are required.");
            return;
        }

        const success = await submitForm(selectedPrison, formData);
        setSubmissionStatus(success ? "Form submitted successfully!" : "Submission failed.");
    };

    return (
        <div className="site-container">
            <SiteHeader />
            <div className="main-container">
                <div className="form-container">
                    <h2 className="form-title">Fill Out Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Prison:</label>
                            <select 
                                value={selectedPrison} 
                                onChange={(e) => setSelectedPrison(e.target.value)}
                                className="form-control"
                                required
                            >
                                <option value="">Choose a prison</option>
                                <option value="Folsom">Folsom</option>
                                <option value="San Quentin">San Quentin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Age:</label>
                            <input 
                                type="number" 
                                name="age" 
                                value={formData.age} 
                                onChange={handleChange} 
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Reason for Submission:</label>
                            <textarea 
                                name="reason" 
                                value={formData.reason} 
                                onChange={handleChange} 
                                className="form-control"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="rounded-button">Submit</button>
                    </form>
                    {submissionStatus && <p className="status-message">{submissionStatus}</p>}
                </div>
            </div>
        </div>
    );
};

export default FillForm;
