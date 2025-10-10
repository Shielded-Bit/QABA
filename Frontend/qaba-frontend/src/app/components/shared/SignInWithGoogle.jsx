'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { googleSignUp } from '../../utils/auth/api';

const SignInWithGoogle = ({ bgpict, formData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // Get the ID token from the credential response
      const idToken = credentialResponse.credential;

      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }

      // Map local role to API user_type
      const roleMap = {
        client: 'CLIENT',
        agent: 'AGENT',
        landlord: 'LANDLORD'
      };

      const userType = roleMap[formData.role] || 'CLIENT';

      // Call backend API with the ID token
      const response = await googleSignUp(idToken, userType);

      if (response.success || response.data) {
        const data = response.data || response;

        // Extract tokens and user details
        const accessTokenFromBackend = data.access;
        const refreshToken = data.refresh;
        const backendUserType = data.user?.user_type;

        if (accessTokenFromBackend && refreshToken && backendUserType) {
          // Store tokens and user type
          localStorage.setItem('access_token', accessTokenFromBackend);
          localStorage.setItem('refresh_token', refreshToken);
          localStorage.setItem('user_type', backendUserType);

          // Fetch user data
          try {
            const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me/`, {
              headers: {
                'Authorization': `Bearer ${accessTokenFromBackend}`,
                'Content-Type': 'application/json',
              },
            });

            if (meResponse.ok) {
              const userData = await meResponse.json();
              localStorage.setItem('user_data', JSON.stringify(userData.data));

              const profilePhotoUrl = userData.data.agentprofile?.profile_photo_url ||
                                    userData.data.clientprofile?.profile_photo_url;
              if (profilePhotoUrl) {
                localStorage.setItem('profile_photo_url', profilePhotoUrl);
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }

          // Redirect based on user type
          if (backendUserType === 'AGENT' || backendUserType === 'LANDLORD') {
            router.push('/agent-dashboard');
          } else if (backendUserType === 'CLIENT') {
            router.push('/dashboard/all-listed-properties');
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error(response.message || 'Google sign up failed');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      setError(error.message || 'Google sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign up was cancelled or failed');
    setLoading(false);
  };

  return (
    <>
      <p className="mt-7 text-left text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/signin" className="text-gradient hover:underline">
          Sign In
        </a>
      </p>

      <div className="mt-10 flex items-center justify-center space-x-2">
        <div className="h-px w-24 sm:w-40 bg-gray-300"></div>
        <span className="text-sm px-1 sm:px-0 text-gray-400">Or Sign up with</span>
        <div className="h-px w-24 sm:w-40 bg-gray-300"></div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-50 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mt-10 flex w-full items-center justify-center">
        {loading ? (
          <button
            disabled
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm opacity-50 cursor-not-allowed"
          >
            <Image
              src={bgpict[1].src}
              alt={bgpict[1].alt}
              width={20}
              height={20}
              className="w-5 h-5 mr-2"
            />
            Signing up...
          </button>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            width="100%"
            size="large"
          />
        )}
      </div>

      <p className="mt-6 text-left text-xs text-gray-900">
        By signing up you accept our{' '}
        <a href="/terms-conditions" className="font-extrabold">
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" className="font-extrabold">
          Privacy Policy
        </a>
      </p>
    </>
  );
};

export default SignInWithGoogle;