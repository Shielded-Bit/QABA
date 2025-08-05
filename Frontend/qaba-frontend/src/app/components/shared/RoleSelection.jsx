import React from 'react';

const RoleSelection = ({ formData, handleRoleChange, roles }) => {
  // Default roles if not provided
  const roleOptions = roles || [
    { value: 'agent', label: 'Agent', desc: 'Choose this if you’re offering services' },
    { value: 'landlord', label: 'Landlord', desc: 'Choose this if you’re a landlord listing properties' },
    { value: 'client', label: 'Client', desc: 'Choose this if you’re looking to access service' },
  ];

  return (
    <div className="px-2">
      <h2 className="text-sm mt-3 font-bold text-gray-800 mb-4">Please select your role:</h2>
      <div className="space-y-3">
        {roleOptions.map((role) => (
          <label key={role.value} className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="role"
              value={role.value}
              className="w-4 h-4 text-gradient border-gray-300"
              checked={formData.role === role.value}
              onChange={handleRoleChange}
            />
            <span className="text-[16px] font-medium text-gray-900">{role.label}:</span>
            <span className="text-xs sm:text-sm text-gray-500"> {role.desc}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;