"use client";
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const PropertiesCacheContext = createContext(null);

export function PropertiesCacheProvider({ children }) {
  const [cache, setCache] = useState({
    properties: [],
    cities: [],
    lastFetch: null,
    isLoading: false,
    error: null,
    initialized: false,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const CACHE_KEY = 'properties_cache_data';
  const CITIES_CACHE_KEY = 'properties_cities_cache';
  const MAX_CACHE_SIZE = 50; // Maximum number of properties to cache
  const MAX_CITIES_SIZE = 100; // Maximum number of cities to cache

  // Check if cache is still valid
  const isCacheValid = useCallback((lastFetch) => {
    if (!lastFetch) return false;
    const now = new Date().getTime();
    return (now - lastFetch) < CACHE_DURATION;
  }, [CACHE_DURATION]);

  // Load cache from localStorage
  const loadCacheFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return null;

    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedCities = localStorage.getItem(CITIES_CACHE_KEY);
      const lastFetch = localStorage.getItem('properties_last_fetch');

      if (cachedData && cachedCities && lastFetch) {
        const parsedData = JSON.parse(cachedData);
        const parsedCities = JSON.parse(cachedCities);
        const fetchTime = parseInt(lastFetch);

        if (isCacheValid(fetchTime)) {
          return {
            properties: parsedData,
            cities: parsedCities,
            lastFetch: fetchTime,
          };
        }
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
    return null;
  }, [isCacheValid]);

  // Save cache to localStorage
  const saveCacheToStorage = useCallback((properties, cities) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(properties));
      localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(cities));
      localStorage.setItem('properties_last_fetch', new Date().getTime().toString());
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }, []);

  // Extract price helper function
  const extractPrice = useCallback((property) => {
    let price = null;
    let formattedPrice = "";
    
    if (property.listing_type === "RENT") {
      price = property.rent_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()} ${property.rent_frequency === "MONTHLY" ? "Per Month" : "Per Year"}`;
      }
    } else if (property.listing_type === "SALE") {
      price = property.sale_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()}`;
      }
    }
    
    return formattedPrice || "Price on request";
  }, []);

  // Format properties data
  const formatProperties = useCallback((propertiesData) => {
    return propertiesData.map(property => ({
      id: property.id,
      title: property.property_name || 'Beautiful Property',
      price: extractPrice(property),
      description: `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${property.location || 'premium location'}`,
      image: property.thumbnail || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
      type: property.listing_type?.toLowerCase() || 'property',
      location: property.location || '',
      city: property.city || '',
      propertyStatus: property.property_status_display || 'Available',
      propertyType: property.property_type || '',
      propertyTypeDisplay: property.property_type_display || '',
      amenities: property.amenities || [],
      listingType: property.listing_type || 'PROPERTY'
    }));
  }, [extractPrice]);

  // Fetch properties from API
  const fetchPropertiesFromAPI = useCallback(async (filters = {}) => {
    try {
      setCache(prev => ({ ...prev, isLoading: true, error: null }));

      // Build API URL with filters
      let apiUrl = `${API_BASE_URL}/api/v1/properties/?listing_status=APPROVED`;
      
      // Add search parameter
      if (filters.searchTerm?.trim()) {
        apiUrl += `&search=${encodeURIComponent(filters.searchTerm.trim())}`;
      }
      
      // Add listing type filter
      if (filters.listing_type) {
        apiUrl += `&listing_type=${filters.listing_type}`;
      }
      
      // Add filter parameters
      if (filters.city) {
        apiUrl += `&city=${encodeURIComponent(filters.city)}`;
      }
      
      if (filters.property_type) {
        apiUrl += `&property_type=${filters.property_type}`;
      }
      
      if (filters.property_status) {
        apiUrl += `&property_status=${filters.property_status}`;
      }
      
      if (filters.lister_type) {
        apiUrl += `&lister_type=${filters.lister_type}`;
      }
      
      // Add bedroom filter
      if (filters.bedrooms) {
        apiUrl += `&bedrooms=${filters.bedrooms}`;
      }
      
      // Add bathroom filter
      if (filters.bathrooms) {
        apiUrl += `&bathrooms=${filters.bathrooms}`;
      }
      
      // Add price range parameters
      if (filters.price_range) {
        if (filters.listing_type === "RENT") {
          if (filters.price_range.endsWith('+')) {
            const min = filters.price_range.replace('+', '');
            apiUrl += `&min_rent=${min}`;
          } else {
            const [min, max] = filters.price_range.split('-').map(Number);
            if (!isNaN(min)) {
              apiUrl += `&min_rent=${min}`;
            }
            if (!isNaN(max)) {
              apiUrl += `&max_rent=${max}`;
            }
          }
        } else if (filters.listing_type === "SALE") {
          if (filters.price_range.endsWith('+')) {
            const min = filters.price_range.replace('+', '');
            apiUrl += `&min_sale=${min}`;
          } else {
            const [min, max] = filters.price_range.split('-').map(Number);
            if (!isNaN(min)) {
              apiUrl += `&min_sale=${min}`;
            }
            if (!isNaN(max)) {
              apiUrl += `&max_sale=${max}`;
            }
          }
        } else {
          if (filters.price_range.endsWith('+')) {
            const min = filters.price_range.replace('+', '');
            apiUrl += `&min_rent=${min}&min_sale=${min}`;
          } else {
            const [min, max] = filters.price_range.split('-').map(Number);
            if (!isNaN(min)) {
              apiUrl += `&min_rent=${min}&min_sale=${min}`;
            }
            if (!isNaN(max)) {
              apiUrl += `&max_rent=${max}&max_sale=${max}`;
            }
          }
        }
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const responseData = await response.json();
      const propertiesData = responseData.data || [];
      const formattedProperties = formatProperties(propertiesData);
      
      return formattedProperties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }, [API_BASE_URL, formatProperties]);

  // Fetch cities from API
  const fetchCitiesFromAPI = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/properties/?listing_status=APPROVED`,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const allProperties = data.data || [];
        
        // Extract unique cities from all properties
        const cities = [...new Set(
          allProperties
            .map(property => property.city)
            .filter(city => city && city.trim())
        )].sort();
        
        return cities;
      }
      return [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }, [API_BASE_URL]);

  // Get properties with Stale-While-Revalidate pattern
  const getProperties = useCallback(async (filters = {}, forceRefresh = false) => {
    const hasFilters = Object.keys(filters).length > 0;
    let returnedFromCache = false;

    // Always try to serve cached data immediately if no filters and not force refresh
    if (!forceRefresh && !hasFilters) {
      const cachedData = loadCacheFromStorage();
      if (cachedData) {
        // Serve cached data immediately
        setCache(prev => ({
          ...prev,
          properties: cachedData.properties,
          cities: cachedData.cities,
          lastFetch: cachedData.lastFetch,
          isLoading: false,
          error: null,
        }));
        returnedFromCache = true;
      }
    }

    // Show loading only if no cached data to show
    if (!returnedFromCache) {
      setCache(prev => ({ ...prev, isLoading: true }));
    }

    try {
      // Always fetch fresh data (in background if we served cache)
      const [properties, cities] = await Promise.all([
        fetchPropertiesFromAPI(filters),
        fetchCitiesFromAPI()
      ]);

      const now = new Date().getTime();

      // Update state with fresh data
      setCache(prev => ({
        ...prev,
        properties,
        cities,
        lastFetch: now,
        isLoading: false,
        error: null,
      }));

      // Save to localStorage only if no filters are applied (for base cache)
      if (!hasFilters) {
        // Limit cache size for better performance
        const limitedProperties = properties.slice(0, MAX_CACHE_SIZE);
        const limitedCities = cities.slice(0, MAX_CITIES_SIZE);
        saveCacheToStorage(limitedProperties, limitedCities);
      }

      return properties;
    } catch (error) {
      console.error('Error fetching fresh data:', error);

      // If we didn't have cache and fetch failed, show error
      if (!returnedFromCache) {
        setCache(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
      // If we had cache but fetch failed, keep showing cached data silently
      throw error;
    }
  }, [loadCacheFromStorage, fetchPropertiesFromAPI, fetchCitiesFromAPI, saveCacheToStorage]);

  // Stable reference for getProperties without filters
  const getBaseProperties = useCallback(() => {
    return getProperties({}, false);
  }, [getProperties]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CITIES_CACHE_KEY);
      localStorage.removeItem('properties_last_fetch');
    }
    
    setCache({
      properties: [],
      cities: [],
      lastFetch: null,
      isLoading: false,
      error: null,
      initialized: false,
    });
  }, []);

  // Refresh data (force fetch)
  const refreshData = useCallback(async (filters = {}) => {
    return await getProperties(filters, true);
  }, [getProperties]);

  // Initialize cache on mount
  useEffect(() => {
    const cachedData = loadCacheFromStorage();
    if (cachedData) {
      setCache(prev => ({
        ...prev,
        properties: cachedData.properties,
        cities: cachedData.cities,
        lastFetch: cachedData.lastFetch,
        isLoading: false,
        initialized: true,
      }));
    } else {
      // If no cache, fetch initial data
      getBaseProperties().then(() => {
        setCache(prev => ({ ...prev, initialized: true }));
      });
    }
  }, [getBaseProperties, loadCacheFromStorage]); // Include all dependencies

  const value = {
    ...cache,
    getProperties,
    clearCache,
    refreshData,
    isCacheValid: () => isCacheValid(cache.lastFetch),
  };

  return (
    <PropertiesCacheContext.Provider value={value}>
      {children}
    </PropertiesCacheContext.Provider>
  );
}

export function usePropertiesCache() {
  const context = useContext(PropertiesCacheContext);
  if (!context) {
    throw new Error('usePropertiesCache must be used within a PropertiesCacheProvider');
  }
  return context;
}
