import React from 'react';
import Image from 'next/image';
import Button from '../components/shared/Button';

const EmailVerification = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white ">
      <div className="text-center max-w-md p-8 -mt-10">
        <Image 
          src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1740131450/Email_campaign-bro_1_mgsrru.png" // Replace with your actual image path
          alt="Email verification"
          width={120}
          height={120}
          className="mx-auto"
        />
        <h2 className="text-2xl font-semibold text-[#014d98] mt-4">Verify your email address</h2>
        <p className="text-gray-600 mt-2">
          You have entered <span className="text-blue-600">email@gmail.com</span> as the email address for your account, please verify this email address by clicking the button below
        </p>
        <div className="mt-6">
          <Button label="Verify your email" href="#" className="w-full" />
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Or copy and paste this link into your browser
        </p>
        <a href="#" className="text-blue-500 text-sm break-all">
          http:33asv55566444yrrt545757566366urhghhuuyydegyf8eee
        </a>
      </div>
    </div>
  );
};

export default EmailVerification;
