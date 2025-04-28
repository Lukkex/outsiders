import React, { useState, useEffect } from 'react';
import '../../Stylesheets/App.css'; // Global styles
import '../../Stylesheets/Registration.css'; // Registration-specific styles
import '../../Stylesheets/SignUp.css';
import SiteContainer from '../../../utils/SiteContainer.js';
import SignaturePad from 'react-signature-canvas'
import { useRef } from 'react';
import { uploadData, getUrl, list } from 'aws-amplify/storage';
import { getCurrentUserInfo, getUserRole } from '../../../services/authConfig';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

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
    //const [showModal, setShowModal] = useState(false);
    //const [showPreview, setShowPreview] = useState(false);
    //const [previewFileTest, setPreviewFileTest] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const sigCanvas = useRef({});
    const handleClear = () => {sigCanvas.current.clear();}
    const [selectedPrisons, setSelectedPrisons] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [step, setStep] = useState(1);
    const [needsSpecialForm, setNeedsSpecialForm] = useState(null); // Response to prompt after Folsom selection
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const currentFormId = selectedForms[currentPreviewIndex];
    const [fileMap, setFileMap] = useState({}); // Stores selected files for each form
    const [formCache, setFormCache] = useState({});
    const [user, setUser] = useState(null);
    const fileInputsRef = useRef({});
    const [pdfBlobMap, setPdfBlobMap] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [previewFile, setPreviewFile] = useState('');
    const [isDefault, setIsDefault] = useState(Array(7).fill(true));
    const [wasDefault, setWasDefault] = useState(Array(7).fill(true));

    const updateIsDefault = (index, value) => {
        setIsDefault(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
    };

    const updateWasDefault = (index, value) => {
        setWasDefault(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
    };

    const fetchAndCachePdfBlob = async (formId) => {
        if (pdfBlobMap[formId]) return pdfBlobMap[formId];
        
        updateWasDefault(currentFormId - 1, false);
        const url = await downloadForm(getFileKeyById(formId));
        const response = await fetch(url);
        const blob = await response.blob();
      
        setPdfBlobMap((prev) => ({ ...prev, [formId]: blob }));
        return blob;
      };

    useEffect(() => {
        const grabUser = async () => {
            const currentUser = await getCurrentUserInfo();
            setUser(currentUser);
        }
        if (user == null) {
            grabUser();
        }
    }, [user]);

    const getCachedFormUrl = async (formId) => {
        if (formCache[formId]) {
          return formCache[formId];
        } else {
          const url = await downloadForm(getFileKeyById(formId));
          setFormCache((prev) => ({ ...prev, [formId]: url }));
          return url;
        }
    };

    useEffect(() => {
        const fetchUrl = async () => {
          const url = await getCachedFormUrl(currentFormId);
          setFileUrl(url);
        };
      
        if (currentFormId) {
          fetchUrl();
        }
    }, [currentFormId]);

    useEffect(() => {
        const loadBlob = async () => {
          const blob = await fetchAndCachePdfBlob(currentFormId);
          const objectUrl = URL.createObjectURL(blob);
          setFileUrl(objectUrl);
        };
      
        if (currentFormId) loadBlob();
      }, [currentFormId]);
    
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

    const getFileKeyById = (formId) => {
        const form = forms.find((form) => form.id === formId);
        return form ? form.fileKey : "Unknown Form";
    };
    
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
        { id: 1, fileKey:"CDCR_2301_A.pdf", sigpage: 1, sigloc: {x: 60, y: 394, width:57, height:20}, name: "CDCR 2301 - Policy Information for Volunteers (Part A)", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 2, fileKey:"CDCR_2301_B.pdf", sigpage: 0, sigloc: {x: 25, y: 206, width:68, height:24}, name: "CDCR 2301 - Policy Information for Volunteers (Part B)", prisons: ["Folsom State Prison"] },
        { id: 3, fileKey:"CDCR_2311.pdf", sigpage: 0, sigloc: {x: 167, y: 69, width:71, height:25}, name: "CDCR 2311 - Background Security Clearance Application", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
        { id: 4, fileKey:"CDCR_2311_A.pdf", sigpage: 0, sigloc: null, name: "CDCR 2311-A - Criminal History Security Screening Form", prisons: [] },
        { id: 5, fileKey:"CDCR_PREA.pdf", sigpage: 0, sigloc: {x: 75, y: 552, width:71, height:25}, name: "CDCR PREA - Acknowledgement Form", prisons: ["Folsom State Prison"] },
        { id: 6, fileKey:"CDCR_181.pdf", sigpage: 0, sigloc: {x: 220, y: 34, width:77, height:27}, name: "CDCR 181 - Laws, Rules and Regulations", prisons: ["San Quentin State Prison"] },
        { id: 7, fileKey:"CDCR_2189.pdf", sigpage: 0, sigloc: {x: 38, y: 378, width:77, height:27}, name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate", prisons: ["Folsom State Prison"], requiresYes: true },
    ];

    const fillSignature = async (file, canvas, sigloc, sigpage, preview) => {
        
        const pdfUrl = URL.createObjectURL(file);
    
        // Load existing PDF
        const existingPdfBytes = await fetch([pdfUrl]).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[sigpage];

        if (canvas != null && sigloc != null) {
            // Convert signature to embedded image
            const signatureImage = await pdfDoc.embedPng(canvas);

            // Draw signature on a specific position
            page.drawImage(signatureImage, sigloc);
        }
        // Convert signature to embedded image
        const updatedPdfBytes = await pdfDoc.save();

        if (preview == true) {
            const updatedPdfBlob = new Blob([updatedPdfBytes], { type: "application/pdf" });
            const updatedPdfUrl = URL.createObjectURL(updatedPdfBlob);
            setPreviewFile(updatedPdfUrl);
            setShowPreview(true);
            while (showPreview) {}
        }  
        
        return updatedPdfBytes;
    }

    const downloadForm = async (fileKey) => {
        try {
            if (user == null) {
                const currentUser = await getCurrentUserInfo();
                setUser(currentUser);
            }
            const userFiles = await list({
                path: `uploads/${user.email}`
            });
            //console.log(userFiles);
            if (userFiles.items.length == 0) {
                //console.log('No associated files found.');
            }

            if (userFiles.items.length > 0) {
                for (let i=0;i<userFiles.items.length;i++) {
                    //console.log(userFiles.items[i].path);
                    if (userFiles.items[i].path.indexOf(fileKey.replace(/\.pdf$/, "")) > -1){
                        const getUrlResult = await getUrl({
                            path: userFiles.items[i].path,
                            // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                            options: {
                            validateObjectExistence: false,  // Check if object exists before creating a URL
                            expiresIn: 30, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                            useAccelerateEndpoint: false // Whether to use accelerate endpoint
                            },
                        });
                        //console.log('signed URL: ', getUrlResult.url);
                        //console.log('URL expires at: ', getUrlResult.expiresAt);
                        updateIsDefault(currentFormId - 1, false);
                        setFileUrl(getUrlResult.url); // Set the file URL to display in the iframe
                        //setShowModal(true); // Show the modal
                        //window.open(getUrlResult.url);
                        return getUrlResult.url;
                    }
                }
                
                const getUrlResult = await getUrl({
                    path: `formtemplates/${fileKey}`,
                    // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                    options: {
                    validateObjectExistence: false,  // Check if object exists before creating a URL
                    expiresIn: 30, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                    useAccelerateEndpoint: false // Whether to use accelerate endpoint
                    },
                });
                //console.log('signed URL: ', getUrlResult.url);
                //console.log('URL expires at: ', getUrlResult.expiresAt);

                setFileUrl(getUrlResult.url); // Set the file URL to display in the iframe
                //setShowModal(true); // Show the modal
                //window.open(getUrlResult.url);
                return getUrlResult.url;

            } else {
            
                const getUrlResult = await getUrl({
                    path: `formtemplates/${fileKey}`,
                    // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                    options: {
                    validateObjectExistence: false,  // Check if object exists before creating a URL
                    expiresIn: 30, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                    useAccelerateEndpoint: false, // Whether to use accelerate endpoint
                    },
                });
                //console.log('signed URL: ', getUrlResult.url);
                //console.log('URL expires at: ', getUrlResult.expiresAt);

                setFileUrl(getUrlResult.url); // Set the file URL to display in the iframe
                //setShowModal(true); // Show the modal
                //window.open(getUrlResult.url);
                return getUrlResult.url;
            }

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

            const uploadPromises = selectedForms.map(async (formId) => {
                var file = fileMap[formId];
                const filename = getFileKeyById(formId).replace(/\.pdf$/, "");
                const signatureLocation = getSignatureLocationById(formId);
                const signaturePage = getSignaturePageById(formId);
    
                if (!file) {
                    throw new Error(`No file selected for form ID: ${formId}`);
                }
    
                file = await fillSignature(file, signatureDataUrl, signatureLocation, signaturePage, false);
    
                //end of file formatting, start of file upload
    
                const formattedDate = getFormattedDate(); // Generate date for folder structure
                const filePath = `uploads/${user.email}/${formattedDate}/${filename} - ${user.given_name}_${user.family_name}.pdf`; // Organize by date
                
                const result = await uploadData({
                    path: filePath, 
                    data: file,
                    options: {
                        contentDisposition: 'inline',
                        contentType: 'application/pdf'
                    }
                }).result;
    
                console.log(`File uploaded: ${filename}`);
                return result;
                
            });
    
            await Promise.all(uploadPromises);
            setIsSubmitting(false);
            setStep(step + 1);

        } catch (error) {
            console.error("Upload failed:", error);
            setIsSubmitting(false);
            alert("Error uploading files. Are the correct forms attached? Did you sign in the designated area?");
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
        setCurrentPreviewIndex(0);
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

    const handleFileChange = (formId, event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            setFileMap((prev) => ({ ...prev, [formId]: file }));
        }
    };

    const handlePreview = async () => {
        var signatureDataUrl;

        if (!sigCanvas.current.isEmpty()) {
            // Get signature as base64 image
            signatureDataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
        } else {
            signatureDataUrl = null;
        }

            var file = fileMap[currentFormId];
            const signatureLocation = getSignatureLocationById(currentFormId);
            const signaturePage = getSignaturePageById(currentFormId);

            if (!file) {
                throw new Error(`No file selected for form ID: ${currentFormId}`);
            }

            file = await fillSignature(file, signatureDataUrl, signatureLocation, signaturePage, true);
        
    }

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

    const handleReset = async (fileKey) => {
        const getUrlResult = await getUrl({
            path: `formtemplates/${fileKey}`,
            // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
            options: {
            validateObjectExistence: false,  // Check if object exists before creating a URL
            expiresIn: 30, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
            useAccelerateEndpoint: false // Whether to use accelerate endpoint
            },
        });
        //console.log('signed URL: ', getUrlResult.url);
        //console.log('URL expires at: ', getUrlResult.expiresAt);
        updateIsDefault(currentFormId - 1, true);
        setFileUrl(getUrlResult.url); // Set the file URL to display in the iframe
        //setShowModal(true); // Show the modal
        //window.open(getUrlResult.url);
        return getUrlResult.url;
    }

    return (
        <SiteContainer content = {
            <div>
                <div className = "site-header-break" />
                <div className="signup-container flex justify-start">
                    <h1 className="font-semibold text-center">Form Registration</h1>
                    <br />
                    <div className={`form-container ${step===4 ? 'wide' : ''}`}>
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
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-500 cursor-pointer text-md">Help </span>
                                        <span className="text-gray-500 cursor-pointer text-2xl">🛈</span>
                                    </div>
                                    <div className="hidden group-hover:block absolute right-0 bg-gray-800 text-white text-xs rounded p-2 w-56 shadow-lg">
                                        After filling in the required fields for a form, download the form with your changes. Double check that the downloaded form has the correct information. You may then upload the completed form from your device. Make sure that all forms have been attached before submitting. You may then sign in the designated space below, and upon submission your signature will be applied to your uploaded forms.
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Controls */}
                            <div className="flex justify-between items-center">
                            <button className="px-1 py-0.5 text-sm border rounded"
                                onClick={() => { setCurrentPreviewIndex((i) => Math.max(i - 1, 0)); if (wasDefault[currentFormId - 1] == false) updateIsDefault(currentFormId - 1, false);}}
                                disabled={currentPreviewIndex === 0}
                            >
                                ←
                            </button>
                            <span>{`Form ${currentPreviewIndex + 1} of ${selectedForms.length}`}</span>
                            <button className="px-1 py-0.5 text-sm border rounded"
                                onClick={() => { setCurrentPreviewIndex((i) => Math.min(i + 1, selectedForms.length - 1)); if (wasDefault[currentFormId - 1] == false) updateIsDefault(currentFormId - 1, false);}}
                                disabled={currentPreviewIndex === selectedForms.length - 1}
                            >
                                →
                            </button>
                            </div>

                            {/* PDF Preview */}
                            <div className="border mt-2">
                                {fileUrl ? (
                                    <iframe
                                    src={fileUrl}
                                    className="w-full h-[500px]"
                                    title="PDF Preview"
                                    />
                                ) : (
                                    <div className="w-full h-[500px] flex items-center justify-center text-gray-400">
                                    No form available for preview. Try refreshing the page.
                                    </div>
                                )}
                                </div>
                                <br></br>
                                <div className="navigation-buttons">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(event) => handleFileChange(currentFormId, event)}
                                        className="hidden"
                                        id={`file-upload-${currentFormId}`}
                                        ref={(el) => fileInputsRef.current[currentFormId] = el} // Need a ref!
                                    />
                                    <button
                                        type="button"
                                        className={`rounded-button mt-3 ${fileMap[currentFormId] ? 'uploaded' : ''}`}
                                        onClick={() => fileInputsRef.current[currentFormId]?.click()}
                                        >
                                        {fileMap[currentFormId] ? "Update Form" : "Attach Form"}
                                    </button>
                                    {fileMap[currentFormId] ? (<button
                                        type="button"
                                        className="rounded-button mt-3"
                                        onClick={() => handlePreview()}
                                        >
                                        Preview Attached Form
                                    </button>) : ''}
                                    {isDefault[currentFormId - 1] ? '' : (<button
                                        type="button"
                                        className="rounded-button mt-3"
                                        onClick={() => handleReset(getFileKeyById(currentFormId))}
                                        >
                                        Switch to Blank Form
                                    </button>)}
                                </div>
                                <br></br>
                                <p className='font-semibold'>Notice:</p>
                                <p>By signing below, you agree to the terms listed on these forms. Your signature will be applied to every form upon upload.</p>
                                <div className='flex flex-col items-center justify-center'>
                                    <t className="font-semibold">Signature </t>
                                    <SignaturePad ref={sigCanvas} penColor='Black' backgroundColor='rgba(255, 255, 255, 1)'
                                    canvasProps={{width: 340, height: 120, className: 'sigCanvas border-2 border-black rounded-md'}}
                                    />
                                </div>
                                <br></br>
                                <div className="navigation-buttons">
                                    <button className="rounded-button mt-3" onClick={handleClear}>
                                        Clear Signature
                                    </button>
                                    <button className="rounded-button mt-3" onClick={handleSubmit}>
                                        Submit
                                    </button>
                                </div>
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
                    <div className="navigation-buttons flex justify-center gap-4 mt-4">
                        {step > 1 && step < 5 && (
                            <button className="rounded-button mt-3" onClick={handleBack}>
                                Back
                            </button>
                        )}
                        {step < 4 && (
                            <button className="rounded-button mt-3" onClick={handleNext}>
                                Next
                            </button>
                        )}
                    </div>
                    {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="form-container">
                            <h2 className="font-semibold">Submitting...</h2>
                        </div>
                    </div>
                    )}
                    {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white pt-10 px-4 pb-4 rounded-lg w-3/4 h-3/4 relative">
                            <button 
                                onClick={() => setShowPreview(false)} 
                                className="absolute top-2 right-3 font-semibold text-gray-700"
                            >
                                close
                            </button>
                            <iframe 
                                src={previewFile} 
                                className="w-full h-full" 
                                title="Form Download"
                                frameBorder="0"
                            />
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
