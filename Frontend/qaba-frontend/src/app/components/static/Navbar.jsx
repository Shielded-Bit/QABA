"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { TbMenu4 } from "react-icons/tb";
import Button from "../shared/Button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // To get the current route

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[rgb(246,246,246)]">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
          <Link href="/">QABA</Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-gray-800">
          {[
            { name: "Buy", path: "/buy" },
            { name: "Rent", path: "/rent" },
            { name: "Add Listing", path: "/add-listing" },
            { name: "Landlord / Agent", path: "/landlord-agent" },
            { name: "About Us", path: "/about-us" },
            { name: "Blog", path: "/blog" },
          ].map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className={`${
                  isActive(path)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]"
                    : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
                } transition-all duration-300`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button label="Sign In" variant="primary" href="/signin" />
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
        className={`md:hidden pl-3 bg-gradient-to-b from-[rgb(246,246,246)] to-[rgb(203,228,221)] h-auto overflow-hidden transform transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-5"
        }`}
      >
        <ul
          className={`grid grid-cols-2 gap-4 p-4 text-gray-800 text-left transform transition-all duration-500 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          {[
            { name: "Buy", path: "/buy" },
            { name: "Rent", path: "/rent" },
            { name: "Add Listing", path: "/add-listing" },
            { name: "Landlord / Agent", path: "/landlord-agent" },
            { name: "About Us", path: "/about-us" },
            { name: "Blog", path: "/blog" },
           
            
          ].map(({ name, path }) => (
            <li key={path} className="transition-transform duration-300 ease-in-out hover:scale-105">
              <Link
                href={path}
                className={`${
                  isActive(path)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]"
                    : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-start space-y-2 p-4">
          <Link
            href="/signin"
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
