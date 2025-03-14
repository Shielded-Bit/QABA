import React from 'react';

const TextInput = ({ id, type, placeholder, value, handleChange }) => {
  return (
    <input
      type={type}
      id={id}
      className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
      placeholder={placeholder}
      required
      value={value}
      onChange={handleChange}
    />
  );
};

export default TextInput;