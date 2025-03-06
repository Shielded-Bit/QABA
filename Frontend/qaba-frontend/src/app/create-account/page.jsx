'use client'; // Ensures this is a client-side component in Next.js

import React, { useState } from 'react';
import Image from 'next/image';
import EmailSuccessModal from '../components/modal/EmailSuccessModal.jsx';
import EmailFailedModal from '../components/modal/EmailFailedModal.jsx';
import RoleSelection from '../components/shared/RoleSelection';
import SignInWithGoogle from '../components/shared/SignInWithGoogle';
import PasswordInput from '../components/shared/PasswordInput';
import TextInput from '../components/shared/TextInput';
import { registerClient, registerAgent, sendVerificationEmail } from '../../app/utils/auth/api.js'; // Import functions
import EmailVerificationModal from '../components/modal/ EmailVerificationModal.jsx';

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

const Register = () => {
  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "agent", // Default role
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Toggles password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Updates form input state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Updates selected role
  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading

    const requestData = {
      username: formData.email.split("@")[0], // Generate username from email
      email: formData.email,
      password: formData.password,
      first_name: formData.firstname,
      last_name: formData.lastname,
    };

    try {
      let response;
      if (formData.role === "client") {
        response = await registerClient(requestData);
      } else {
        response = await registerAgent(requestData);
      }

      // Send verification email
      // await sendVerificationEmail(formData.email);

      setShowModal(true); // Show email verification modal
    } catch (error) {
      console.error("Registration failed", error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // Stop loading
    }
  };

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
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16">
            <h2 className="text-4xl font-bold text-gradient py-2">Create an account</h2>
            <p className="mt-2 text-sm font-bold text-gray-900">Register to buy and rent with us</p>
            <form className="mt-9" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mb-5 pt-1 flex space-x-4">
                <TextInput type="text" id="firstname" placeholder="First Name" value={formData.firstname} handleChange={handleChange} />
                <TextInput type="text" id="lastname" placeholder="Last Name" value={formData.lastname} handleChange={handleChange} />
              </div>
              <TextInput type="email" id="email" placeholder="Email Address" value={formData.email} handleChange={handleChange} />
              <PasswordInput id="password" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.password} handleChange={handleChange} bgpict={bgpict} />
              <PasswordInput id="confirmPassword" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.confirmPassword} handleChange={handleChange} bgpict={bgpict} />
              <RoleSelection formData={formData} handleRoleChange={handleRoleChange} />
              <button type="submit" className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Registering..." : "Sign Up"}</button>
            </form>
            <SignInWithGoogle bgpict={bgpict} />
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
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-2">Create an account</h2>
            <p className="mt-2 text-sm font-bold text-gray-900">Register to buy and rent with us</p>
            <form className="mt-9" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mb-5 pt-1">
                <TextInput type="text" id="firstname" placeholder="First Name" value={formData.firstname} handleChange={handleChange} />
              </div>
              <div className="mb-5 pt-1">
                <TextInput type="text" id="lastname" placeholder="Last Name" value={formData.lastname} handleChange={handleChange} />
              </div>
              <div className="mb-5 pt-1">
                <TextInput type="email" id="email" placeholder="Email Address" value={formData.email} handleChange={handleChange} />
              </div>
              <div className="mb-5 pt-1">
                <PasswordInput id="password" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.password} handleChange={handleChange} bgpict={bgpict} />
              </div>
              <div className="mb-5 pt-1">
                <PasswordInput id="confirmPassword" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.confirmPassword} handleChange={handleChange} bgpict={bgpict} />
              </div>
              <div className="mb-5 pt-1">
                <RoleSelection formData={formData} handleRoleChange={handleRoleChange} />
              </div>
              <button type="submit" className="mt-10 w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Registering..." : "Sign Up"}</button>
            </form>
            <SignInWithGoogle bgpict={bgpict} />
          </div>
        </div>
      </div>
      <EmailVerificationModal showModal={showModal} setShowModal={setShowModal} email={formData.email} />
      <EmailSuccessModal showModal={showSuccessModal} setShowModal={setShowSuccessModal} />
      <EmailFailedModal showModal={showFailedModal} setShowModal={setShowFailedModal} />
    </div>
  );
};

export default Register;