import React, { useState, useEffect } from 'react';
import '../../Stylesheets/App.css'; // Global styles
import '../../Stylesheets/Registration.css'; // Registration-specific styles
import '../../Stylesheets/SignUp.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import SignaturePad from 'react-signature-canvas'
import { useRef } from 'react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { getCurrentUserInfo, getUserRole } from '../../../services/authConfig';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getFormattedDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var date = yyyy + "_" + mm + "_" + dd;
    return date;
}

function Registration() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewFileTest, setPreviewFileTest] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const sigCanvas = useRef({});
    const handleClear = () => {sigCanvas.current.clear();}
    const applySignature = () => {

    };
    const [selectedPrisons, setSelectedPrisons] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [step, setStep] = useState(1);
    const [needsSpecialForm, setNeedsSpecialForm] = useState(null); // Response to prompt after Folsom selection
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event) => {
    setInputValue(event.target.value);
    }

    /*
    useEffect(() => {
        const fetchPrisons = async () => {
            const user = await getCurrentUserInfo();
            let prisons = JSON.parse(localStorage.getItem(`userPrisons_${user.sub}`)) || [];
            if (prisons.length === 0){}
            else {
                setSelectedPrisons(prisons);
                setStep(2);
            }
        };
    
        fetchPrisons();
    }, []);
    */

    useEffect(() => {
        // Get forms related to selected prisons
        let relevantForms = forms.filter((form) =>
            form.prisons.some((prison) => selectedPrisons.includes(prison))
        );
    
        // Remove the special form if "Yes" isn't selected
        if (!(selectedPrisons.includes("Folsom State Prison") && needsSpecialForm === true)) {
            relevantForms = relevantForms.filter((form) => !form.requiresYes);
        }
    
        setSelectedForms(relevantForms.map((form) => form.id));
    }, [selectedPrisons, needsSpecialForm]);
    
    const getFormNameById = (formId) => {
        const form = forms.find((form) => form.id === formId);
        return form ? form.name : "Unknown Form";
    };

    const getSignatureLocationById = (formId) => {
        const form = forms.find((form) => form.id === formId);
        return form ? form.sigloc : "Unknown Form";
    };

    const getSignaturePageById = (formId) => {
        const form = forms.find((form) => form.id === formId);
        return form ? form.sigpage : "Unknown Form";
    };

    const prisons = ["Folsom State Prison", "San Quentin State Prison"];
    const forms = [
        { id: 1, fileKey:"CDCR_2301_A.pdf", sigpage: 1, sigloc: {x: 70, y: 390, width:81, height:27}, name: "CDCR 2301 - Policy Information for Volunteers (Part A)", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 2, fileKey:"CDCR_2301_B.pdf", sigpage: 0, sigloc: {x: 25, y: 205, width:81, height:27}, name: "CDCR 2301 - Policy Information for Volunteers (Part B)", prisons: ["Folsom State Prison"] },
        { id: 3, fileKey:"CDCR_2311.pdf", sigpage: 0, sigloc: {x: 165, y: 65, width:81, height:27}, name: "CDCR 2311 - Background Security Clearance Application", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 4, fileKey:"CDCR_2311_A.pdf", sigpage: 0, sigloc: {x: 75, y: 550, width:90, height:30}, name: "CDCR 2311-A - Criminal History Security Screening Form", prisons: [] },
        { id: 5, fileKey:"CDCR_PREA.pdf", sigpage: 0, sigloc: {x: 75, y: 550, width:90, height:30}, name: "CDCR PREA - Acknowledgement Form", prisons: ["Folsom State Prison"] },
        { id: 6, fileKey:"CDCR_181.pdf", sigpage: 0, sigloc: {x: 225, y: 32, width:90, height:30}, name: "CDCR 181 - Laws, Rules and Regulations", prisons: ["San Quentin State Prison"] },
        { id: 7, fileKey:"CDCR_2189.pdf", sigpage: 0, sigloc: {x: 40, y: 375, width:81, height:27}, name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate", prisons: ["Folsom State Prison"], requiresYes: true },
    ];

    const fillSignature = async (file, canvas, sigloc, sigpage) => { //Changed it so that an Admin can't change downloaded forms from dashboard -Christian
        const pdfUrl = URL.createObjectURL(file);
    
        // Load existing PDF
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
        // Flatten form fields to make PDF non-editable
        const form = pdfDoc.getForm();
        form.flatten();
    
        const page = pdfDoc.getPages()[sigpage];
    
        // Convert signature to embedded image
        const signatureImage = await pdfDoc.embedPng(canvas);
        const { width, height } = page.getSize();
    
        // Draw signature on a specific position
        page.drawImage(signatureImage, sigloc);
    
        const updatedPdfBytes = await pdfDoc.save();
    
        /*
        const updatedPdfBlob = new Blob([updatedPdfBytes], { type: "application/pdf" });
        const updatedPdfUrl = URL.createObjectURL(updatedPdfBlob);
        setPreviewFileTest(updatedPdfUrl);
        setShowPreview(true);
        while (showPreview) {}
        */
    
        return updatedPdfBytes;
    }

    const downloadForm = async (fileKey) => {
        try {
            const getUrlResult = await getUrl({
                path: `formtemplates/${fileKey}`,
                // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                options: {
                validateObjectExistence: false,  // Check if object exists before creating a URL
                expiresIn: 20, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                useAccelerateEndpoint: false // Whether to use accelerate endpoint
                },
            });
            console.log('signed URL: ', getUrlResult.url);
            console.log('URL expires at: ', getUrlResult.expiresAt);

            setFileUrl(getUrlResult.url); // Set the file URL to display in the iframe
            setShowModal(true); // Show the modal
            //window.open(getUrlResult.url);

        } catch (error) {
            console.error("Error downloading form:", error);
        }
    };

    const uploadFiles = async () => {

        if (selectedForms.length === 0) {
            alert("No forms selected for upload.");
            return;
        }
    
        try {
            var signatureDataUrl;
    
            if (!sigCanvas.current.isEmpty()) {
                // Get signature as base64 image
                signatureDataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
            } else {
                console.error("Signature data not found");
            }
    
            const user = await getCurrentUserInfo();
    
            const uploadPromises = selectedForms.map(async (formId) => {
                var file = fileMap[formId];
                const rawFirst = user.given_name || '';
                const rawLast = user.family_name || '';
    
                const capitalizedFirst = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase();
                const capitalizedLast = rawLast.charAt(0).toUpperCase() + rawLast.slice(1).toLowerCase();
    
                const safeFirst = capitalizedFirst.replace(/[^a-z0-9]/gi, '');
                const safeLast = capitalizedLast.replace(/[^a-z0-9]/gi, '');
                const filename = `${getFormNameById(formId)} - ${safeFirst}_${safeLast}`;                
                const signatureLocation = getSignatureLocationById(formId);
                const signaturePage = getSignaturePageById(formId);
    
                if (!file) {
                    throw new Error(`No file selected for form ID: ${formId}`);
                }
    
                file = await fillSignature(file, signatureDataUrl, signatureLocation, signaturePage);
    
                //end of file formatting, start of file upload
    
                const formattedDate = getFormattedDate(); // Generate date for folder structure
                const filePath = `uploads/${user.email}/${formattedDate}/${filename}.pdf`; // Organize by date
    
                // This part is to get the names from the forms -Christian
                const attributes = await getCurrentUserInfo();
    
                const firstName = capitalizedFirst || '-';
                const lastName = capitalizedLast || '-';
    
                const metadata = {
                    firstName,
                    lastName,
                    email: user.email
                };
    
                console.log("Uploading with metadata:", metadata);
    
                const privateResult = await uploadData({
                    path: filePath,
                    data: file,
                    contentType: 'application/pdf',
                    options: {
                        accessLevel: 'private',
                        metadata
                    }
                }).result;
    
                const publicResult = await uploadData({ //Uploads to a second folder that allows me to pull to the dashboard -Christian
                    path: `public/${filePath}`,
                    data: file,
                    contentType: 'application/pdf',
                    options: {
                        accessLevel: 'public',
                        metadata
                    }
                }).result;
    
                console.log(`File uploaded: ${filename}`);
                return { privateResult, publicResult };
    
            });
    
            await Promise.all(uploadPromises);
            setIsSubmitting(false);
    
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error uploading files. Please try again.");
        }
    };
    

    const handlePrisonChange = (event) => {
        const value = event.target.value;
        const updatedPrisons = selectedPrisons.includes(value)
            ? selectedPrisons.filter((prison) => prison !== value)
            : [...selectedPrisons, value];
    
        setSelectedPrisons(updatedPrisons);
    
        // Reset special question if Folsom is unchecked
        if (value === "Folsom State Prison" && selectedPrisons.includes(value)) {
            setNeedsSpecialForm(null);
        }
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
        if (step === 2 && needsSpecialForm !== null) {
            setStep(step + 2)
            return;
        }
        if (step === 1 && !selectedPrisons.includes("Folsom State Prison")) {
            setStep(step + 3);
            return;
        }
        /*
        if (step === 3 && selectedForms.length === 0) {
            alert("Please select at least one form.");
            return;
        }
        */
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step === 4 && !selectedPrisons.includes("Folsom State Prison")) {
            setStep(step - 3);
            return;
        }
        if (step === 4 && selectedPrisons.includes("Folsom State Prison")) {
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
        if (isSubmitting) return;

        // Check if all forms have a file selected
        const allFormsHaveFiles = selectedForms.every((formId) => fileMap[formId]);

        if (!allFormsHaveFiles) {
            alert("Please select a file for each form before submitting.");
            return;
        }if (sigCanvas.current.isEmpty()) {
            alert("Please enter your full name and sign before submitting.");
            return;
        } else {
                setIsSubmitting(true);
                await uploadFiles();
                setStep(step + 1);
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
        <SiteContainer content = {
            <div>
                <div className = "site-header-break" />
                <div className="signup-container flex justify-start">
                    <h1 className="font-semibold text-center">Form Registration</h1>
                    <br />
                    <div className="form-container">
                        {step === 1 && (
                            <div>
                                <h2 className="font-semibold">Select Prisons</h2>
                                <br></br>
                                <h3>Select prisons that you intend to play at this year. You will not be able to attend events at a prison that you have not filled out forms for.</h3>
                                <br></br>
                                {prisons.map((prison, index) => (
                                    <div key={index} className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            value={prison}
                                            onChange={handlePrisonChange}
                                            checked={selectedPrisons.includes(prison)}
                                        />
                                        <label>{" " + prison}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Step 2: Ask Special Question if Folsom is selected */}
                        {step === 2 && isFolsomSelected && (
                            <div>
                                <h2 className="font-semibold">Notice</h2>
                                <h3>In accordance with the California Department of Corrections and Rehabilitation (CDCR) California Code of Regulations, Title 15 Section 3406, and Department Operations Manual Section 33010.25.1, CDCR 2189 must be completed each time an individual becomes aware of a relative or person with whom the individual has/had a personal or business relationship who has been committed or transferred to the jurisdiction of CDCR.<br/><br/>Do you know anyone who has been incarcerated or is on parole in the CDCR system?</h3>
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
                                            <label>{" " + form.name}</label>
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
                                <div className="flex justify-end relative">
                                    <div className="group relative">
                                        <span className="text-gray-500 cursor-pointer text-lg">🛈</span>
                                        <div className="hidden group-hover:block absolute right-0 bg-gray-800 text-white text-xs rounded p-2 w-56 shadow-lg">
                                            To view a form, click on the related link. You will be able to edit the form in a popup tab and download the form with your changes. You may then upload the completed form. Make sure that all selected forms have been uploaded before submitting. You may then sign in the designated space below, and upon submission your signature will be applied to your uploaded forms.
                                        </div>
                                    </div>
                                </div>
                                <div className={"max-h-40 overflow-y-auto border p-2 rounded"}>
                                    {forms
                                        .filter((form) => selectedForms.includes(form.id))
                                        .map((form) => (
                                            <div key={form.id} className="flex items-center justify-between border-b p-2">
                                                {/* Hyperlink Form Name */}
                                                <a 
                                                    href="#" 
                                                    onClick={(e) => {
                                                        e.preventDefault(); 
                                                        downloadForm(form.fileKey);
                                                    }} 
                                                    className="text-blue-500 underline cursor-pointer"
                                                >
                                                    {form.name}
                                                </a>
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
                                <br></br>
                                <p>By signing below, you agree to the terms listed on the selected forms. Your signature will be applied to the selected forms.</p>
                                <br></br>
                                <t className="font-semibold">E-Signature: </t>
                                <input // here to line 450 is not needed, can get rid of
                                    type="text" 
                                    variant="outlined"
                                    value={inputValue} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter Full Name" 
                                    />   
                                    <t className="font-nobold"></t>
                                    <t className="font-semibold">Signature: </t>
                                    <SignaturePad ref={sigCanvas} penColor='Black'
                                    canvasProps={{width: 340, height: 120, className: 'sigCanvas border border-black'}}
                                    />
                                <button className="rounded-button mt-3" onClick={handleClear}>
                                    Clear Signature
                                </button>
                                <button className="rounded-button mt-3" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        )}

                        {step === 5 && (
                            <div>
                                <h2 className="font-semibold">Thank You</h2>
                                <br></br>
                                <h3>Your forms have been uploaded successfully. You may now return to the home page, or exit the application.</h3>
                                <br></br>
                                <Link to="/"><button className="rounded-button cyan-gradient">HOME</button></Link>
                                <br></br>
                            </div>
                        )}
                    </div>
                    <div className="navigation-buttons">
                        {step < 4 && (
                            <button className="rounded-button" onClick={handleNext}>
                                Next
                            </button>
                        )}
                        {step > 1 && step < 5 && (
                            <button className="rounded-button" onClick={handleBack}>
                                Back
                            </button>
                        )}
                    </div>
                    {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-7 rounded-lg w-3/4 h-3/4 relative">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="absolute top-1 right-1"
                            >
                                ✖
                            </button>
                            <iframe 
                                src={fileUrl} 
                                className="w-full h-full" 
                                title="Form Download"
                                frameBorder="0"
                            />
                        </div>
                    </div>
                    )}
                    {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-7 rounded-lg w-3/4 h-3/4 relative">
                            <button 
                                onClick={() => setShowPreview(false)} 
                                className="absolute top-1 right-1"
                            >
                                ✖
                            </button>
                            <iframe 
                                src={previewFileTest} 
                                className="w-full h-full" 
                                title="Form Download"
                                frameBorder="0"
                            />
                        </div>
                    </div>
                    )}
                    {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="form-container">
                            <h2 className="font-semibold">Submitting...</h2>
                        </div>
                    </div>
                    )}
                </div>
                <div className="site-footer-break"/>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
        }/>
    );
}

export default Registration;
