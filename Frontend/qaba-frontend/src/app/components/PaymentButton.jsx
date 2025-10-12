'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuthToken, 
  isAuthenticated, 
  storePaymentInfo, 
  storeRedirectUrl 
} from '../utils/paymentUtils';
import { handle401Error } from '../../utils/authHandler';
import { X } from 'lucide-react';
import PaymentOptionsModal from '../components/modal/PaymentOptionsModal';

const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Payment Error</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-center text-gray-700 mb-6">{errorMessage}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-700 to-teal-500 text-white py-2 px-8 rounded-lg font-medium shadow-md hover:opacity-90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentButton = ({ propertyId, propertyType, price, buttonText = 'Proceed for Payment' }) => {
  const router = useRouter();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [authStatus, setAuthStatus] = useState({ 
    checked: false, 
    authenticated: false 
  });

  useEffect(() => {
    // Check authentication status
    setAuthStatus({ 
      checked: true, 
      authenticated: isAuthenticated() 
    });
  }, []);

  // Extract error message from API response
  const extractErrorMessage = (errorData) => {
    // Check if the error is the specific property status error
    if (errorData.errors && errorData.errors.property_id) {
      return errorData.errors.property_id[0];
    }
    
    // Fall back to other error messages
    if (errorData.message) return errorData.message;
    if (errorData.error) return errorData.error;
    
    // If no specific error found
    return 'Unable to process payment. Please try again later.';
  };

  // Function to handle payment initiation
  const handlePaymentInitiation = async () => {
    if (!propertyId) {
      setPaymentError("Property information not available");
      return;
    }

    // If not authenticated, redirect to login
    if (!authStatus.authenticated) {
      // Store the current URL to redirect back after login
      storeRedirectUrl(window.location.pathname);
      router.push('/signin');
      return;
    }
    
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/initiate-property-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          currency: 'NGN',
          payment_type: propertyType === 'SALE' ? 'purchase' : 'rent',
          amount: price, // Optional - backend might calculate the amount
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Handle different error statuses
        if (response.status === 401) {
          // Authentication failed - session expired
          handle401Error(response, new Error('Session expired. Please log in again.'));
          return;
        } else {
          // Extract and handle property availability errors
          const errorMessage = extractErrorMessage(responseData);
          
          // Check if it's a property status error
          if (errorMessage.includes('Property is not available') || 
              errorMessage.includes('Current status: Rented') || 
              errorMessage.includes('Current status: Sold')) {
            // Show modal for property status errors
            setModalErrorMessage(errorMessage);
            setIsModalOpen(true);
            return;
          }
          
          throw new Error(errorMessage);
        }
      }
      
      if (responseData.success && responseData.data?.payment_link) {
        // Store transaction reference in localStorage for verification after redirect
        if (responseData.data.transaction?.reference) {
          storePaymentInfo(responseData.data.transaction.reference, propertyId);
        }
        
        // Redirect to payment gateway
        window.location.href = responseData.data.payment_link;
      } else {
        throw new Error('Invalid payment response');
      }
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentError(err.message || 'Failed to initiate payment');
      
      // If authentication error, redirect to login
      if (err.message.includes('Authentication')) {
        storeRedirectUrl(window.location.pathname);
        setTimeout(() => {
          router.push('/signin');
        }, 1500);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    if (method === 'online') {
      handlePaymentInitiation();
    }
    // Bank transfer is handled within the BankTransferPayment component
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalErrorMessage('');
  };

  return (
    <div>
      <button 
        className={`w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:opacity-90 transition-all ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={() => setShowPaymentOptions(true)}
        disabled={paymentLoading || !authStatus.checked}
      >
        {paymentLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
      
      {/* Payment Options Modal */}
      <PaymentOptionsModal
        isOpen={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        propertyId={propertyId}
        propertyType={propertyType}
        price={price}
        onPaymentMethodSelect={handlePaymentMethodSelect}
      />
      
      {/* Small inline error for non-critical errors */}
      {paymentError && !isModalOpen && (
        <p className="mt-2 text-sm text-red-600">{paymentError}</p>
      )}
      
      {/* Modal for critical errors like property availability */}
      <ErrorModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        errorMessage={modalErrorMessage}
      />
    </div>
  );
};

export default PaymentButton;