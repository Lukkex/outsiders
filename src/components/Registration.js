import React, { useState } from 'react';
import '../App.css'; // Global styles
import '../Registration.css'; // Registration-specific styles
import SiteHeader from './SiteHeader';

function Registration() {
    const [selectedPrisons, setSelectedPrisons] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [step, setStep] = useState(1);

    const prisons = ["Folsom State Prison", "San Quentin State Prison"];
    const forms = [
        { id: 1, name: "CDCR 2311-A Authorization Form" },
        { id: 2, name: "CDCR 2189 - Relative/Associate Notification" },
        { id: 3, name: "CDCR 181 - Laws and Rules (2023)" },
        { id: 4, name: "CDCR 2301 ADA Policy Form" },
    ];

    const handlePrisonChange = (event) => {
        const value = event.target.value;
        setSelectedPrisons((prev) =>
            prev.includes(value) ? prev.filter((prison) => prison !== value) : [...prev, value]
        );
    };

    const handleFormChange = (event) => {
        const value = parseInt(event.target.value);
        setSelectedForms((prev) =>
            prev.includes(value) ? prev.filter((form) => form !== value) : [...prev, value]
        );
    };

    const handleNext = () => {
        if (step === 1 && selectedPrisons.length === 0) {
            alert("Please select at least one prison.");
            return;
        }
        if (step === 2 && selectedForms.length === 0) {
            alert("Please select at least one form.");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div>
            <SiteHeader />
            <br />
            <br />
            <br />
            <div className="signup-container">
                <h1 className="font-semibold">Registration</h1>
                <div className="form-container">
                    {step === 1 && (
                        <div>
                            <h2 className="font-semibold">Select Prison(s)</h2>
                            {prisons.map((prison, index) => (
                                <div key={index} className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        value={prison}
                                        onChange={handlePrisonChange}
                                        checked={selectedPrisons.includes(prison)}
                                    />
                                    <label>{prison}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h2 className="font-semibold">Select Forms</h2>
                            {forms.map((form) => (
                                <div key={form.id} className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        value={form.id}
                                        onChange={handleFormChange}
                                        checked={selectedForms.includes(form.id)}
                                    />
                                    <label>{form.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <h2 className="font-semibold">Review & Submit</h2>
                            <p>
                                <strong>Selected Prisons:</strong> {selectedPrisons.join(", ")}
                            </p>
                            <p>
                                <strong>Selected Forms:</strong>{" "}
                                {forms
                                    .filter((form) => selectedForms.includes(form.id))
                                    .map((form) => form.name)
                                    .join(", ")}
                            </p>
                            <button className="rounded-button" onClick={() => alert("Submitting...")}>
                                Submit
                            </button>
                        </div>
                    )}
                </div>
                <div className="navigation-buttons">
                    {step > 1 && (
                        <button className="rounded-button" onClick={handleBack}>
                            Back
                        </button>
                    )}
                    {step < 3 && (
                        <button className="rounded-button" onClick={handleNext}>
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Registration;
