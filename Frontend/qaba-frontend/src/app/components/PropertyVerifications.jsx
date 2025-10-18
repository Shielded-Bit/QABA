'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const PropertyVerifications = ({ propertyId, isVerified = false }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        
        // When the backend endpoint is ready, replace this with an actual API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${propertyId}/verifications`);
        // if (!response.ok) throw new Error('Failed to fetch verifications');
        // const data = await response.json();
        // setVerifications(data.verifications);
        
        // Mock data until backend is ready
        setTimeout(() => {
          // Only show Qarba verification if isVerified is true
          const verificationsData = isVerified ? [
            {
              id: 1,
              agency: 'Qarba ',
              verified: true,
              verifiedDate: '2025-04-15',
              logo: '/assets/images/shieldedbit-logo.png', // Replace with your actual logo path
              isPrimary: true,
              verificationDetails: 'Property inspected and verified by Qarba team.'
            },
            // {
            //   id: 2,
            //   agency: 'Nigerian Real Estate Association',
            //   verified: true,
            //   verifiedDate: '2025-04-10',
            //   logo: '/api/placeholder/64/64', // Replace with actual logo when available
            //   isPrimary: false,
            //   verificationDetails: 'Property meets NREA standards.'
            // },
            // {
            //   id: 3,
            //   agency: 'Ebonyi Housing Authority',
            //   verified: false,
            //   verifiedDate: null,
            //   logo: '/api/placeholder/64/64', // Replace with actual logo when available
            //   isPrimary: false,
            //   verificationDetails: 'Verification pending.'
            // }
          ] : [];
          setVerifications(verificationsData);
          setLoading(false);
        }, 500); // Simulate API delay
        
      } catch (err) {
        console.error('Error fetching verifications:', err);
        setError('Failed to load verification data');
        setLoading(false);
      }
    };
    
    if (propertyId) {
      fetchVerifications();
    }
  }, [propertyId, isVerified]);
  
  // Don't show anything while loading if not verified
  if (loading && !isVerified) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-100 rounded-lg bg-red-50 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // Hide entire section if not verified
  if (!isVerified) {
    return null;
  }

  const primaryVerification = verifications.find(v => v.isPrimary && v.verified);
  const otherVerifications = verifications.filter(v => !v.isPrimary);
  
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
        Verifications
      </h3>
      
      {/* Primary Verification (Shieldedbit) */}
      {primaryVerification && (
        <div className="p-4 mb-3 border border-green-300 rounded-lg bg-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-4.03 2.39a.75.75 0 01-1.12-.79l.77-4.49-3.26-3.19a.75.75 0 01.41-1.28l4.51-.66 2.02-4.08a.75.75 0 011.34 0l2.02 4.08 4.51.66a.75.75 0 01.41 1.28l-3.26 3.19.77 4.49a.75.75 0 01-1.12.79L12 17.75z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                    Verified by {primaryVerification.agency}
                  </span>
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(primaryVerification.verifiedDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {primaryVerification.verificationDetails}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Other Verifications */}
      {otherVerifications.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
          {otherVerifications.map((verification) => (
            <div 
              key={verification.id} 
              className={`p-3 flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${verification.verified ? '' : 'opacity-70'}`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-100 relative flex-shrink-0">
                {verification.logo ? (
                  <Image
                    src={verification.logo}
                    alt={`${verification.agency} logo`}
                    fill
                    className="rounded-full object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200">
                    {verification.agency.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-800">
                    {verification.agency}
                  </span>
                  
                  {verification.verified ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-0.5">
                  {verification.verificationDetails}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {verifications.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm text-center">
          <p className="text-gray-500">No verification data available</p>
        </div>
      )}
    </div>
  );
};

export default PropertyVerifications;