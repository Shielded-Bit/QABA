"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { TbMenu4 } from "react-icons/tb";
import Button from '../shared/Button';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[rgb(246,246,246)]">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
          <Link href="/">QABA</Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-gray-800">
          <li>
            <Link href="/buy" className="hover:text-teal-700">
              Buy
            </Link>
          </li>
          <li>
            <Link href="/rent" className="hover:text-teal-700">
              Rent
            </Link>
          </li>
          <li>
            <Link href="/add-listing" className="hover:text-teal-700">
              Add Listing
            </Link>
          </li>
          <li>
            <Link href="/landlord-agent" className="hover:text-teal-700">
              Landlord / Agent
            </Link>
          </li>
          <li>
            <Link href="/about-us" className="hover:text-teal-700">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-teal-700">
              Blog
            </Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button label="Sign In" variant="primary" href="/sign-in" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <AiOutlineClose className="text-2xl text-gray-800" />
            ) : (
              <TbMenu4 className="text-2xl text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-gradient-to-b from-[rgb(246,246,246)] to-[rgb(203,228,221)] h-auto overflow-hidden transform transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-5"
        }`}
      >
        <ul className="grid grid-cols-3 gap-4 p-4 text-gray-800">
          <li>
            <Link
              href="/buy"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              Buy
            </Link>
          </li>
          <li>
            <Link
              href="/rent"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              Rent
            </Link>
          </li>
          <li>
            <Link
              href="/add-listing"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              Add Listing
            </Link>
          </li>
          <li>
            <Link
              href="/landlord-agent"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              Landlord / Agent
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
          </li>
        </ul>

        <div className="flex flex-col items-center space-y-2 p-4">
          
          <Link
            href="/sign-in"
            className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98]"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
