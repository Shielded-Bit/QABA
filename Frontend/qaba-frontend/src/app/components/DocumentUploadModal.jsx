"use client";
import React, { useState } from "react";

const DocumentUploadModal = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  documentTypes = [] 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState(documentTypes[0]?.value || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !documentType) {
      alert("Please select both a document type and a file");
      return;
    }

    setIsUploading(true);
    try {
      await onUpload({
        file: selectedFile,
        type: documentType
      });
      
      // Reset form after successful upload
      setSelectedFile(null);
      setDocumentType(documentTypes[0]?.value || "");
      
      // Don't close modal automatically to allow for multiple uploads
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setSelectedFile(null);
    setDocumentType(documentTypes[0]?.value || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-medium text-gray-900">Upload Document</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Document Type</label>
            <select 
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              {documentTypes.length === 0 && (
                <option value="">No document types available</option>
              )}
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Upload Document</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop a document or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile || !documentType}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>You can upload multiple documents by repeating this process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;