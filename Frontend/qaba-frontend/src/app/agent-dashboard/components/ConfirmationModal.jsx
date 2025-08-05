// ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <div className="flex flex-col items-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#014d98] mb-2">{title || "Confirm Submission"}</h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center mb-6">{message || "Are you sure you want to proceed? Please verify all information is correct."}</p>
          
          {/* Buttons */}
          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="w-1/2 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100"
            >
              Review again
            </button>
            <button
              onClick={onConfirm}
              className="w-1/2 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-4 rounded-md hover:opacity-90"
            >
              Yes, proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;