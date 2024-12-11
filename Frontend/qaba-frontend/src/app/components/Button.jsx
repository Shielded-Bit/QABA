import React from 'react';

const Button = ({ label, onClick, variant = 'primary', className, ...props }) => {
  const baseStyle =
    'px-4 py-2 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
