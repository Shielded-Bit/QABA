"use client";
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, CheckCircle2, AlertCircle, Shield, Key } from 'lucide-react';
import Cookies from 'js-cookie';
import useLogout from "../../../hooks/useLogout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com';

export default function PasswordPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { logout } = useLogout();

  const getAuthToken = () => {
    return Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = getAuthToken();
      setIsAuthenticated(!!token);

      if (!token) {
        toast.error('You must be logged in to change your password');
        return;
      }

      try {
        const storedEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email');
        if (storedEmail) {
          setUserEmail(storedEmail);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/profile/`, {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const email = userData.email;
          setUserEmail(email);
          localStorage.setItem('user_email', email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const sendPasswordResetEmail = async () => {
    const email = userEmail;
    if (!email) {
      toast.error('Unable to get your email address. Please try logging in again.');
      return;
    }

    setIsRequestingReset(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmailSent(true);
        toast.success('Password reset email sent successfully!');
        await logout();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setIsRequestingReset(false);
    }
  };

  const resendPasswordResetEmail = async () => {
    setEmailSent(false);
    await sendPasswordResetEmail();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Authentication Required</h2>
          <p className="mt-2 text-gray-500">Please log in to change your password.</p>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="text-center py-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Email Sent!</h2>
          <div className="mb-6">
            <Mail className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;ve sent a password reset link to <strong>{userEmail}</strong>. Click the link in your email to reset your password securely.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700">For security, the reset link will expire in 1 hour.</p>
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={resendPasswordResetEmail}
              disabled={isRequestingReset}
              className="px-6 py-3 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg font-medium hover:from-[#3ab7b1] hover:to-[#014d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014d98] transition-all duration-300 disabled:opacity-50"
            >
              {isRequestingReset ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => setEmailSent(false)}
              className="block mx-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Password Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
        <p className="text-gray-600">Update your password to keep your account secure</p>
      </div>
      <div className="max-w-lg">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Account Email</p>
              <p className="text-sm text-gray-600">{userEmail || 'Loading...'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={sendPasswordResetEmail}
          disabled={isRequestingReset || !userEmail}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg font-medium hover:from-[#3ab7b1] hover:to-[#014d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRequestingReset ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Sending Reset Email...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Key size={20} className="mr-3" />
              Send Password Reset Email
            </div>
          )}
        </button>
      </div>
    </div>
  );
}