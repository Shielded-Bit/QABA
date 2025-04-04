'use client';

import React, { useState } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";

export default function Rent() {
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

  const ebonyiListings = [
    { id: 10, title: 'Charming Duplex in Abakaliki', price: '₦600,000 Per Year', type: 'rent', location: 'Ebonyi', city: 'Abakaliki' },
    { id: 11, title: 'Modern Apartment in Afikpo', price: '₦750,000 Per Year', type: 'rent', location: 'Ebonyi', city: 'Afikpo' },
    { id: 12, title: 'Luxury Bungalow in Onueke', price: '₦900,000 Per Year', type: 'rent', location: 'Ebonyi', city: 'Onueke' },
  ];

  const [filters, setFilters] = useState({
    location: '',
    city: '',
    type: 'rent',
    purpose: '',
  });

  const [filteredListings, setFilteredListings] = useState(allListings);
  const [visibleListings, setVisibleListings] = useState(6);
  const [lastUpdated] = useState('November 10, 2024');

  // Filter listings based on selected filters
  const handleSearch = () => {
    const results = allListings.filter((listing) =>
      listing.type === filters.type &&
      (filters.location ? listing.location === filters.location : true) &&
      (filters.city ? listing.city === filters.city : true) &&
      (filters.purpose ? listing.type === filters.purpose : true)
    );
    setFilteredListings(results);
  };

  // Load more listings
  const handleLoadMore = () => setVisibleListings((prev) => prev + 6);

  // Dropdown filter component
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
    <div className="p-4 md:p-8 bg-gray-50 pt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 md:mb-6">
        <FilterDropdown
          label="Location"
          options={['Lagos', 'Abuja']}
          onChange={(value) => setFilters({ ...filters, location: value })}
        />
        <FilterDropdown
          label="City"
          options={['Ikeja', 'Wuse', 'Lekki']}
          onChange={(value) => setFilters({ ...filters, city: value })}
        />
        <FilterDropdown
          label="Type"
          options={['rent']}
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
            Showing {visibleListings} - {Math.min(filteredListings.length, visibleListings + 6)} of {filteredListings.length} results
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
          Explore available rental homes in these vibrant cities across Ebonyi State.
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
