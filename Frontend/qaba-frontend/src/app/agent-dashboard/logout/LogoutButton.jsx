"use client";

import { XCircle, AlertCircle, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useLogout from "../../hooks/useLogout";

const LogoutButton = ({ collapsed = false, onClose, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const { logout, isLoading } = useLogout();

  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const openModal = () => {
    setIsOpen(true);
    if (typeof onClose === "function") onClose(); // Close any parent menu if provided
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`group flex items-center w-full transition-all duration-200 ${className}`}
        aria-label="Open logout confirmation"
      >
        <div className="relative">
          <LogOut className={collapsed ? 'mx-auto' : 'mr-2'} size={16} />
          {collapsed && (
            <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Log Out
            </div>
          )}
        </div>
        <span className={collapsed ? 'hidden' : 'inline'}>Log Out</span>
      </button>

      {/* Logout Modal */}
      {isOpen && isBrowser && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
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
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  "Log Out"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LogoutButton;