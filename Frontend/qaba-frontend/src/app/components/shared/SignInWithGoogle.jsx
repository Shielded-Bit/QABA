import React from 'react';
import Image from 'next/image';

const SignInWithGoogle = ({ bgpict }) => {
  return (
    <>
      <p className="mt-7 text-left text-sm text-gray-600">
        Already have an account?{' '}
        <a href="signin" className="text-gradient hover:underline">
          Sign In
        </a>
      </p>

      <div className="mt-10 flex items-center justify-center space-x-2">
  <div className="h-px w-24 sm:w-40 bg-gray-300"></div>
  <span className="text-sm px-1 sm:px-0 text-gray-400">Or Sign in with</span>
  <div className="h-px w-24 sm:w-40 bg-gray-300"></div>
</div>


      <button
        type="button"
        className="mt-10 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-300"
      >
        <Image
          src={bgpict[1].src}
          alt={bgpict[1].alt}
          width={20}
          height={20}
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </button>

      <p className="mt-6 text-left text-xs text-gray-900">
        By signing in you accept our{' '}
        <a href="#" className="font-extrabold">
          Terms of Use
        </a>{' '}
        and{' '}
        <a href="#" className="font-extrabold">
          Privacy Policy
        </a>
      </p>
    </>
  );
};

export default SignInWithGoogle;