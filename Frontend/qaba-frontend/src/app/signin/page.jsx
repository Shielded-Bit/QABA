'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { signIn } from '../../app/utils/auth/api.js';
import TextInput from '../components/shared/TextInput.jsx';
import PasswordInput from '../components/shared/PasswordInput.jsx';

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
    alt: 'hide password',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737901695/view_qioayd.png',
    alt: 'view password',
  },
];

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    const requestData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await signIn(requestData);
      
      // Extract token and user details
      const accessToken = response.data?.access;
      const userType = response.data?.user?.user_type;

      if (!accessToken || !userType) {
        throw new Error("Invalid login response: Missing token or user type.");
      }

      // Store token and user type in localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_type", userType);

      // Redirect based on role
      if (userType === "AGENT") {
        router.push("/agent-dashboard");
      } else if (userType === "CLIENT") {
        router.push("/dashboard");
      } else {
        setGeneralError("Unknown user role: " + userType);
      }
    } catch (error) {
      console.error("Sign-in failed", error);
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.non_field_errors?.[0] || 
                           "Sign-in failed. Please check your credentials.";
      setGeneralError(errorMessage);
      
      // Handle specific errors from backend if available
      if (error.response?.data?.email) {
        setErrors(prev => ({ ...prev, email: error.response.data.email[0] }));
      }
      if (error.response?.data?.password) {
        setErrors(prev => ({ ...prev, password: error.response.data.password[0] }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Large Screens Section */}
        <div className="hidden lg:flex w-full">
          {/* Left Image Section */}
          <div className="lg:w-1/2 relative">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="custom-rounded"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-3">
              Sign In
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Sign in so that you can buy and rent with us at
              <br className="md:block" />
              your convenience
            </p>

            <form className="mt-6" onSubmit={handleSubmit} noValidate aria-label="Sign in form">
              {generalError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-400 text-red-700 rounded">
                  {generalError}
                </div>
              )}
              
              <div className="mt-1 pt-1">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <TextInput 
                  type="email" 
                  id="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  handleChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative mt-1 pt-7">
                <label htmlFor="password" className="sr-only">Password</label>
                <PasswordInput 
                  id="password" 
                  showPassword={showPassword} 
                  togglePasswordVisibility={togglePasswordVisibility} 
                  value={formData.password} 
                  handleChange={handleChange} 
                  bgpict={bgpict}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="mt-2 text-left">
                <a href="password" className="text-sm text-gradient">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-9 text-left text-sm text-gray-600">
              Don&apos;t have an account yet?{' '}
              <a href="create-account" className="text-gradient hover:underline">
                Register
              </a>
            </p>

            <div className="mt-10 flex items-center justify-center space-x-2">
              <div className="h-px w-40 bg-gray-300"></div>
              <span className="text-sm text-gray-400">Or Sign in with</span>
              <div className="h-px w-40 bg-gray-300"></div>
            </div>

            <button
              type="button"
              className="mt-10 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-300"
            >
              <img
                src={bgpict[1].src}
                alt={bgpict[1].alt}
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>

            <p className="mt-6 text-left text-xs text-gray-900">
              By signing in you accept our{' '}
              <a href="#" className="font-extrabold">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="font-extrabold">
                Privacy Policy
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

          {/* Form Section */}
          <div className="p-8 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem]">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-3">
              Sign In
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Sign in so that you can buy and rent with us conveniently.
            </p>

            <form className="mt-6" onSubmit={handleSubmit} noValidate aria-label="Sign in form - mobile">
              {generalError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-400 text-red-700 rounded">
                  {generalError}
                </div>
              )}
              
              <div className="mt-4">
                <label htmlFor="mobile-email" className="sr-only">Email Address</label>
                <TextInput 
                  type="email" 
                  id="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  handleChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "mobile-email-error" : undefined}
                />
                {errors.email && (
                  <p id="mobile-email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative mt-9">
                <label htmlFor="mobile-password" className="sr-only">Password</label>
                <PasswordInput 
                  id="password" 
                  showPassword={showPassword} 
                  togglePasswordVisibility={togglePasswordVisibility} 
                  value={formData.password} 
                  handleChange={handleChange} 
                  bgpict={bgpict}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "mobile-password-error" : undefined}
                />
                {errors.password && (
                  <p id="mobile-password-error" className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="mt-3 text-left">
                <a href="password" className="text-sm text-gradient">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-left text-sm text-gray-600">
              Don&apos;t have an account yet?{' '}
              <a href="create-account" className="text-gradient hover:underline">
                Register
              </a>
            </p>

            <div className="mt-10 flex items-center justify-center space-x-2">
              <div className="h-px w-24 bg-gray-300"></div>
              <span className="text-sm px-1 text-gray-400">Or Sign in with</span>
              <div className="h-px w-24 bg-gray-300"></div>
            </div>

            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-300"
            >
              <img
                src={bgpict[1].src}
                alt={bgpict[1].alt}
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>

            <p className="mt-6 text-left text-xs text-gray-900">
              By signing in you accept our{' '}
              <a href="#" className="font-extrabold">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="font-extrabold">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;