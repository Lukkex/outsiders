import React, { useRef, useState } from "react";
import { Storage } from "aws-amplify";

const AdminFormUpload = () => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === "application/pdf");
    setSelectedFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    setSelectedFiles(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF.");
      return;
    }

    const results = [];
    for (const file of selectedFiles) {
      const key = `formtemplates/${file.name}`;
      try {
        await Storage.put(key, file, {
          contentType: "application/pdf",
          accessLevel: "guest",
        });
        results.push({ name: file.name, success: true });
      } catch {
        results.push({ name: file.name, success: false });
      }
    }

    setUploadStatus(results);
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Upload New Form</h2>

      <div
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <p className="font-medium">Drag & Drop a PDF</p>
        <p className="text-sm text-blue-600 underline mt-1">or Browse</p>
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            {selectedFiles.map((file, i) => (
              <p key={i}>{file.name}</p>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {uploadStatus.length > 0 && (
        <ul className="mt-3 text-sm">
          {uploadStatus.map((res, i) => (
            <li key={i} className={res.success ? "text-green-600" : "text-red-600"}>
              {res.name} - {res.success ? "Uploaded" : "Failed"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFormUpload;
