'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { PropertyCardSkeleton, LoadingGrid, HeaderSkeleton } from './components/LoadingSkeletons';

// Property Card Component
const PropertyCard = ({ property, isFavorite = false, toggleFavorite }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePropertyClick = () => {
    if (property && property.id) {
      router.push(`/details/${property.id}`);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await toggleFavorite(property);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onClick={handlePropertyClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative h-48">
        <Image 
          src={property.image || "/api/placeholder/400/320"} 
          alt={property.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
            property.type === 'SALE' 
              ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1]' 
              : 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1]'
          }`}>
            {property.type === 'SALE' ? 'Buy' : 'Rent'}
          </div>
        </div>
        <button 
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Bookmark 
            size={16} 
            className={`${
              isFavorite ? "text-[#014d98] fill-[#014d98]" : "text-gray-500"
            } ${isLoading ? 'animate-pulse' : ''}`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{property.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{property.description}</p>
        <div className="mt-3 font-bold text-lg text-[#014d98]">₦{Number(property.amount).toLocaleString()}</div>
      </div>
    </div>
  );
};

const AgentFavoritesPage = () => {
  // State management
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [filterType, setFilterType] = useState('all'); // all, rent, buy
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        console.log('Fetching favorites with token:', token ? 'Token found' : 'No token');
        
        if (!token) {
          console.error('No authentication token found');
          setFavorites([]);
          setFilteredFavorites([]);
          setTotalPages(0);
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        
        console.log('Favorites API response:', response.data);
        
        if (response.status === 200) {
          const favoritesData = response.data.data || [];
          console.log('Favorites data:', favoritesData);
          
          setFavorites(favoritesData);
          setFilteredFavorites(favoritesData);
          setTotalPages(Math.ceil(favoritesData.length / itemsPerPage));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        console.error('Error details:', error.response?.data);
        setFavorites([]);
        setFilteredFavorites([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [itemsPerPage]);

  // Handle search and filtering
  useEffect(() => {
    if (!Array.isArray(favorites)) {
      setFilteredFavorites([]);
      setTotalPages(0);
      return;
    }
    
    let results = [...favorites];
    
    // Filter by property type if needed
    if (filterType !== 'all') {
      const filterValue = filterType === 'buy' ? 'SALE' : filterType.toUpperCase();
      results = results.filter(item => 
        item.property && item.property.listing_type === filterValue
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        (item.property && item.property.property_name && item.property.property_name.toLowerCase().includes(term)) ||
        (item.property && item.property.location && item.property.location.toLowerCase().includes(term))
      );
    }
    
    setFilteredFavorites(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(prev => Math.min(prev, Math.ceil(results.length / itemsPerPage) || 1));
  }, [searchTerm, filterType, favorites, itemsPerPage]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredFavorites) 
    ? filteredFavorites.slice(indexOfFirstItem, indexOfLastItem) 
    : [];

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  // Toggle filter panel
  const toggleFilters = () => setShowFilters(!showFilters);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setShowFilters(false);
  };

  // Toggle favorite status
  const toggleFavorite = async (property) => {
    try {
      const token = Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const propertyId = property.id || property.property?.id;
      
      // Use the toggle endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/toggle/`,
        { property_id: propertyId },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.status === 200) {
        // If the property was in favorites, remove it from the state
        const isFavorited = favorites.some(fav => 
          (fav.id === property.id) || (fav.property && fav.property.id === propertyId)
        );
        
        if (isFavorited) {
          // Remove from favorites state
          setFavorites(prevFavorites => 
            prevFavorites.filter(fav => 
              !(fav.id === property.id || (fav.property && fav.property.id === propertyId))
            )
          );
          setFilteredFavorites(prevFiltered => 
            prevFiltered.filter(fav => 
              !(fav.id === property.id || (fav.property && fav.property.id === propertyId))
            )
          );
        } else if (response.data.data) {
          // Add new favorite to state
          const newFavorite = response.data.data;
          setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
          
          // Update filtered state if it matches current filters
          let shouldInclude = true;
          if (filterType !== 'all' && newFavorite.property) {
            const expectedType = filterType === 'buy' ? 'SALE' : filterType.toUpperCase();
            shouldInclude = newFavorite.property.listing_type === expectedType;
          }
          
          if (shouldInclude) {
            setFilteredFavorites(prevFiltered => [...prevFiltered, newFavorite]);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      // You might want to show an error message to the user here
    }
  };

  // Format property data for card display
  const formatPropertyForCard = (item) => {
    if (!item.property) return null;
    const p = item.property;
    
    return {
      id: p.id,
      name: p.property_name,
      description: `${p.property_type_display} • ${p.bedrooms} bed${p.bedrooms !== 1 ? 's' : ''} • ${p.bathrooms} bath${p.bathrooms !== 1 ? 's' : ''}\n${p.location}`,
      type: p.listing_type,
      amount: p.listing_type === 'SALE' 
        ? p.sale_price 
        : p.rent_price,
      image: p.thumbnail || "/api/placeholder/400/320"
    };
  };

  // Check if a property is in favorites
  const isFavorite = (propertyId) => {
    return favorites.some(fav => 
      (fav.id === propertyId) || 
      (fav.property && fav.property.id === propertyId)
    );
  };

  // Export data as CSV
  const exportToCSV = () => {
    if (!Array.isArray(filteredFavorites) || filteredFavorites.length === 0) {
      console.error('No data to export');
      return;
    }
    
    // Create CSV headers
    const headers = [
      'Property Name',
      'Location',
      'Type',
      'Price (₦)',
      'Bedrooms',
      'Bathrooms',
      'Area (sqft)',
      'Status'
    ].join(',');
    
    // Create CSV rows
    const rows = filteredFavorites.map(favorite => {
      const p = favorite.property;
      if (!p) return '';
      
      // Format price with Naira symbol
      const price = p.listing_type === 'RENT' ? 
        `${Number(p.rent_price || 0).toLocaleString()}${(p.rent_frequency ? `/${p.rent_frequency.toLowerCase()}` : '/month')}` : 
        (p.sale_price ? Number(p.sale_price).toLocaleString() : 'N/A');
      
      return [
        `"${(p.property_name || '').replace(/"/g, '""')}"`,
        `"${(p.location || '').replace(/"/g, '""')}"`,
        p.listing_type === 'SALE' ? 'Buy' : 'Rent',
        price,
        p.bedrooms || 'N/A',
        p.bathrooms || 'N/A',
        p.area_sqft > 0 ? p.area_sqft.toLocaleString() : 'N/A',
        p.property_status_display || p.property_status || 'N/A'
      ].join(',');
    }).join('\n');
    
    // Combine headers and rows
    const csv = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'favorite_properties.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Responsive pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 0) return null;
    
    return (
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded-full p-1 text-sm bg-transparent"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="hidden md:flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  currentPage === i + 1 
                    ? 'bg-gradient-to-r from-blue-900 to-green-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="flex md:hidden items-center">
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
          </div>
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header, Search, and Filters - Always Visible */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] py-2 sm:py-3 lg:py-4 text-center md:text-left">
          My Favorite Properties
        </h1>
        
        {/* Modern Search Bar with Floating Filter Panel */}
        <div className="w-full md:w-auto relative">
          <div className="flex items-center">
            <div className="relative flex-grow w-full md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button
              onClick={toggleFilters}
              className={`ml-2 p-2.5 rounded-full transition-all duration-300 ${
                showFilters || filterType !== 'all' 
                  ? 'bg-gradient-to-r from-blue-900 to-green-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-700 shadow-sm hover:shadow'
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
            </button>
          </div>
          
          {/* Floating Filter Panel */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-10 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-gray-700">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    Property Type
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {['all', 'rent', 'buy'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`text-xs py-1.5 px-2 rounded-lg capitalize transition-all duration-300 ${
                          filterType === type
                            ? 'bg-gradient-to-r from-blue-900 to-green-600 text-white font-medium'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {type === 'all' ? 'All' : type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-lg transition-colors duration-300"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Display - Always Visible */}
      {(searchTerm || filterType !== 'all') && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filterType !== 'all' && (
            <div className="inline-flex items-center bg-blue-50 text-blue-800 text-xs rounded-full px-3 py-1">
              <span className="capitalize">{filterType}</span>
              <button
                onClick={() => setFilterType('all')}
                className="ml-1.5 text-blue-500 hover:text-blue-700"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="inline-flex items-center bg-blue-50 text-blue-800 text-xs rounded-full px-3 py-1">
              <span>&quot;{searchTerm}&quot;</span>
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1.5 text-blue-500 hover:text-blue-700"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Properties Grid - Only This Shows Loading */}
      {isLoading ? (
        <LoadingGrid />
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-600 mb-6">Start browsing properties and save your favorites here</p>
          <a 
            href="/buy" 
            className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            Browse Properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((favorite) => {
              const formattedProperty = formatPropertyForCard(favorite);
              if (!formattedProperty) return null;
              
              return (
                <PropertyCard
                  key={favorite.id}
                  property={formattedProperty}
                  isFavorite={true}
                  toggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {renderPaginationControls()}
        </>
      )}
    </div>
  );
};

export default AgentFavoritesPage;