"use client";

import { XCircle, AlertCircle, LogOut } from "lucide-react"; // Import the LogOut icon
import useModal from "./useModal";
import useLogout from "./useLogout";

const LogoutButton = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center text-black hover:text-white transition duration-200"
        aria-label="Open logout confirmation"
      >
        <LogOut size={20} className="mr-3" /> {/* Add the LogOut icon */}
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