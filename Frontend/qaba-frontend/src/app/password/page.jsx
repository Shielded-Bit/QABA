'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { resetPassword } from '../../app/utils/auth/api.js';
import PasswordResetModal from '../components/modal/PasswordResetModal';

const bgpict = [
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737635993/Forgot_password-rafiki_1_iiugtk.png',
    alt: 'Background Image',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737899890/back_1_pvgatr.png',
    alt: 'backward img',
  },
];

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <div className="flex w-full max-w-6xl bg-white py-10 rounded-lg shadow-lg overflow-hidden">
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
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-13">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text text-gradient py-3">
              Forget <br className="md:block" /> your password
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Please enter your registered email address. A confirmation OTP
              <br className="md:block" />
              passcode will be sent to you. Thank you.
            </p>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="mt-1 pt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
              >
                Reset password
              </button>
            </form>
            <div className="mt-5 text-left">
              <a href="signin" className="text-sm text-gradient flex">
                <Image
                  src={bgpict[1].src}
                  alt={bgpict[1].alt}
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-2 text-gradient"
                />{' '}
                Back to Login
              </a>
            </div>
          </div>
        </div>

        {/* Mobile and Small Screens Section */}
        <div className="lg:hidden w-full">
          {/* Image Section */}
          <div className="relative w-full h-72">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="rounded-bl-[2.5rem] rounded-br-[2.5rem]"
            />
          </div>

          {/* Form Section */}
          <div className="p-7 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem]">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text text-gradient py-2">
              Forget your password?
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-1">
              Please enter your registered email address. A confirmation passcode will be sent to you. Thank you.
            </p>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="mt-4">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 py- peer border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-md hover:opacity-90"
              >
                Reset password
              </button>
            </form>

            <div className="mt-5 text-left">
              <a href="signin" className="text-sm text-gradient flex">
                <Image
                  src={bgpict[1].src}
                  alt={bgpict[1].alt}
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-2 text-gradient"
                />{' '}
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal showModal={showModal} setShowModal={setShowModal} email={email} />
    </div>
  );
};

export default SignIn;