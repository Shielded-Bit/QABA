"use client";
import AddForRent from '../components/AddForRent';
import { Toaster } from 'react-hot-toast';

export default function FavouritesPage() {
  return (
    <>
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      {/* Top Numbers Row Wrapper */}
      <div className="dashboard-numbers sm:pl-10 pl-16 px-6">
        {/* Text with fixed gradient */}
        <h1 className="text-xl font-normal px-2 md:px-2 py-4 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">
          Add Property &gt; <span className="text-[#1d86a9]">For Rent</span>
        </h1>
        <p className="pb-6 px-2 sm:px-2 text-sm text-gray-500">
          Fill in the details below to create a new property listing. Ensure all information is accurate and complete to attract potential buyers or renters. High-quality images and a detailed description will help your listing stand out.
        </p>
        <section className="ml-2 lg:ml-0">
          <AddForRent />
        </section>
      </div>
    </>
  );
}
