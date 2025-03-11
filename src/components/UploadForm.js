import React, { useState } from 'react';
import { uploadFile } from '../services/s3Service';

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');
    try {
      const fileName = `uploads/${file.name}`;
      await uploadFile(file, fileName);
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Upload failed!');
    }
  };

  return (
    <div>
      <h2>Upload Form</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForm;
