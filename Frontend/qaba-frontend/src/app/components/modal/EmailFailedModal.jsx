import React from "react";
import Image from "next/image";
import Button from "../shared/Button";

const EmailFailedModal = ({ showModal, setShowModal, onClose }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-8 relative text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowModal(false);
            onClose();
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-red-500 p-4 rounded-full animate-pulse">
            <Image
              src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1740576350/x_j866kx.png"
              alt="Error Icon"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Title with Gradient */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
          Email Verification Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-2">
          Email verification failed. Please double-check your email address and try again.
        </p>

        {/* Try Again Button */}
        <div className="mt-6 flex justify-center">
          <Button
            label="Try again"
            href="/create-account"
            variant="primary"
            className="w-full max-w-sm py-3 text-1xl"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailFailedModal;