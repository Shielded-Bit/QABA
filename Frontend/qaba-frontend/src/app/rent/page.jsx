'use client';

import React, { useState } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";

export default function Rent() {
  // Add more properties and ensure they all have type 'rent'
  const allListings = [
    { id: 1, title: 'The Dream Family Home', price: '₦700,000 Per Year', type: 'rent', location: 'Lagos', city: 'Ikeja' },
    { id: 2, title: 'Spacious Apartment in Abuja', price: '₦1,000,000 Per Year', type: 'rent', location: 'Abuja', city: 'Wuse' },
    { id: 3, title: 'Modern 3-Bedroom in Lekki', price: '₦1,500,000 Per Year', type: 'rent', location: 'Lagos', city: 'Lekki' },
    { id: 4, title: 'Luxury Villa in Ikeja', price: '₦3,500,000 Per Year', type: 'rent', location: 'Lagos', city: 'Ikeja' },
    { id: 5, title: 'Cozy 2-Bedroom in Lekki', price: '₦1,200,000 Per Year', type: 'rent', location: 'Lagos', city: 'Lekki' },
    { id: 6, title: 'Spacious 1-Bedroom in Wuse', price: '₦800,000 Per Year', type: 'rent', location: 'Abuja', city: 'Wuse' },
    { id: 7, title: 'Modern 3-Bedroom in Lekki', price: '₦1,500,000 Per Year', type: 'rent', location: 'Lagos', city: 'Lekki' },
    { id: 8, title: 'Luxury Penthouse in Lagos', price: '₦5,000,000 Per Year', type: 'rent', location: 'Lagos', city: 'Ikeja' },
    { id: 9, title: 'Family Home in Lekki', price: '₦2,500,000 Per Year', type: 'rent', location: 'Lagos', city: 'Lekki' },
  ];

  const [filters, setFilters] = useState({
    location: '',
    city: '',
    type: 'rent',  // Ensures only 'rent' type listings are shown
    purpose: '',
  });

  const [filteredListings, setFilteredListings] = useState(allListings);

  // Filter Function
  const handleSearch = () => {
    const results = allListings.filter((listing) => {
      return (
        listing.type === 'rent' && // Ensures only rental properties are shown
        (filters.location ? listing.location === filters.location : true) &&
        (filters.city ? listing.city === filters.city : true) &&
        (filters.type ? listing.type === filters.type : true) &&
        (filters.purpose ? listing.type === filters.purpose : true) // Adjust logic as needed
      );
    });
    setFilteredListings(results);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 pt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 md:mb-6">
        {/* Location Dropdown */}
        <div className="relative">
          <select
            className="border border-black rounded-lg p-2 appearance-none pr-8"
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Location</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-2xl" />
        </div>

        {/* City Dropdown */}
        <div className="relative">
          <select
            className="border border-black rounded-lg p-2 appearance-none pr-8"
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option value="">City</option>
            <option value="Ikeja">Ikeja</option>
            <option value="Wuse">Wuse</option>
            <option value="Lekki">Lekki</option>
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-2xl" />
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <select
            className="border border-black rounded-lg p-2 appearance-none pr-8"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="rent">Rent</option>
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-2xl" />
        </div>

        {/* Purpose Dropdown */}
        <div className="relative">
          <select
            className="border border-black rounded-lg p-2 appearance-none pr-8"
            onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
          >
            <option value="">Purpose</option>
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
            <option value="shortlet">Shortlet</option>
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-2xl" />
        </div>

        {/* Search Button */}
        <Button
          label="Search"
          onClick={handleSearch}
          variant="primary"
          className="h-10"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-light mb-4 md:mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
          Properties
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
          Available for Renting
        </span>
      </h1>

      <p className="text-gray-500 mb-4 md:mb-6">{filteredListings.length} rentals</p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            description={listing.description || 'Beautiful home description'}
            image="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png"
            type={listing.type}
          />
        ))}
      </div>
    </div>
  );
}
