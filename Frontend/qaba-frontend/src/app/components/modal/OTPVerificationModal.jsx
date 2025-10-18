import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { verifyOTP } from "../../utils/auth/api";
import { useRouter } from "next/navigation";

const OTPVerificationModal = ({ showModal, setShowModal, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (showModal && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showModal]);

  if (!showModal) return null;

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        // Focus last filled input
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    // Focus last filled input
    const lastIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOTP(email, otpString);

      if (response.success || response.message === "Email verified successfully") {
        setSuccess(true);

        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          setShowModal(false);
          router.push("/signin");
        }, 2000);
      } else {
        setError(response.message || "Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      // Use the register endpoint again to resend the OTP
      // Or create a dedicated resend endpoint if available
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true })
      });

      if (response.ok) {
        setError("");
        alert("Verification code sent successfully!");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-600 p-4 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
            Email Verified!
          </h1>

          {/* Description */}
          <p className="text-center text-gray-600 mt-2">
            Your email has been successfully verified. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

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

        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-[#014D98] to-[#3AB7B1] p-4 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
          Verify Your Email
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mt-2">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-[#014D98]">{email}</span>
        </p>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#3AB7B1] focus:outline-none transition-colors"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-white py-3 rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend Code */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-[#014D98] font-semibold hover:text-[#3AB7B1] transition-colors disabled:opacity-50"
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
