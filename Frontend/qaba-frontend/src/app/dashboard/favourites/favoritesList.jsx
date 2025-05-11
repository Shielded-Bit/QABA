'use client';

import { useState, useEffect } from 'react';
import FavoriteCard from '../components/favoriteCard';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import axios from 'axios';

const FavoritesPage = () => {
  // State management
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, rent, sale
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
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        const response = await axios.get(
          'https://qaba.onrender.com/api/v1/favorites/',
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        
        if (response.status === 200) {
          const favoritesData = response.data.data || [];
          
          setFavorites(favoritesData);
          setFilteredFavorites(favoritesData);
          setTotalPages(Math.ceil(favoritesData.length / itemsPerPage));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
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
      results = results.filter(item => 
        item.property && item.property.listing_type === filterType.toUpperCase()
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

  // Export data as CSV with Naira symbol and proper formatting
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
        p.listing_type_display || p.listing_type || 'N/A',
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
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
                    {['all', 'rent', 'sale'].map(type => (
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
      
      {/* Active Filters Display */}
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-900 border-r-green-600 border-b-blue-600 border-l-green-400 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : Array.isArray(filteredFavorites) && filteredFavorites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((favorite) => (
              <FavoriteCard key={favorite.id} favorite={favorite} />
            ))}
          </div>
          
          {renderPaginationControls()}
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
              <Search size={24} className="text-gray-400" />
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium">No favorites found</p>
          {searchTerm || filterType !== 'all' ? (
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
            >
              Clear filters
            </button>
          ) : (
            <p className="mt-2 text-gray-500">Start saving properties to view them here!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;