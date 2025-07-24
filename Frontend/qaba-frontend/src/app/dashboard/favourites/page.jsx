"use client";

import { useState, useEffect } from 'react';
import PropertyCard from './propertyCard';

// Simple Loading Skeleton Component
const LoadingSkeletons = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="relative h-48 bg-gray-200">
          <div className="absolute top-3 left-3">
            <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function FavouritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/favorites/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch favorites: ${response.status}`);
        }

        const data = await response.json();
        setFavorites(data.data || []);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = (propertyId) => {
    setFavorites(prev => prev.filter(property => property.id !== propertyId));
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Keep track of properties you're interested in
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">{favorites.length}</span>
              <span className="ml-1">
                {favorites.length === 1 ? 'property' : 'properties'} saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        {isLoading ? (
          <LoadingSkeletons />
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Favorites</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-6">Start browsing properties and save your favorites here</p>
            <a 
              href="/dashboard/all-listed-properties" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Browse Properties
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onRemoveFromFavorites={removeFromFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}