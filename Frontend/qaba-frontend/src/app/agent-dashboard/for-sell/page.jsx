"use client";
import { useState, useEffect } from 'react';
import AddForSell from '../components/addForSell';
import { Toaster } from 'react-hot-toast';

export default function ForSellPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div suppressHydrationWarning className="min-h-screen">
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Add Property <span className="text-blue-600">› For Sale</span>
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Fill in the details below to create a new property listing. Ensure all information is accurate and complete to attract potential buyers. High-quality images and a detailed description will help your listing stand out.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        <AddForSell />
      </div>
    </div>
  );
}
