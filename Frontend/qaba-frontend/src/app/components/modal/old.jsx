'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { registerClient, registerAgent } from '../../app/utils/auth/api.js';
import EmailVerificationModal from '../components/modal/ EmailVerificationModal.jsx';
import EmailSuccessModal from '../components/modal/EmailSuccessModal.jsx';
import Button from '../components/shared/Button';


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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "agent", // default role
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading

    const requestData = {
      username: formData.email.split("@")[0], // Generate a username from the email
      email: formData.email,
      password: formData.password,
      first_name: formData.firstname,
      last_name: formData.lastname,
    };

    console.log("Request Data:", requestData); // Log the request data

    try {
      let response;
      if (formData.role === "client") {
        response = await registerClient(requestData);
      } else {
        response = await registerAgent(requestData);
      }
      console.log("Response:", response);
      setShowModal(true);
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
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-2">
              Create an account
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900">
              Register with us so that you can buy and rent with
              <br className="md:block" />
               us at your convenience
            </p>

            <form className="mt-9" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mb-5 pt-1 flex space-x-4">
                <input
                  type="text"
                  id="firstname"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="First Name"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  id="lastname"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Last Name"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-1 pt-1">
                <input
                  type="email"
                  id="email"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative mt-1 pt-5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-[30px]  transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="relative mt-5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="px-2">
                <h2 className="text-sm mt-3 font-bold text-gray-800 mb-4">Please select your role:</h2>
                <div className="space-y-3">
                  {/* Client Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      className="w-4 h-4 text-gradient "
                      checked={formData.role === 'client'}
                      onChange={handleRoleChange}
                    />
                    <span className="text-[16px] font-medium text-gray-900">Client:</span>
                    <span className="text-sm text-gray-500">Choose this if you’re looking to access services</span>
                  </label>

                  {/* Agent Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="agent"
                      className="w-4 h-4 text-gradient border-gray-300"
                      checked={formData.role === 'agent'}
                      onChange={handleRoleChange}
                    />
                    <span className="text-[16px] font-medium text-gray-900">Agent:</span>
                    <span className="text-sm text-gray-500">Choose this if you’re offering services</span>
                  </label>
                </div>
              </div>

              <button
  type="submit"
  className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={loading}
>
  {loading ? "Registering..." : "Sign Up"}
</button>

            </form>

            <p className="mt-7 text-left text-sm text-gray-600">
              Already have an account? {''}
              <a href="signin" className="text-gradient hover:underline">
                Sign In
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
          <div className="py-8 px-5 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem]">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-3">
              Sign In
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Sign in so that you can buy and rent with us conveniently.
            </p>

            <form className="mt-5" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mb-6 pt-1 flex space-x-3">
                  <input
                    type="text"
                    id="firstname"
                    className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                    placeholder="First Name"
                    required
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="lastname"
                    className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                    placeholder="Last Name"
                    required
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
              <div className="mt-4">
                <input
                  type="email"
                  id="email"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative mt-6">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="relative mt-6">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="mt-3 text-left">
                <a href="password" className="text-sm text-gradient">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-md hover:opacity-90"
              >
                Sign In
              </button>
            </form>

            <p className="mt-7 text-left text-sm text-gray-600">
              Don&apos;t have an account yet?{' '}
              <a href="signin/page2.jsx" className="text-gradient hover:underline">
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
  {/* Button to open the success modal */}
  <Button
        label="Open Success Modal"
        onClick={() => setShowSuccessModal(true)}
        variant="primary"
      />
      <EmailVerificationModal showModal={showModal} setShowModal={setShowModal} email={formData.email} />
      <EmailSuccessModal showModal={showSuccessModal} setShowModal={setShowSuccessModal} />

    </div>
  );
};

export default Register;