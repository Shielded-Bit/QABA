'use client';

import React, { useState } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";

export default function Buy() {
  const allListings = [
    { id: 1, title: 'Luxury Villa in Banana Island', price: '₦700,000,000', type: 'buy', location: 'Lagos', city: 'Ikoyi' },
    { id: 2, title: 'Modern Duplex in Maitama', price: '₦500,000,000', type: 'buy', location: 'Abuja', city: 'Maitama' },
    { id: 3, title: 'Spacious 5-Bedroom in Lekki', price: '₦350,000,000', type: 'buy', location: 'Lagos', city: 'Lekki' },
    { id: 4, title: 'Luxury Bungalow in Asokoro', price: '₦600,000,000', type: 'buy', location: 'Abuja', city: 'Asokoro' },
    { id: 5, title: 'Cozy Family Home in Lekki', price: '₦150,000,000', type: 'buy', location: 'Lagos', city: 'Lekki' },
    { id: 6, title: 'Modern 4-Bedroom in Wuse', price: '₦200,000,000', type: 'buy', location: 'Abuja', city: 'Wuse' },
    { id: 7, title: 'Elegant Mansion in Lekki Phase 1', price: '₦800,000,000', type: 'buy', location: 'Lagos', city: 'Lekki Phase 1' },
    { id: 8, title: 'Beachfront House in Victoria Island', price: '₦1,200,000,000', type: 'buy', location: 'Lagos', city: 'Victoria Island' },
    { id: 9, title: 'Contemporary Apartment in Asokoro', price: '₦300,000,000', type: 'buy', location: 'Abuja', city: 'Asokoro' },
  ];

  const ebonyiListings = [
    { id: 11, title: 'Elegant Villa in Abakaliki', price: '₦120,000,000', type: 'buy', location: 'Ebonyi', city: 'Abakaliki' },
    { id: 12, title: 'Contemporary Apartment in Afikpo', price: '₦90,000,000', type: 'buy', location: 'Ebonyi', city: 'Afikpo' },
    { id: 13, title: 'Luxury Bungalow in Onueke', price: '₦80,000,000', type: 'buy', location: 'Ebonyi', city: 'Onueke' },
  ];

  const [filters, setFilters] = useState({
    location: '',
    city: '',
    type: 'buy',
    purpose: '',
  });

  const [filteredListings, setFilteredListings] = useState(allListings);
  const [visibleListings, setVisibleListings] = useState(6); // Initial listings to show
  const [lastUpdated] = useState('November 10, 2024');

  const handleSearch = () => {
    const results = allListings.filter((listing) =>
      listing.type === filters.type &&
      (filters.location ? listing.location === filters.location : true) &&
      (filters.city ? listing.city === filters.city : true) &&
      (filters.purpose ? listing.type === filters.purpose : true)
    );
    setFilteredListings(results);
  };

  const handleLoadMore = () => setVisibleListings((prev) => prev + 9); // Load more in increments of 9

  const FilterDropdown = ({ label, options, onChange }) => (
    <div className="relative">
      <select
        className="border border-black rounded-lg p-2 appearance-none pr-8"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-2xl" />
    </div>
  );

  return (
    <div className="px-2 sm:px-14 py-4">
      <div className=" pt-6">
      {/* Filters */}
    <div className="flex flex-wrap gap-4 mb-4 md:mb-6">
      <FilterDropdown
        label="Location"
        options={['Lagos', 'Abuja']}
        onChange={(value) => setFilters({ ...filters, location: value })}
      />
      <FilterDropdown
        label="City"
        options={['Ikoyi', 'Maitama', 'Lekki', 'Asokoro', 'Wuse']}
        onChange={(value) => setFilters({ ...filters, city: value })}
      />
      <FilterDropdown
        label="Type"
        options={['buy']}
        onChange={(value) => setFilters({ ...filters, type: value })}
      />
      <FilterDropdown
        label="Purpose"
        options={['Rent', 'Buy', 'Shortlet']}
        onChange={(value) => setFilters({ ...filters, purpose: value })}
      />
      <Button
        label="Search"
        onClick={handleSearch}
        variant="primary"
        className="h-10"
      />
    </div>
  </div>



      {/* Heading */}
      <h1 className="text-3xl font-light mb-4 md:mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
          Properties
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
          Available for Buying
        </span>
      </h1>

      <p className="text-gray-500 mb-4 md:mb-6">{filteredListings.length} properties</p>
      <p className="text-sm text-gray-400 mb-4">Last updated: {lastUpdated}</p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredListings.slice(0, visibleListings).map((listing) => (
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

      {/* Load More Button */}
      {visibleListings < filteredListings.length && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-600 mb-2">
            Showing {visibleListings} - {Math.min(filteredListings.length, visibleListings + 9)} of {filteredListings.length} results
          </p>
          <Button
            label="Load More"
            onClick={handleLoadMore}
            className="h-10"
          />
        </div>
      )}

      {/* Other Cities Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-light mb-4 md:mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
            Other Cities
          </span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
            to Explore in Ebonyi
          </span>
        </h2>
        <p className="text-gray-600 mb-6">
          Explore available properties in these vibrant cities across Ebonyi State.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ebonyiListings.map((listing) => (
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
    </div>
  );
}
