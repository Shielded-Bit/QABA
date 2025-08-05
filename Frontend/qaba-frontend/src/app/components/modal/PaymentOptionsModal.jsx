'use client';

import { useState } from 'react';
import { CreditCard, Building2, X } from 'lucide-react';
import BankTransferPayment from './BankTransferPayment';

const PaymentOptionsModal = ({ 
  isOpen, 
  onClose, 
  propertyId, 
  propertyType, 
  price,
  onPaymentMethodSelect 
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!isOpen) return null;

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === 'online') {
      onPaymentMethodSelect('online');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto my-8 transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Choose Payment Method</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!selectedMethod ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Online Payment Option */}
              <button
                onClick={() => handleMethodSelect('online')}
                className="flex flex-col items-center p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Pay Online</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2 max-w-[200px]">
                  Pay securely with your credit/debit card
                </p>
              </button>

              {/* Bank Transfer Option */}
              <button
                onClick={() => handleMethodSelect('bank-transfer')}
                className="flex flex-col items-center p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Bank Transfer</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2 max-w-[200px]">
                  Make a transfer to our bank account
                </p>
              </button>
            </div>
          ) : selectedMethod === 'bank-transfer' ? (
            <BankTransferPayment
              propertyId={propertyId}
              propertyType={propertyType}
              amount={price}
              onBack={() => setSelectedMethod(null)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
