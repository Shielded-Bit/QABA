import React from "react";
import Image from "next/image";

const PasswordResetModal = ({ showModal, setShowModal, email }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="bg-green-600 p-4 rounded-full animate-pulse">
            <Image
              src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1739654980/mdi_check-thick_g4z6nq.png"
              alt="Password Reset Icon"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
        </div>

        {/* Title with Gradient */}
        <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
          Password Reset Verification
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mt-2">
          We have sent an email to{" "}
          <span className="text-blue-500">{email}</span> to confirm the validity
          of your email address. After receiving the email, follow the link
          provided to reset your password.
        </p>
      </div>
    </div>
  );
};

export default PasswordResetModal;