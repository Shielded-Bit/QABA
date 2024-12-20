import React from 'react';
import Link from 'next/link';

const Button = ({
  label,
  onClick,
  variant = 'primary',
  className = '',
  href,
  borderColor,
  bgColor,
  textColor,
  width = 'auto',
  height = 'auto',
  ...props
}) => {
  const baseStyle =
    'px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';

  const customStyle = `
    ${borderColor ? 'border-2 border-transparent' : ''}
    ${bgColor ? `bg-${bgColor}` : ''}
    ${textColor ? `text-${textColor}` : ''}
    ${width ? `w-${width}` : ''}
    ${height ? `h-${height}` : ''}
    hover:opacity-90
  `;

  const borderGradientStyle = borderColor
    ? `bg-gradient-to-r ${borderColor} absolute inset-0 rounded-md`
    : '';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white hover:from-[#3ab7b1] hover:to-[#014d98] focus:ring-[#014d98]',
    secondary:
      'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
  };

  const content = (
    <>
      {borderColor && (
        <span
          className={`${borderGradientStyle}`}
          aria-hidden="true"
        ></span>
      )}
      <span className="relative z-10">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyle} ${variants[variant]} ${customStyle} ${className}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${customStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
