'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuthToken, 
  clearPaymentInfo, 
  getPendingPaymentRef,
  storePaymentInfo 
} from '../utils/paymentUtils';

const PaymentVerifier = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get payment info from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const txStatus = urlParams.get('status');
      const txRef = urlParams.get('tx_ref');
      const transactionId = urlParams.get('transaction_id');
      let pendingTxRef = getPendingPaymentRef();
      
      console.log('URL params:', { txStatus, txRef, transactionId });
      console.log('Pending txRef from localStorage:', pendingTxRef);
      
      // If we have a transaction reference in the URL but not in localStorage, store it
      if (txRef && !pendingTxRef) {
        storePaymentInfo(txRef, transactionId);
        pendingTxRef = txRef;
      }
      
      // Only proceed if we have a transaction reference and status parameter
      if ((pendingTxRef || txRef) && txStatus) {
        try {
          setVerifying(true);
          
          const referenceToVerify = txRef || pendingTxRef; // Prioritize the URL parameter
          console.log('Verifying payment with reference:', referenceToVerify);
          const authToken = getAuthToken();
          
          // Check if we have a valid auth token
          if (!authToken) {
            throw new Error('Authentication required. Please log in again.');
          }
          
          // Ensure consistent case for transaction reference
          // Your backend might be case-sensitive
          const formattedRef = referenceToVerify.trim();
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/verify-payment/${formattedRef}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              // Auth token is invalid or expired
              localStorage.removeItem('access_token');
              localStorage.removeItem('auth_token');
              throw new Error('Authentication expired. Please log in again.');
            } else if (response.status === 404) {
              // Try to get more details from the response
              const errorData = await response.json();
              throw new Error(`Transaction not found. Details: ${JSON.stringify(errorData)}`);
            } else {
              throw new Error(`Verification failed with status ${response.status}`);
            }
          }
          
          const data = await response.json();
          console.log('Payment verification response:', data);
          
          if (data.success && data.data?.status === "successful") {
            // Payment successful
            setVerified(true);
            clearPaymentInfo();
            
            // Call the success callback
            if (onSuccess) onSuccess(data);
            
            // Clear URL parameters after a short delay
            setTimeout(() => {
              const url = new URL(window.location);
              url.search = '';
              window.history.replaceState({}, '', url);
            }, 2000);
          } else {
            // Payment failed or pending
            throw new Error(data.message || 'Payment verification failed');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setError(err.message);
          if (onError) onError(err.message);
        } finally {
          setVerifying(false);
        }
      }
    };

    verifyPayment();
  }, [onSuccess, onError]);

  // Don't render anything if not verifying or already verified
  if (!verifying && !verified && !error) return null;

  return (
    <div className={`fixed top-0 left-0 w-full ${verifying || verified || error ? 'bg-black bg-opacity-50' : ''} h-full flex items-center justify-center z-50`}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        {verifying && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
          </div>
        )}
        
        {verified && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Payment Successful!</h3>
            <p className="text-gray-600 mt-2">Thank you for your purchase. Your transaction has been completed successfully.</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
        
        {error && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Payment Verification Failed</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <p className="text-gray-500 mt-1">Please contact support if your account was debited.</p>
            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <button 
                onClick={() => {
                  if (error.includes('Authentication')) {
                    // If authentication error, redirect to login
                    localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    router.push('/signin');
                  } else {
                    // Otherwise just reload
                    window.location.reload();
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {error.includes('Authentication') ? 'Log In' : 'Try Again'}
              </button>
              
              <button 
                onClick={() => router.push('/contact')}
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerifier;