import React from 'react';

const RoleSelection = ({ formData, handleRoleChange }) => {
  return (
    <div className="px-2">
      <h2 className="text-sm mt-3 font-bold text-gray-800 mb-4">Please select your role:</h2>
      <div className="space-y-3">
        {/* Client Option */}
        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="role"
            value="client"
            className="w-4 h-4 text-gradient"
            checked={formData.role === 'client'}
            onChange={handleRoleChange}
          />
          <span className="text-[16px] font-medium text-gray-900">Client:</span>
          <span className="text-xs sm:text-sm text-gray-500"> Choose this if you’re looking to access service</span>
        </label>

        {/* Agent Option */}
        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="role"
            value="agent"
            className="w-4 h-4 text-gradient border-gray-300"
            checked={formData.role === 'agent'}
            onChange={handleRoleChange}
          />
          <span className="text-[16px] font-medium text-gray-900">Agent:</span>
          <span className="text-xs sm:text-sm text-gray-500">Choose this if you’re offering services</span>
        </label>
      </div>
    </div>
  );
};

export default RoleSelection;