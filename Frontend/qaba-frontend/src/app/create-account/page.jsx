'use client'; // Ensures this is a client-side component in Next.js

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EmailSuccessModal from '../components/modal/EmailSuccessModal.jsx';
import EmailFailedModal from '../components/modal/EmailFailedModal.jsx';
import SignInWithGoogle from '../components/shared/SignInWithGoogle';
import PasswordInput from '../components/shared/PasswordInput';
import TextInput from '../components/shared/TextInput';
import { register } from '../../app/utils/auth/api.js'; // Import unified register
import OTPVerificationModal from '../components/modal/OTPVerificationModal.jsx';

// Image assets used in the UI
const bgpict = [
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737636958/Rectangle_178_uh827c.png',
    alt: 'Background Image',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737637680/Symbol.svg_wi7kyn.png',
    alt: 'Google Logo',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737901695/hide_o70c0j.png',
    alt: 'Hide password',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737901695/view_qioayd.png',
    alt: 'View password',
  },
];

// Password validation rules
const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: true,
  hasLowercase: true,
  hasNumber: true,
  hasSpecial: true
};

const Register = () => {
  // State variables
  const [step, setStep] = useState(1); // Step 1: Role Selection, Step 2: Registration Form
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "", 
    password: "",
    confirmPassword: "",
    role: "", // No default role - user must select
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    isMatching: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(7, 11)}`;
    }
  };

  // Validate password as user types
  useEffect(() => {
    const password = formData.password;
    const validations = {
      minLength: password.length >= PASSWORD_RULES.minLength,
      hasUppercase: PASSWORD_RULES.hasUppercase ? /[A-Z]/.test(password) : true,
      hasLowercase: PASSWORD_RULES.hasLowercase ? /[a-z]/.test(password) : true,
      hasNumber: PASSWORD_RULES.hasNumber ? /\d/.test(password) : true,
      hasSpecial: PASSWORD_RULES.hasSpecial ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
      isMatching: password === formData.confirmPassword && password !== ""
    };
    
    setPasswordValidation(validations);
    
    // Calculate password strength (0-100)
    let strength = 0;
    if (validations.minLength) strength += 20;
    if (validations.hasUppercase) strength += 20;
    if (validations.hasLowercase) strength += 20;
    if (validations.hasNumber) strength += 20;
    if (validations.hasSpecial) strength += 20;
    
    setPasswordStrength(strength);
    
  }, [formData.password, formData.confirmPassword]);

  // Toggles password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Updates form input state
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Format phone number if it's the phone field
    if (id === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [id]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    
    // Clear validation errors when user types
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: null
      });
    }
  };

  // Handle focus/blur on password field
  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };
  
  const handlePasswordBlur = () => {
    // Keep validation visible if password is not empty
    if (!formData.password) {
      setPasswordFocused(false);
    }
  };

  // Updates selected role
  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  // Handle continuing from role selection to form
  const handleContinueFromRoleSelection = () => {
    if (!formData.role) {
      setErrors({ role: "Please select a role to continue" });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // Get strength color and label
  const getStrengthInfo = () => {
    if (passwordStrength <= 20) return { color: "bg-red-500", label: "Very Weak" };
    if (passwordStrength <= 40) return { color: "bg-orange-500", label: "Weak" };
    if (passwordStrength <= 60) return { color: "bg-yellow-400", label: "Fair" };
    if (passwordStrength <= 80) return { color: "bg-blue-500", label: "Strong" };
    return { color: "bg-green-500", label: "Very Strong" };
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    
    // Optional phone validation - if provided, validate format
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 11) {
      newErrors.phone = "Please enter a valid 11-digit phone number";
    }
    
    // Add password validation errors
    if (formData.password) {
      if (!passwordValidation.minLength) {
        newErrors.password = `Password must be at least ${PASSWORD_RULES.minLength} characters`;
      }
      if (PASSWORD_RULES.hasUppercase && !passwordValidation.hasUppercase) {
        newErrors.password = newErrors.password || "Password must contain at least one uppercase letter";
      }
      if (PASSWORD_RULES.hasLowercase && !passwordValidation.hasLowercase) {
        newErrors.password = newErrors.password || "Password must contain at least one lowercase letter";
      }
      if (PASSWORD_RULES.hasNumber && !passwordValidation.hasNumber) {
        newErrors.password = newErrors.password || "Password must contain at least one number";
      }
      if (PASSWORD_RULES.hasSpecial && !passwordValidation.hasSpecial) {
        newErrors.password = newErrors.password || "Password must contain at least one special character";
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true); 

    // Clean phone number for API (remove formatting)
    const cleanedPhone = formData.phone ? formData.phone.replace(/\D/g, '') : '';

    const requestData = {
      username: formData.email.split("@")[0], // Generate username from email
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword, // Include confirmPassword field
      first_name: formData.firstname,
      last_name: formData.lastname,
      phone: cleanedPhone || undefined, // Include phone if provided
    };

    try {
      // Map local role values to API user_type values
      const roleMap = {
        client: 'CLIENT',
        agent: 'AGENT',
        landlord: 'LANDLORD',
        legal: 'LEGAL_PRACTITIONER' 
      };

      const payload = {
        ...requestData,
        user_type: roleMap[formData.role] || 'CLIENT'
      };

      const response = await register(payload);

      if (response.success) {
        // Show email verification modal on success
        setShowModal(true);
        
        // Optional: send verification email if needed
        // await sendVerificationEmail(formData.email);
      } else {
        // Handle errors from the response
        if (response.errors) {
          const apiErrors = {};
          // Iterate through each error field
          Object.entries(response.errors).forEach(([field, messages]) => {
            // Handle both array and string error messages
            if (Array.isArray(messages)) {
              apiErrors[field] = messages[0]; // Take first error message if array
            } else if (typeof messages === 'string') {
              apiErrors[field] = messages;
            } else if (typeof messages === 'object') {
              // Handle nested error objects if they exist
              apiErrors[field] = Object.values(messages)[0];
            }
          });
          
          setErrors(apiErrors);
        } else {
          // If there's a general error message
          setErrors({ general: response.message || "Registration failed. Please try again." });
        }
        setShowFailedModal(true);
      }
    } catch (error) {
      console.error("Registration failed", error);
      
      // Handle error response from API
      if (error.errors) {
        const apiErrors = {};
        Object.entries(error.errors).forEach(([key, messages]) => {
          apiErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: error.message || "Registration failed. Please try again." });
      }
      
      setShowFailedModal(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Display error message for a field
  const getErrorMessage = (field) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  // Password validation criteria display component
  const PasswordCriteria = () => {
    if (!passwordFocused && !formData.password) return null;
    
    const strengthInfo = getStrengthInfo();
    
    return (
      <div className="mt-2 mb-4 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-600">Password strength:</span>
          <span className="font-medium text-gray-700">{strengthInfo.label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full ${strengthInfo.color}`} style={{width: `${passwordStrength}%`}}></div>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="font-medium text-gray-700 mb-1">Password must:</p>
          <div className="flex items-center">
            <span className={`mr-2 text-lg ${passwordValidation.minLength ? 'text-green-500' : 'text-gray-400'}`}>
              {passwordValidation.minLength ? '✓' : '○'}
            </span>
            <span className={passwordValidation.minLength ? 'text-green-500' : 'text-gray-600'}>
              Be at least {PASSWORD_RULES.minLength} characters
            </span>
          </div>
          {PASSWORD_RULES.hasUppercase && (
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                {passwordValidation.hasUppercase ? '✓' : '○'}
              </span>
              <span className={passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-600'}>
                Include uppercase letter (A-Z)
              </span>
            </div>
          )}
          {PASSWORD_RULES.hasLowercase && (
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                {passwordValidation.hasLowercase ? '✓' : '○'}
              </span>
              <span className={passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-600'}>
                Include lowercase letter (a-z)
              </span>
            </div>
          )}
          {PASSWORD_RULES.hasNumber && (
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                {passwordValidation.hasNumber ? '✓' : '○'}
              </span>
              <span className={passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-600'}>
                Include number (0-9)
              </span>
            </div>
          )}
          {PASSWORD_RULES.hasSpecial && (
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${passwordValidation.hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                {passwordValidation.hasSpecial ? '✓' : '○'}
              </span>
              <span className={passwordValidation.hasSpecial ? 'text-green-500' : 'text-gray-600'}>
                Include special character (!@#$%^&*)
              </span>
            </div>
          )}
          {formData.confirmPassword && (
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${passwordValidation.isMatching ? 'text-green-500' : 'text-gray-400'}`}>
                {passwordValidation.isMatching ? '✓' : '○'}
              </span>
              <span className={passwordValidation.isMatching ? 'text-green-500' : 'text-gray-600'}>
                Passwords match
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Role selection cards
  const roleOptions = [
    {
      value: 'client',
      label: 'Client',
      desc: 'Looking to rent or buy properties',
      icon: '🏠'
    },
    {
      value: 'agent',
      label: 'Agent',
      desc: 'Real estate professional helping clients',
      icon: '👔'
    },
    {
      value: 'landlord',
      label: 'Landlord',
      desc: 'Property owner listing for rent or sale',
      icon: '🔑'
    },
    {
      value: 'legal',
      label: 'Legal Practitioner',
      desc: 'Legal professional for property transactions',
      icon: '⚖️'
    },
  ];

  // Step 1: Role Selection Screen
  if (step === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
        <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Large Screens Section */}
          <div className="hidden lg:flex w-full">
            {/* Left Image Section */}
            <div className="lg:w-1/2 relative">
              <Image src={bgpict[0].src} alt={bgpict[0].alt} layout="fill" objectFit="cover" className="custom-rounded" />
            </div>

            {/* Right Role Selection Section */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16">
              <h2 className="text-4xl font-bold text-gradient py-2">Join Qarba</h2>
              <p className="mt-2 text-sm font-bold text-gray-900">First, select your role</p>

              {/* Role Cards */}
              <div className="mt-8 space-y-4">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      handleRoleChange({ target: { value: role.value } });
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      formData.role === role.value
                        ? 'border-[#3ab7b1] bg-gradient-to-r from-[#014d98]/5 to-[#3ab7b1]/5 shadow-md'
                        : 'border-gray-200 hover:border-[#3ab7b1]/50'
                    }`}
                  >
                    <div className="text-4xl">{role.icon}</div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900">{role.label}</h3>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </div>
                    {formData.role === role.value && (
                      <div className="text-[#3ab7b1]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {errors.role && (
                <p className="text-red-500 text-sm mt-4">{errors.role}</p>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinueFromRoleSelection}
                disabled={!formData.role}
                className="mt-8 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-3 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Continue
              </button>

              {/* Sign In Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="text-[#014d98] hover:text-[#3ab7b1] font-semibold">
                  Sign In
                </a>
              </p>
            </div>
          </div>

          {/* Mobile and Small Screens Section */}
          <div className="lg:hidden w-full">
            {/* Image Section */}
            <div className="relative w-full h-64">
              <Image
                src={bgpict[0].src}
                alt={bgpict[0].alt}
                layout="fill"
                objectFit="cover"
                className="rounded-bl-[2.5rem] rounded-br-[2.5rem]"
              />
            </div>

            {/* Role Selection Section */}
            <div className="p-8 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem]">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-2">Join Qarba</h2>
              <p className="mt-2 text-sm font-bold text-gray-900">First, select your role</p>

              {/* Role Cards */}
              <div className="mt-8 space-y-4">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      handleRoleChange({ target: { value: role.value } });
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.role === role.value
                        ? 'border-[#3ab7b1] bg-gradient-to-r from-[#014d98]/5 to-[#3ab7b1]/5 shadow-md'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-4xl">{role.icon}</div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900">{role.label}</h3>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </div>
                    {formData.role === role.value && (
                      <div className="text-[#3ab7b1]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {errors.role && (
                <p className="text-red-500 text-sm mt-4">{errors.role}</p>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinueFromRoleSelection}
                disabled={!formData.role}
                className="mt-8 w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-3 rounded-md text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Continue
              </button>

              {/* Sign In Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="text-[#014d98] hover:text-[#3ab7b1] font-semibold">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Large Screens Section */}
        <div className="hidden lg:flex w-full">
          {/* Left Image Section */}
          <div className="lg:w-1/2 relative">
            <Image src={bgpict[0].src} alt={bgpict[0].alt} layout="fill" objectFit="cover" className="custom-rounded" />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16 relative">
            {/* Back Button - Top Right */}
            <button
              onClick={() => setStep(1)}
              className="absolute top-8 right-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <span>←</span> Back
            </button>

            {/* Role Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white">
                Registering as: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </span>
            </div>

            <h2 className="text-4xl font-bold text-gradient py-2">Create an account</h2>
            <p className="mt-2 text-sm font-bold text-gray-900">Choose your preferred signup method</p>
            <form className="mt-9" onSubmit={handleSubmit}>
              {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
              
              {/* First Name with Label */}
              <div className="mb-5 pt-1 flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <TextInput 
                    type="text" 
                    id="firstname" 
                    placeholder="Enter your first name" 
                    value={formData.firstname} 
                    handleChange={handleChange} 
                  />
                  {getErrorMessage('firstname')}
                </div>
                
                {/* Last Name with Label */}
                <div className="w-1/2">
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <TextInput 
                    type="text" 
                    id="lastname" 
                    placeholder="Enter your last name" 
                    value={formData.lastname} 
                    handleChange={handleChange} 
                  />
                  {getErrorMessage('lastname')}
                </div>
              </div>
              
              {/* Email with Label */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <TextInput 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email address" 
                  value={formData.email} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('email')}
              </div>
              
              {/* Phone Number with Label */}
              <div className="mb-5">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Phone Number <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <TextInput 
                  type="tel" 
                  id="phone" 
                  placeholder="(123) 456-7890" 
                  value={formData.phone} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('phone')}
                
              </div>
              
              {/* Password with Label */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput 
                  id="password" 
                  showPassword={showPassword} 
                  togglePasswordVisibility={togglePasswordVisibility} 
                  value={formData.password} 
                  handleChange={handleChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  placeholder="Create a strong password"
                  bgpict={bgpict} 
                />
                {getErrorMessage('password')}
              </div>
              
              {/* Password Criteria */}
              <PasswordCriteria />
              
              {/* Confirm Password with Label */}
              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                  id="confirmPassword"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  value={formData.confirmPassword}
                  handleChange={handleChange}
                  placeholder="Confirm Password"
                  bgpict={bgpict}
                />
                {getErrorMessage('confirmPassword')}
              </div>
              
              <button 
                type="submit" 
                className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || !Object.values(passwordValidation).every(Boolean)}
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <a href="/terms-conditions" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
            <SignInWithGoogle bgpict={bgpict} formData={formData} />
          </div>
        </div>

        {/* Mobile and Small Screens Section */}
        <div className="lg:hidden w-full">
          {/* Image Section */}
          <div className="relative w-full h-64">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="rounded-bl-[2.5rem] rounded-br-[2.5rem]"
            />
          </div>

          {/* Form Section */}
          <div className="p-8 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem] relative">
            {/* Back Button - Top Right */}
            <button
              onClick={() => setStep(1)}
              className="absolute top-8 right-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <span>←</span> Back
            </button>

            {/* Role Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white">
                Registering as: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </span>
            </div>

            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-2">Create an account</h2>
            <p className="mt-2 text-sm font-bold text-gray-900">Choose your preferred signup method</p>
            <form className="mt-9" onSubmit={handleSubmit}>
              {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
              
              {/* First Name with Label */}
              <div className="mb-5 pt-1">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <TextInput 
                  type="text" 
                  id="firstname" 
                  placeholder="Enter your first name" 
                  value={formData.firstname} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('firstname')}
              </div>
              
              {/* Last Name with Label */}
              <div className="mb-5 pt-1">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <TextInput 
                  type="text" 
                  id="lastname" 
                  placeholder="Enter your last name" 
                  value={formData.lastname} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('lastname')}
              </div>
              
              {/* Email with Label */}
              <div className="mb-5 pt-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <TextInput 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email address" 
                  value={formData.email} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('email')}
              </div>
              
              {/* Phone Number with Label */}
              <div className="mb-5 pt-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Phone Number <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <TextInput 
                  type="tel" 
                  id="phone" 
                  placeholder="(123) 456-78901" 
                  value={formData.phone} 
                  handleChange={handleChange} 
                />
                {getErrorMessage('phone')}
              </div>
              
              {/* Password with Label */}
              <div className="mb-4 pt-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput 
                  id="password" 
                  showPassword={showPassword} 
                  togglePasswordVisibility={togglePasswordVisibility} 
                  value={formData.password} 
                  handleChange={handleChange} 
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  // placeholder="Create a strong password"
                  bgpict={bgpict} 
                />
                {getErrorMessage('password')}
              </div>
              
              {/* Password Criteria */}
              <PasswordCriteria />
              
              {/* Confirm Password with Label */}
              <div className="mb-5 pt-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                  id="confirmPassword"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  value={formData.confirmPassword}
                  handleChange={handleChange}
                   placeholder="Confirm Password"
                  bgpict={bgpict}
                />
                {getErrorMessage('confirmPassword')}
              </div>
              
              <button 
                type="submit" 
                className="mt-10 w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 rounded-md text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || !Object.values(passwordValidation).every(Boolean)}
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <a href="/terms-and-conditions" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
            <SignInWithGoogle bgpict={bgpict} formData={formData} />
          </div>
        </div>
      </div>
      <OTPVerificationModal showModal={showModal} setShowModal={setShowModal} email={formData.email} />
      <EmailSuccessModal showModal={showSuccessModal} setShowModal={setShowSuccessModal} />
      <EmailFailedModal showModal={showFailedModal} setShowModal={setShowFailedModal} />
    </div>
  );
};

export default Register;