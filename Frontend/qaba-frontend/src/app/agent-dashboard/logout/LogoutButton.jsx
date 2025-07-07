"use client";

import { XCircle, AlertCircle, LogOut } from "lucide-react";
import { useState } from "react";
import useLogout from "../../hooks/useLogout"; // Use the correct logout hook

const LogoutButton = ({ onClose, className = "", iconSize = 20 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogout(); // This will now call the backend endpoint

  const openModal = () => {
    setIsOpen(true);
    if (typeof onClose === "function") onClose(); // Close any parent menu if provided
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`flex items-center ${className}`}
        aria-label="Open logout confirmation"
      >
        <LogOut size={iconSize} className="mr-2" />
        Log Out
      </button>

      {/* Logout Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <XCircle size={24} />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900">Are you sure you want to log out?</h2>
            <p className="text-gray-500 text-sm mt-2">You can log back in anytime to continue.</p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;