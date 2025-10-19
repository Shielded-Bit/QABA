import React from 'react';

const PriceBreakdown = ({ property }) => {
  const basePrice = property.rent_price || property.sale_price;
  const agentCommission = property.agent_commission;
  const qarbaFee = property.qaba_fee;
  const serviceCharge = property.service_charge;
  const cautionFee = property.caution_fee;
  const totalPrice = property.total_price;
  const isRent = property.listing_type === "RENT";
  const frequency = property.rent_frequency_display || 'Monthly';

  if (!basePrice) return null;

  const formatPrice = (price) => {
    return price ? parseFloat(price).toLocaleString() : '0';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Price Breakdown
      </h3>
      
      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">
            {isRent ? `${frequency} Rent` : 'Sale Price'}
          </span>
          <span className="font-semibold text-gray-900">₦{formatPrice(basePrice)}</span>
        </div>
        
        {/* Agent Commission */}
        {agentCommission && parseFloat(agentCommission) > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Agent Commission</span>
            <span className="font-semibold text-gray-900">₦{formatPrice(agentCommission)}</span>
          </div>
        )}
        
        {/* Qarba Service Fee */}
        {qarbaFee && parseFloat(qarbaFee) > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Qarba Fee</span>
            <span className="font-semibold text-gray-900">₦{formatPrice(qarbaFee)}</span>
          </div>
        )}

        {/* Service Charge */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Service Charge</span>
          <span className="font-semibold text-gray-900">
            {serviceCharge && parseFloat(serviceCharge) > 0
              ? `₦${formatPrice(serviceCharge)}`
              : <span className="text-gray-400 text-sm">Not set</span>
            }
          </span>
        </div>

        {/* Caution Fee */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Caution Fee</span>
          <span className="font-semibold text-gray-900">
            {cautionFee && parseFloat(cautionFee) > 0
              ? `₦${formatPrice(cautionFee)}`
              : <span className="text-gray-400 text-sm">Not set</span>
            }
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>
        
        {/* Total Amount */}
        <div className="flex justify-between items-center py-2 bg-blue-50 px-4 rounded-lg">
          <span className="font-semibold text-blue-900">Total Amount</span>
          <div className="text-right">
            <span className="font-bold text-xl text-blue-900">
              ₦{formatPrice(totalPrice || basePrice)}
            </span>
            {isRent && (
              <div className="text-blue-600 text-sm">
                / {frequency}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Simple note */}
      {(agentCommission || qarbaFee) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">
            All fees are included in the total amount shown above.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
