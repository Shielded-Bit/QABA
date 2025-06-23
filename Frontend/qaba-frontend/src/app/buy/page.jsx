'use client';

import React, { useState, useEffect } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";
import { PropertyCardSkeleton } from '../agent-dashboard/favourites/components/LoadingSkeletons';

export default function Buy() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleListings, setVisibleListings] = useState(6); // Initial listings to show
  const [lastUpdated] = useState('April 10, 2025');
  
  const [filters, setFilters] = useState({
    location: '',
    city: '',
    type: 'buy',
    purpose: '',
  });

  // Function to extract and format price from property data
  const extractPrice = (property) => {
    let price = null;
    let formattedPrice = "";
    
    if (property.listing_type === "SALE") {
      price = property.sale_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()}`;
      }
    }
    
    return formattedPrice || "Price on request";
  };

  // Fetch approved properties for sale from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED&listing_type=SALE`, {
          headers: {
            'accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const responseData = await response.json();
        
        // Extract the data array based on the actual API response structure
        const propertiesData = responseData.data || [];
        
        // Map API data to our component's expected format
        const formattedProperties = propertiesData.map(property => ({
          id: property.id,
          title: property.property_name || 'Beautiful Property',
          price: extractPrice(property),
          description: `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${property.location || 'premium location'}`,
          image: property.thumbnail || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          type: 'buy',
          location: property.location || '',
          city: property.city || '',
        }));
        
        setProperties(formattedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Get unique locations and cities for filters
  const uniqueLocations = [...new Set(properties.map(property => property.location).filter(Boolean))];
  const uniqueCities = [...new Set(properties.map(property => property.city).filter(Boolean))];

  // Filter properties based on selected filters
  const handleSearch = () => {
    // Implementation remains in the client-side for now
    setVisibleListings(6); // Reset to show first 6 when filtering
  };

  // Load more properties
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

  // Get filtered properties
  const filteredProperties = properties.filter((property) =>
    (filters.location ? property.location === filters.location : true) &&
    (filters.city ? property.city === filters.city : true)
  );

  return (
    <div className="px-2 sm:px-14 py-4">
      <div className="pt-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 md:mb-6">
          <FilterDropdown
            label="Location"
            options={uniqueLocations}
            onChange={(value) => setFilters({ ...filters, location: value })}
          />
          <FilterDropdown
            label="City"
            options={uniqueCities}
            onChange={(value) => setFilters({ ...filters, city: value })}
          />
          <FilterDropdown
            label="Type"
            options={['buy']}
            onChange={(value) => setFilters({ ...filters, type: value })}
          />
          <FilterDropdown
            label="Purpose"
            options={['Buy']}
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

      {/* Loading State - Use Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {!loading && (
        <>
          <p className="text-gray-500 mb-4 md:mb-6">{filteredProperties.length} properties</p>
          <p className="text-sm text-gray-400 mb-4">Last updated: {lastUpdated}</p>

          {/* Grid Layout */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProperties.slice(0, visibleListings).map((property) => (
                <ListingCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  description={property.description}
                  image={property.image}
                  type={property.type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No properties found matching your criteria.</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleListings < filteredProperties.length && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-gray-600 mb-2">
                Showing {Math.min(filteredProperties.length, visibleListings)} of {filteredProperties.length} results
              </p>
              <Button
                label="Load More"
                onClick={handleLoadMore}
                className="h-10"
              />
            </div>
          )}

          {/* Other Cities Section - Only show if main results loaded successfully */}
          {properties.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-light mb-4 md:mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
                  Other Cities
                </span>{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
                  to Explore
                </span>
              </h2>
              <p className="text-gray-600 mb-6">
                Explore available properties for sale in these vibrant cities across Nigeria.
              </p>
              {/* Show some properties from cities that aren't in the current filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties
                  .filter(property => !filters.city || property.city !== filters.city)
                  .slice(0, 3)
                  .map((property) => (
                    <ListingCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      description={property.description}
                      image={property.image}
                      type={property.type}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}