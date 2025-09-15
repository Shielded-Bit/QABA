'use client';

import { useState } from 'react';
import { Copy, ChevronLeft, Upload, Check, X } from 'lucide-react';
import Link from 'next/link';

const BankTransferPayment = ({ propertyId, propertyType, amount, onBack }) => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedSwift, setCopiedSwift] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');



  // Bank account details (you can move this to environment variables or API)
  const bankDetails = {
    bankName: "Fidelity Bank",
    accountNumber: "5280000840",
    accountName: "SHIELDEDBIT LTD",
    swiftCode: "FIDTNGLA",
  };

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } catch (err) {
      console.error('Failed to copy account number:', err);
    }
  };

  const handleCopySwiftCode = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.swiftCode);
      setCopiedSwift(true);
      setTimeout(() => setCopiedSwift(false), 2000);
    } catch (err) {
      console.error('Failed to copy swift code:', err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert('Please upload your payment receipt');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData();
      formData.append('property_id', propertyId);
      formData.append('payment_receipt', uploadedFile);

      const authToken = localStorage.getItem('access_token');
      if (!authToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offline-payment/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setErrorMessage('');
      } else {
        // Handle API error response
        if (data.errors) {
          const errorMessages = [];
          
          // Handle non-field errors
          if (data.errors.non_field_errors) {
            errorMessages.push(...data.errors.non_field_errors);
          }
          
          // Handle other field-specific errors if they exist
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (field !== 'non_field_errors') {
              errorMessages.push(...messages.map(msg => `${field}: ${msg}`));
            }
          });
          
          // If we have specific error messages, use them
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join('\n'));
          }
        }
        
        // Fallback to message or generic error
        throw new Error(data.message || 'Failed to submit payment verification');
      }
    } catch (error) {
      console.error('Payment verification submission failed:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit payment verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to payment methods
      </button>

      {/* Bank Details Section */}
      <div className="bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-xl space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Bank Account Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Bank Name</p>
            <p className="font-medium text-sm sm:text-base">{bankDetails.bankName}</p>
          </div>
          
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Account Name</p>
            <p className="font-medium text-sm sm:text-base">{bankDetails.accountName}</p>
          </div>
          
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Account Number</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm sm:text-base">{bankDetails.accountNumber}</p>
              <button
                onClick={handleCopyAccountNumber}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Copy account number"
              >
                {copiedAccount ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Swift Code</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm sm:text-base">{bankDetails.swiftCode}</p>
              <button
                onClick={handleCopySwiftCode}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Copy swift code"
              >
                {copiedSwift ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Upload Payment Receipt</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col items-center">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
              Drag and drop your receipt here, or click to select file
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="receipt-upload"
            />
            <label
              htmlFor="receipt-upload"
              className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
            >
              Select File
            </label>
          </div>
          {uploadedFile && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 truncate flex-1 mr-2">{uploadedFile.name}</span>
              <button
                onClick={() => setUploadedFile(null)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!uploadedFile || isSubmitting}
          className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base ${
            !uploadedFile || isSubmitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Payment Verification'}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 text-green-800 rounded-lg">
            Payment verification submitted successfully. We will review and confirm your payment.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg space-y-2">
            {errorMessage.split('\n').map((message, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <p>{message}</p>
              </div>
            ))}
            {!errorMessage && (
              <p>
                Failed to submit payment verification. Please try again or{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                  contact support
                </Link>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankTransferPayment;