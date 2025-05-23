'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const bgpict = [
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737635993/Reset_password-bro_1_b4yl6r.png',
    alt: 'Background Image',
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

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  // Redirect if no token is found
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token. Please check your email and try again.');
    }
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing token. Please check your email again.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://qaba.onrender.com/api/v1/auth/password-reset/confirm/', {
        token,
        new_password: password,
      });

      console.log('Response:', response.data);
      setSuccess(true);
      setTimeout(() => router.push('/signin'), 2000);
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
      <div className="flex w-full max-w-6xl h-[513px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden lg:flex w-1/2 relative mt-6">
          <Image src={bgpict[0].src} alt={bgpict[0].alt} layout="fill" objectFit="cover" className="custom-rounded" />
        </div>
        <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16 mt-11">
          <h2 className="text-4xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm font-bold text-gray-900">Enter your new password</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Password updated successfully!</p>}
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="relative mt-1 pt-7">
              <input
                type={showPassword ? 'text' : 'password'}
                className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-0 top-[39px] px-2">
                <Image src={showPassword ? bgpict[2].src : bgpict[1].src} alt="Toggle Password" width={20} height={20} />
              </button>
            </div>
            <div className="relative mt-9">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-2 py-2 border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm focus:outline-none"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Done'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// This is crucial - make sure you have the default export
export default NewPassword;