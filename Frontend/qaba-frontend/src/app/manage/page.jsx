"use client";

import React from "react";
import Link from "next/link";
import { Wrench, Home } from "lucide-react";

const ManageComingSoon = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center mb-6">
        <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-4">
          <Wrench size={48} className="text-white" />
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
          Manage Properties
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          This feature is coming soon! Soon you’ll be able to manage all your properties, listings, and more from one place.
        </p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-semibold shadow hover:opacity-90 transition">
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
};

export default ManageComingSoon;
