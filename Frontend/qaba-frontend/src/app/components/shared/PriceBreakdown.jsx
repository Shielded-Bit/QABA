import React from 'react';

const PriceBreakdown = ({ property }) => {
  const basePrice = property.rent_price || property.sale_price;
  const agentCommission = property.agent_commission;
  const qabaFee = property.qaba_fee;
  const totalPrice = property.total_price;
  const isRent = property.listing_type === "RENT";
  const frequency = property.rent_frequency_display || 'Monthly';

  if (!basePrice) return null;

  const formatPrice = (price) => {
    return price ? parseFloat(price).toLocaleString() : '0';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            {isRent ? `${frequency} Rent` : 'Sale Price'}
          </span>
          <span className="font-medium">₦{formatPrice(basePrice)}</span>
        </div>
        
        {agentCommission && parseFloat(agentCommission) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Agent Commission</span>
            <span className="font-medium">₦{formatPrice(agentCommission)}</span>
          </div>
        )}
        
        {qabaFee && parseFloat(qabaFee) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Qaba Service Fee</span>
            <span className="font-medium">₦{formatPrice(qabaFee)}</span>
          </div>
        )}
        
        <hr className="my-2" />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span className="text-blue-600">
            ₦{formatPrice(totalPrice || basePrice)}
            {isRent && ` / ${frequency}`}
          </span>
        </div>
      </div>
      
      {(agentCommission || qabaFee) && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Additional fees may apply for processing and verification services.
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
