'use client';
import React, { useState } from 'react';
import Image from 'next/image';
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
const [formData, setFormData] = useState({
  email: '',
  password: '',
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false); // Add loading state

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.id]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true); // Start loading

  const requestData = {
    email: formData.email,
    password: formData.password,
  };

  console.log('Request Data:', requestData); // Log the request data

  try {
    const response = await signIn(requestData);
    console.log('Response:', response); // Log the response
    alert('Sign-in successful');
  } catch (error) {
    console.error('Sign-in failed', error);
    setError(error.response?.data?.message || 'Sign-in failed');
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
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-3">
              Sign In
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Sign in so that you can buy and rent with us at
              <br className="md:block" />
              your convenience
            </p>

            <form className="mt-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mt-1 pt-1">
              <TextInput type="email" id="email" placeholder="Email Address" value={formData.email} handleChange={handleChange} />

              </div>

              <div className="relative mt-1 pt-7">
              <PasswordInput id="password" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.password} handleChange={handleChange} bgpict={bgpict} />

              
              </div>

              <div className="mt-2 text-left">
                <a href="password" className="text-sm text-gradient">
                  Forgot password?
                </a>
              </div>

              <button
  type="submit"
  className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 disabled:cursor-not-allowed"
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

            <form className="mt-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mt-4">
              <TextInput type="email" id="email" placeholder="Email Address" value={formData.email} handleChange={handleChange} />

              </div>

              <div className="relative mt-9">
              <PasswordInput id="password" showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} value={formData.password} handleChange={handleChange} bgpict={bgpict} />

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