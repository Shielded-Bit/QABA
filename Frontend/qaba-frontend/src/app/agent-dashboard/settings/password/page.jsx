// app/settings/password/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';

// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com';

export default function PasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });
  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get auth token from various storage options
  const getAuthToken = () => {
    return Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    
    // Redirect if not authenticated
    if (!token) {
      // You can add redirect logic here if needed
      toast.error('You must be logged in to change your password');
    }
  }, []);

  // Password validation rules with detailed feedback
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate password strength
    let score = 0;
    let feedback = '';

    if (password.length >= minLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    // Set feedback based on score
    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Moderate';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }

    setPasswordStrength({ score, feedback });

    // Return missing requirements for detailed feedback
    const requirements = [];
    if (password.length < minLength) requirements.push('at least 8 characters');
    if (!hasUpperCase) requirements.push('uppercase letter');
    if (!hasLowerCase) requirements.push('lowercase letter');
    if (!hasNumber) requirements.push('number');
    if (!hasSpecialChar) requirements.push('special character');

    return {
      isValid: requirements.length === 0,
      requirements,
      score,
    };
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific error when typing
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Real-time validation for new password
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          newPassword: `Password needs: ${validation.requirements.join(', ')}`,
        }));
      }
      
      // Also update confirmPassword validation if it exists
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: 'Passwords do not match',
          }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
      }
    }

    // Real-time validation for confirm password
    if (name === 'confirmPassword') {
      if (value !== formData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'oldPassword':
        setShowOldPassword(!showOldPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate old password
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = `Password needs: ${passwordValidation.requirements.join(', ')}`;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check authentication before submitting
    const token = getAuthToken();
    if (!token) {
      toast.error('Authentication required. Please log in again.');
      return;
    }

    // Submit form data
    setIsSubmitting(true);
    try {
      // Call the change password API endpoint with the new API base URL
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/password/change/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        credentials: 'include', // Include cookies if using cookie-based auth
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword
        }),
      });

      // Handle different response statuses
      if (response.status === 401) {
        throw new Error('Authentication error. Please log in again.');
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.old_password) {
          setErrors({ oldPassword: errorData.old_password });
          throw new Error('Old password is incorrect');
        } else if (errorData.new_password) {
          setErrors({ newPassword: errorData.new_password });
          throw new Error(errorData.new_password);
        } else {
          throw new Error(errorData.message || 'Validation error');
        }
      } else if (!response.ok) {
        throw new Error('Server error. Please try again later.');
      }

      // Success message
      toast.success('Password changed successfully!');
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordStrength({ score: 0, feedback: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get color based on password strength
  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="text-center py-8">
          <h2 className="text-xl font-medium text-gray-700">Authentication Required</h2>
          <p className="mt-2 text-gray-500">Please log in to change your password.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg ">
      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={`block w-full border ${
                errors.oldPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2 pr-10 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your current password"
              aria-describedby="oldPassword-error"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
              onClick={() => togglePasswordVisibility('oldPassword')}
              aria-label={showOldPassword ? "Hide password" : "Show password"}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1" id="oldPassword-error">
              {errors.oldPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`block w-full border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2 pr-10 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Create a new password"
              aria-describedby="newPassword-error newPassword-strength"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
              onClick={() => togglePasswordVisibility('newPassword')}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1" id="newPassword-error">
              {errors.newPassword}
            </p>
          )}
          {formData.newPassword && (
            <div className="mt-2" id="newPassword-strength">
              <div className="flex items-center mb-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {passwordStrength.feedback}
                </span>
              </div>
              <ul className="text-xs text-gray-600 list-disc pl-5 mt-1">
                <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  At least one uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  At least one lowercase letter
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  At least one number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2 pr-10 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirm your new password"
              aria-describedby="confirmPassword-error"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1" id="confirmPassword-error">
              {errors.confirmPassword}
            </p>
          )}
          {formData.confirmPassword && formData.confirmPassword === formData.newPassword && (
            <p className="text-green-500 text-sm mt-1">
              Passwords match ✓
            </p>
          )}
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setErrors({});
              setPasswordStrength({ score: 0, feedback: '' });
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).some(key => errors[key]) || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
            className="px-4 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-md font-medium hover:from-[#3ab7b1] hover:to-[#014d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Changing Password...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}