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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-2 sm:my-4 lg:my-6 transform transition-all scale-100 max-h-[90vh] lg:max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Choose Payment Method</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 lg:p-4 xl:p-5">
          {!selectedMethod ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {/* Online Payment Option */}
              <button
                onClick={() => handleMethodSelect('online')}
                className="flex flex-col items-center p-2 sm:p-3 lg:p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:scale-[1.02] min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 text-center">Pay Online</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-500 text-center mt-1 sm:mt-2 lg:mt-3 max-w-[200px] lg:max-w-[250px]">
                  Pay securely with your credit/debit card
                </p>
              </button>

              {/* Bank Transfer Option */}
              <button
                onClick={() => handleMethodSelect('bank-transfer')}
                className="flex flex-col items-center p-2 sm:p-3 lg:p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:scale-[1.02] min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 text-center">Bank Transfer</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-500 text-center mt-1 sm:mt-2 lg:mt-3 max-w-[200px] lg:max-w-[250px]">
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
