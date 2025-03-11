import React, { useState } from 'react';
import '../../Stylesheets/App.css'; // Global styles
import '../../Stylesheets/Registration.css'; // Registration-specific styles
import SiteHeader from '../../../utils/SiteHeader'
import SignaturePad from 'react-signature-canvas'

function Registration() {
    const [selectedPrisons, setSelectedPrisons] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [step, setStep] = useState(1);
    const [needsSpecialForm, setNeedsSpecialForm] = useState(null); // Response to prompt after Folsom selection
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event) => {
    setInputValue(event.target.value);
}

    const prisons = ["Folsom State Prison", "San Quentin State Prison"];
    const forms = [
        { id: 1, name: "CDCR 2301 - Policy Information for Volunteers (Part A)", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 2, name: "CDCR 2301 - Policy Information for Volunteers (Part B)", prisons: ["Folsom State Prison"] },
        { id: 3, name: "CDCR 2311 - Background Security Clearance Application", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 4, name: "CDCR 2311-A - Criminal History Security Screening Form", prisons: [] },
        { id: 5, name: "CDCR PREA - Acknowledgement Form", prisons: ["Folsom State Prison"] },
        { id: 6, name: "CDCR 181 - Laws, Rules and Regulations", prisons: ["San Quentin State Prison"] },
        { id: 7, name: "CDCR 2189 - Incarcerated/Paroled Relative or Associate", prisons: ["Folsom State Prison"], requiresYes: true },
    ];

    const handlePrisonChange = (event) => {
        const value = event.target.value;
        setSelectedPrisons((prev) =>
            prev.includes(value) ? prev.filter((prison) => prison !== value) : [...prev, value]
        );

        // Reset special question if Folsom is unchecked
        if (value === "Folsom State Prison" && selectedPrisons.includes(value)) {
            setNeedsSpecialForm(null);
        }
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
        if (step === 2 && needsSpecialForm === null && selectedPrisons.includes("Folsom State Prison")) {
            alert("Please answer the required question.");
            return;
        }
        if (step === 1 && !selectedPrisons.includes("Folsom State Prison")) {
            setStep(step + 2);
            return;
        }
        if (step === 3 && selectedForms.length === 0) {
            alert("Please select at least one form.");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step === 3 && !selectedPrisons.includes("Folsom State Prison")) {
            setStep(step - 2);
            return;
        }
        if (step > 1) setStep(step - 1);
    };

    // Check if "Folsom State Prison" is selected
    const isFolsomSelected = selectedPrisons.includes("Folsom State Prison");

    // Filter available forms based on selected prisons & Yes/No response
    let availableForms = forms.filter((form) =>
        form.prisons.some((prison) => selectedPrisons.includes(prison))
    );

    // If "Yes" is not selected for the special form and Folsom is selected, remove it
    if (!(isFolsomSelected && needsSpecialForm === true)) {
        availableForms = availableForms.filter((form) => !form.requiresYes);
    }

    const [fileMap, setFileMap] = useState({}); // Stores selected files for each form

    const handleFileChange = (formId, event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            setFileMap((prev) => ({ ...prev, [formId]: file }));
        }
    };

    const handleSubmit = async () => {
        // Check if all forms have a file selected
        const allFormsHaveFiles = selectedForms.every((formId) => fileMap[formId]);

        if (!allFormsHaveFiles) {
            alert("Please select a file for each form before submitting.");
            return;
        }
        else {
            alert("Submitting...");
        }
        /*
        try {
            await Promise.all(
                selectedForms.map((formId) => {
                    const file = fileMap[formId];
                    return uploadFileToS3(file, `uploads/${file.name}`); // Adjust the S3 path as needed
                })
            );
            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error uploading files. Please try again.");
        }
        */

    };

    return (
        <div>
            <SiteHeader />
            <br />
            <br />
            <br />
            <div className="signup-container">
                <h1 className="font-semibold">Registration</h1>
                <br></br>
                <div className="form-container">
                    {step === 1 && (
                        <div>
                            <h2 className="font-semibold">Select Prison(s)</h2>
                            <br></br>
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
                    
                    {/* Step 2: Ask Special Question if Folsom is selected */}
                    {step === 2 && isFolsomSelected && (
                        <div>
                            <h2 className="font-semibold">Notice</h2>
                            <h3>In accordance with the California Department of Corrections and Rehabilitation (CDCR) California Code of Regulations, Title 15 Section 3406, and Department Operations Manual Section 33010.25.1, CDCR 2189 must be completed each time an employee becomes aware of a relative or person with whom the employee has/had a personal or business relationship who has been committed or transferred to the jurisdiction of CDCR. Do you know anyone who has been incarcerated or is on parole in the CDCR system?</h3>
                            <br></br>
                            <label>
                                <input
                                    type="radio"
                                    name="specialForm"
                                    value="yes"
                                    onChange={() => setNeedsSpecialForm(true)}
                                    checked={needsSpecialForm === true}
                                />
                                &nbsp;Yes
                            </label>
                            <br></br><br></br>
                            <label>
                                <input
                                    type="radio"
                                    name="specialForm"
                                    value="no"
                                    onChange={() => setNeedsSpecialForm(false)}
                                    checked={needsSpecialForm === false}
                                />
                                &nbsp;No
                            </label>
                        </div>
                    )}

                    {/* Step 3: Form Selection AFTER Question */}
                    {step === 3 && (
                        <div>
                            <h2 className="font-semibold">Select Required Forms to Upload</h2>
                            <br></br>
                            {availableForms.length > 0 ? (
                                availableForms.map((form) => (
                                    <div key={form.id} className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            value={form.id}
                                            onChange={handleFormChange}
                                            checked={selectedForms.includes(form.id)}
                                        />
                                        <label>{form.name}</label>
                                    </div>
                                ))
                            ) : (
                                <p>No forms available for the selected prison(s).</p>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="font-semibold">Review & Submit</h2>
                            <p>
                                <strong>Selected Prisons:</strong> {selectedPrisons.join(", ")}
                            </p>
                            <br></br>
                            <p>
                                <strong>Selected Forms</strong>
                            </p>
                            <div className={"max-h-80 overflow-y-auto border p-2 rounded"}>
                                {forms
                                    .filter((form) => selectedForms.includes(form.id))
                                    .map((form) => (
                                        <div key={form.id} className="flex items-center justify-between border-b p-2">
                                            <span>{form.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(event) => handleFileChange(form.id, event)}
                                                    className="hidden"
                                                    id={`file-upload-${form.id}`}
                                                />
                                                <label
                                                    htmlFor={`file-upload-${form.id}`}
                                                    className="rounded-button"
                                                >
                                                    {fileMap[form.id] ? "Change File" : "Upload"}
                                                </label>
                                                {fileMap[form.id] && <span className="text-sm">{fileMap[form.id].name}</span>}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <t className="font-bold">E-Signature: </t>
                            <input 
                                type="text" 
                                variant="outlined"
                                value={inputValue} 
                                onChange={handleInputChange} 
                                placeholder="Enter Full Name" 
                                 />
                                 <t className="font-nobold"></t>
                                 <t className="font-bold">Signature: </t>
                                <SignaturePad penColor='Black'
                                canvasProps={{width: 350, height: 200, className: 'sigCanvas'}}
                                />
                            <button className="rounded-button mt-3" onClick={handleSubmit}>
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
                    {step < 4 && (
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