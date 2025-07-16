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
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    setError(null);
    setVerifying(false);
    setVerified(false);
    clearPaymentInfo();
  };

  const handleSuccess = () => {
    handleClose();
    router.push('/dashboard');
  };

  const formatErrorMessage = (error) => {
    // Check if the error is a transaction not found error
    if (error.includes('Transaction not found')) {
      try {
        const errorDetails = JSON.parse(error.split('Details: ')[1]);
        return 'Transaction verification failed. This could be because the transaction is still processing or was not completed. If you believe this is an error, please contact support.';
      } catch (e) {
        return error;
      }
    }
    return error;
  };

  useEffect(() => {
    const verifyPayment = async () => {
      // Get payment info from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const txStatus = urlParams.get('status');
      const txRef = urlParams.get('tx_ref');
      const transactionId = urlParams.get('transaction_id');
      let pendingTxRef = getPendingPaymentRef();
      
      console.log('Payment Verification Started:', {
        urlParams: Object.fromEntries(urlParams.entries()),
        txStatus,
        txRef,
        transactionId,
        pendingTxRef
      });
      
      // If we have a transaction reference in the URL but not in localStorage, store it
      if (txRef && !pendingTxRef) {
        console.log('Storing new transaction reference:', txRef);
        storePaymentInfo(txRef, transactionId);
        pendingTxRef = txRef;
      }
      
      // Only proceed if we have a transaction reference and status parameter
      if ((pendingTxRef || txRef) && txStatus) {
        try {
          setVerifying(true);
          
          const referenceToVerify = txRef || pendingTxRef; // Prioritize the URL parameter
          console.log('Making verification request with:', {
            reference: referenceToVerify,
            apiUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify-payment/${referenceToVerify}/`
          });

          const authToken = getAuthToken();
          if (!authToken) {
            console.error('No auth token found');
            throw new Error('Authentication required. Please log in again.');
          }
          
          const formattedRef = referenceToVerify.trim();
          
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify-payment/${formattedRef}/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
              },
            });
            
            console.log('Verification response received:', {
              status: response.status,
              ok: response.ok,
              statusText: response.statusText
            });

            if (!response.ok) {
              if (response.status === 401) {
                console.error('Authentication failed:', await response.text());
                localStorage.removeItem('access_token');
                localStorage.removeItem('auth_token');
                throw new Error('Authentication expired. Please log in again.');
              } else if (response.status === 404) {
                const errorData = await response.json();
                console.error('Transaction not found:', errorData);
                throw new Error(`Transaction not found. Details: ${JSON.stringify(errorData)}`);
              } else {
                const errorText = await response.text();
                console.error(`Verification failed with status ${response.status}:`, errorText);
                throw new Error(`Verification failed with status ${response.status}`);
              }
            }
          
            const data = await response.json();
            console.log('Payment verification full response:', data);
            
            if (data.success && data.data?.status === "successful") {
              console.log('Payment verified successfully');
              setVerified(true);
              clearPaymentInfo();
              
              if (onSuccess) onSuccess(data);
              
              // Only clear URL parameters, don't automatically close modal
              const url = new URL(window.location);
              url.search = '';
              window.history.replaceState({}, '', url);
            } else {
              console.error('Payment verification returned unsuccessful:', data);
              throw new Error(data.message || 'Payment verification failed');
            }
          } catch (networkError) {
            console.error('Network error during verification:', networkError);
            throw networkError;
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setError(err.message);
          if (onError) onError(err.message);
        } finally {
          setVerifying(false);
        }
      } else {
        console.log('Skipping verification - missing required parameters:', {
          hasPendingTxRef: !!pendingTxRef,
          hasTxRef: !!txRef,
          hasStatus: !!txStatus
        });
      }
    };

    verifyPayment();
  }, [onSuccess, onError]);

  // Don't render if modal should be hidden
  if (!showModal || (!verifying && !verified && !error)) return null;

  return (
    <div className={`fixed top-0 left-0 w-full ${verifying || verified || error ? 'bg-black bg-opacity-50' : ''} h-full flex items-center justify-center z-50`}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
        {/* Close button - only show for error state */}
        {error && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {verifying && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we confirm your transaction.</p>
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
            <p className="text-gray-500 mt-1 text-sm">You can now proceed to your dashboard to view your transaction details.</p>
            <button 
              onClick={handleSuccess}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
            <p className="text-gray-600 mt-2">{formatErrorMessage(error)}</p>
            <p className="text-gray-500 mt-1">Please contact support if your account was debited.</p>
            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <button 
                onClick={() => {
                  if (error.includes('Authentication')) {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    router.push('/signin');
                  } else {
                    handleClose();
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {error.includes('Authentication') ? 'Log In' : 'Close'}
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