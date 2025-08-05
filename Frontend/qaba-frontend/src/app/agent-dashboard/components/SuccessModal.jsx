// SuccessModal.jsx
import React from "react";
import { useRouter } from "next/navigation";

const SuccessModal = ({ isOpen, onClose, message, isDraft }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const navigateToListings = () => {
    router.push('/agent-dashboard/myListings');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#014d98] mb-2">
            {isDraft ? 'Draft Saved' : 'Property Submitted'}
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <button
              onClick={navigateToListings}
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-4 rounded-md hover:opacity-90"
            >
              View My Listings
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-md hover:bg-blue-100"
            >
              {isDraft ? 'Continue Editing' : 'Add Another Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;