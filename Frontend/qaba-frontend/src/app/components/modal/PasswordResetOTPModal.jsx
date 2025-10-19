import React, { useState, useRef, useEffect } from "react";
import { confirmPasswordReset } from "../../utils/auth/api";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordResetOTPModal = ({ showModal, setShowModal, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    isMatching: false
  });

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (showModal && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showModal]);

  // Validate password
  useEffect(() => {
    const validations = {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      isMatching: newPassword === confirmPassword && newPassword !== ""
    };
    setPasswordValidation(validations);
  }, [newPassword, confirmPassword]);

  if (!showModal) return null;

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

    if (!newPassword || !confirmPassword) {
      setError("Please enter your new password");
      return;
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await confirmPasswordReset(email, otpString, newPassword);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          router.push("/signin");
        }, 2000);
      } else {
        setError(response.message || "Invalid code or password reset failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
          <div className="flex justify-center">
            <div className="bg-green-600 p-4 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
            Password Reset Successful!
          </h1>

          <p className="text-center text-gray-600 mt-2">
            Your password has been successfully reset. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative my-8">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-[#014D98] to-[#3AB7B1] p-4 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-transparent bg-clip-text mt-4">
          Reset Your Password
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-[#014D98]">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#3AB7B1] focus:outline-none transition-colors"
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#3AB7B1] focus:outline-none transition-colors"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#3AB7B1] focus:outline-none transition-colors"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="text-xs space-y-1">
              <p className="font-medium text-gray-700 mb-1">Password must:</p>
              <div className="flex items-center">
                <span className={`mr-2 ${passwordValidation.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordValidation.minLength ? '✓' : '○'}
                </span>
                <span className={passwordValidation.minLength ? 'text-green-500' : 'text-gray-600'}>
                  Be at least 8 characters
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 ${passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordValidation.hasUppercase ? '✓' : '○'}
                </span>
                <span className={passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-600'}>
                  Include uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 ${passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordValidation.hasLowercase ? '✓' : '○'}
                </span>
                <span className={passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-600'}>
                  Include lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 ${passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordValidation.hasNumber ? '✓' : '○'}
                </span>
                <span className={passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-600'}>
                  Include number (0-9)
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 ${passwordValidation.hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordValidation.hasSpecial ? '✓' : '○'}
                </span>
                <span className={passwordValidation.hasSpecial ? 'text-green-500' : 'text-gray-600'}>
                  Include special character (!@#$%^&*)
                </span>
              </div>
              {confirmPassword && (
                <div className="flex items-center">
                  <span className={`mr-2 ${passwordValidation.isMatching ? 'text-green-500' : 'text-gray-400'}`}>
                    {passwordValidation.isMatching ? '✓' : '○'}
                  </span>
                  <span className={passwordValidation.isMatching ? 'text-green-500' : 'text-gray-600'}>
                    Passwords match
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !Object.values(passwordValidation).every(Boolean)}
            className="w-full bg-gradient-to-r from-[#014D98] to-[#3AB7B1] text-white py-3 rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

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

export default PasswordResetOTPModal;
