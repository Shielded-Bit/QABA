'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentVerifier from '../components/PaymentVerifier'; // Adjust import path based on your project structure

export default function PaymentCallbackPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentReference, setPaymentReference] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    // Get URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const txRef = urlParams.get('tx_ref');
      const transId = urlParams.get('transaction_id');

      setPaymentStatus(status);
      setPaymentReference(txRef);
      setTransactionId(transId);

      // If there's no pending transaction reference in localStorage, 
      // but we have a tx_ref in the URL, store it for verification
      const pendingTxRef = localStorage.getItem('pendingTxRef');
      if (!pendingTxRef && txRef) {
        localStorage.setItem('pendingTxRef', txRef);
      }
    }
  }, []);

  const handlePaymentSuccess = (data) => {
    // Remove automatic redirection - let user control when to proceed via the modal
  };

  const handlePaymentError = (errorMessage) => {
    console.error('Payment verification failed:', errorMessage);
    // No redirect on error as the PaymentVerifier component handles this
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Processing</h1>
        <p className="text-gray-600 mb-6">
          We&apos;re verifying your payment. Please do not close this window.
        </p>
        
        {paymentStatus && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-medium">Status: <span className={`${paymentStatus === 'successful' ? 'text-green-600' : 'text-yellow-600'}`}>
              {paymentStatus}
            </span></p>
            {paymentReference && <p className="text-sm text-gray-600 mt-1">Reference: {paymentReference}</p>}
            {transactionId && <p className="text-sm text-gray-600 mt-1">Transaction ID: {transactionId}</p>}
          </div>
        )}
        
        <div className="animate-pulse flex space-x-4 items-center justify-center">
          <div className="rounded-full bg-blue-400 h-3 w-3"></div>
          <div className="rounded-full bg-blue-400 h-3 w-3"></div>
          <div className="rounded-full bg-blue-400 h-3 w-3"></div>
        </div>
      </div>
      
      {/* The PaymentVerifier component doesn't render anything until it starts verifying */}
      <PaymentVerifier 
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}