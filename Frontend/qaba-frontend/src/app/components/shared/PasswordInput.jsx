import React from 'react';
import Image from 'next/image';

const PasswordInput = ({ id, showPassword, togglePasswordVisibility, value, handleChange, bgpict }) => {
  return (
    <div className="relative mt-1">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        className="w-full px-2 py- peer border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
        placeholder={id === 'password' ? 'Password' : 'Confirm Password'}
        required
        value={value}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
      >
        <Image
          src={showPassword ? bgpict[3].src : bgpict[2].src}
          alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default PasswordInput;