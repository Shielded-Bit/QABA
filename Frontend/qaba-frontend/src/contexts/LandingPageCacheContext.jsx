"use client";
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const LandingPageCacheContext = createContext(null);

export function LandingPageCacheProvider({ children }) {
  const [cache, setCache] = useState({
    featuredProperties: [],
    blogArticles: [],
    lastFetch: null,
    isLoading: false,
    error: null,
    initialized: false,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for landing page (longer than other pages)
  const PROPERTIES_CACHE_KEY = 'landing_page_properties_cache';
  const BLOGS_CACHE_KEY = 'landing_page_blogs_cache';

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
      const cachedProperties = localStorage.getItem(PROPERTIES_CACHE_KEY);
      const cachedBlogs = localStorage.getItem(BLOGS_CACHE_KEY);
      const lastFetch = localStorage.getItem('landing_page_last_fetch');

      if (cachedProperties && cachedBlogs && lastFetch) {
        const parsedProperties = JSON.parse(cachedProperties);
        const parsedBlogs = JSON.parse(cachedBlogs);
        const fetchTime = parseInt(lastFetch);

        if (isCacheValid(fetchTime)) {
          return {
            featuredProperties: parsedProperties,
            blogArticles: parsedBlogs,
            lastFetch: fetchTime,
          };
        }
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
    return null;
  }, [isCacheValid, PROPERTIES_CACHE_KEY, BLOGS_CACHE_KEY]);

  // Save cache to localStorage
  const saveCacheToStorage = useCallback((properties, blogs) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(PROPERTIES_CACHE_KEY, JSON.stringify(properties));
      localStorage.setItem(BLOGS_CACHE_KEY, JSON.stringify(blogs));
      localStorage.setItem('landing_page_last_fetch', new Date().getTime().toString());
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }, [PROPERTIES_CACHE_KEY, BLOGS_CACHE_KEY]);

  // Extract price helper function
  const extractPrice = useCallback((property) => {
    let price = null;
    let formattedPrice = "";
    
    if (property.listing_type === "RENT") {
      price = property.rent_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()} / ${property.rent_frequency === "MONTHLY" ? "Month" : "Year"}`;
      }
    } else if (property.listing_type === "SALE") {
      price = property.sale_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()}`;
      }
    }
    
    return formattedPrice || "Price on request";
  }, []);

  // Format properties data - preserve original API structure
  const formatProperties = useCallback((propertiesData) => {
    // Take the first 5 approved properties regardless of type
    const featuredProperties = propertiesData.slice(0, 5);
    
    // Return the original API data structure without transformation
    return featuredProperties.map(property => ({
      ...property, // Preserve all original API fields
      // Add any additional computed fields if needed
      formattedPrice: extractPrice(property)
    }));
  }, [extractPrice]);

  // Format blog articles data
  const formatBlogArticles = useCallback((blogsData) => {
    // Sort by date and get latest 3
    return blogsData
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 3)
      .map(blog => ({
        date: new Date(blog.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        title: blog.title,
        description: blog.summary || blog.excerpt || '',
        image: blog.cover_image_url,
        link: `/blog/${blog.slug}`
      }));
  }, []);

  // Fetch featured properties from API
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/properties/?listing_status=APPROVED`, {
        headers: {
          'accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const responseData = await response.json();
      const propertiesData = responseData.data || [];
      const formattedProperties = formatProperties(propertiesData);
      
      return formattedProperties;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  }, [API_BASE_URL, formatProperties]);

  // Fetch blog articles from API
  const fetchBlogArticles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/blogs/`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      const blogs = data.data || data;
      const formattedBlogs = formatBlogArticles(blogs);
      return formattedBlogs;
    } catch (error) {
      console.error('Error fetching blog articles:', error);
      return [];
    }
  }, [API_BASE_URL, formatBlogArticles]);

  // Get all landing page data with caching
  const getLandingPageData = useCallback(async (forceRefresh = false) => {
    // Check if we have valid cached data
    if (!forceRefresh) {
      const cachedData = loadCacheFromStorage();
      if (cachedData) {
        setCache(prev => ({
          ...prev,
          featuredProperties: cachedData.featuredProperties,
          blogArticles: cachedData.blogArticles,
          lastFetch: cachedData.lastFetch,
          isLoading: false,
          error: null,
        }));
        return {
          featuredProperties: cachedData.featuredProperties,
          blogArticles: cachedData.blogArticles,
        };
      }
    }

    try {
      setCache(prev => ({ ...prev, isLoading: true, error: null }));

      const [featuredProperties, blogArticles] = await Promise.all([
        fetchFeaturedProperties(),
        fetchBlogArticles()
      ]);

      const now = new Date().getTime();
      
      setCache(prev => ({
        ...prev,
        featuredProperties,
        blogArticles,
        lastFetch: now,
        isLoading: false,
        error: null,
      }));

      // Save to localStorage
      saveCacheToStorage(featuredProperties, blogArticles);

      return { featuredProperties, blogArticles };
    } catch (error) {
      setCache(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, [loadCacheFromStorage, fetchFeaturedProperties, fetchBlogArticles, saveCacheToStorage]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROPERTIES_CACHE_KEY);
      localStorage.removeItem(BLOGS_CACHE_KEY);
      localStorage.removeItem('landing_page_last_fetch');
    }
    
    setCache({
      featuredProperties: [],
      blogArticles: [],
      lastFetch: null,
      isLoading: false,
      error: null,
      initialized: false,
    });
  }, [PROPERTIES_CACHE_KEY, BLOGS_CACHE_KEY]);

  // Refresh data (force fetch)
  const refreshData = useCallback(async () => {
    return await getLandingPageData(true);
  }, [getLandingPageData]);

  // Initialize cache on mount
  useEffect(() => {
    const cachedData = loadCacheFromStorage();
    if (cachedData) {
      setCache(prev => ({
        ...prev,
        featuredProperties: cachedData.featuredProperties,
        blogArticles: cachedData.blogArticles,
        lastFetch: cachedData.lastFetch,
        isLoading: false,
        initialized: true,
      }));
    } else {
      // If no cache, fetch initial data
      getLandingPageData().then(() => {
        setCache(prev => ({ ...prev, initialized: true }));
      });
    }
  }, [getLandingPageData, loadCacheFromStorage]);

  const value = {
    ...cache,
    getLandingPageData,
    clearCache,
    refreshData,
    isCacheValid: () => isCacheValid(cache.lastFetch),
  };

  return (
    <LandingPageCacheContext.Provider value={value}>
      {children}
    </LandingPageCacheContext.Provider>
  );
}

export function useLandingPageCache() {
  const context = useContext(LandingPageCacheContext);
  if (!context) {
    throw new Error('useLandingPageCache must be used within a LandingPageCacheProvider');
  }
  return context;
}
