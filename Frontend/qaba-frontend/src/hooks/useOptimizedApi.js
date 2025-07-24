import { useState, useEffect, useCallback, useRef } from 'react';

// NOTE: This file is currently disabled due to optimizedApiService import issues
// TODO: Refactor to use direct fetch calls instead of optimized API service
// All exports are commented out to prevent import errors

/*

// Custom hook for optimized API calls with enhanced loading states
export const useOptimizedApi = () => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingRequestsRef = useRef(new Set());

  // Track loading state across multiple requests
  const setRequestLoading = useCallback((requestId, isLoading) => {
    if (isLoading) {
      pendingRequestsRef.current.add(requestId);
    } else {
      pendingRequestsRef.current.delete(requestId);
    }
    setGlobalLoading(pendingRequestsRef.current.size > 0);
  }, []);

  // Clear all errors
  const clearError = useCallback(() => setError(null), []);

  return {
    globalLoading,
    error,
    clearError,
    setRequestLoading
  };
};

// Hook for fetching properties with optimized loading
export const useProperties = (options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { setRequestLoading } = useOptimizedApi();

  const fetchProperties = useCallback(async (fetchOptions = {}) => {
    const requestId = `properties-${Date.now()}`;
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const mergedOptions = { ...options, ...fetchOptions };
      // TODO: Replace with direct fetch call
    throw new Error('useOptimizedApi hooks are currently disabled');
      
      setProperties(result.properties);
      setTotal(result.total);
      setHasMore(result.properties.length === (mergedOptions.limit || 20));
      
      // Show cache indicator in dev mode
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log('Properties loaded from cache');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [options, setRequestLoading]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    total,
    hasMore,
    refetch: fetchProperties,
    clearError: () => setError(null)
  };
};

// Hook for fetching property details with enhanced caching
export const usePropertyDetails = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setRequestLoading } = useOptimizedApi();

  const fetchProperty = useCallback(async (useCache = true) => {
    if (!propertyId) return;
    
    const requestId = `property-${propertyId}`;
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const result = await apiService.getPropertyDetails(propertyId, useCache);
      setProperty(result.property);
      
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log(`Property ${propertyId} loaded from cache`);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching property details:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [propertyId, setRequestLoading]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch: () => fetchProperty(false), // Force fresh data
    clearError: () => setError(null)
  };
};

// Hook for user profile with batched requests
export const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setRequestLoading } = useOptimizedApi();

  const fetchProfile = useCallback(async (useCache = true) => {
    const requestId = 'user-profile';
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const result = await apiService.getUserProfile(useCache);
      setUserData(result.userData);
      setProfileData(result.profileData);
      
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log('User profile loaded from cache');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [setRequestLoading]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    userData,
    profileData,
    loading,
    error,
    refetch: () => fetchProfile(false),
    clearError: () => setError(null)
  };
};

// Hook for transactions with pagination
export const useTransactions = (page = 1, limit = 10) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { setRequestLoading } = useOptimizedApi();

  const fetchTransactions = useCallback(async (currentPage = page, useCache = true) => {
    const requestId = `transactions-${currentPage}`;
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const result = await apiService.getTransactions(currentPage, limit, useCache);
      setTransactions(result.transactions);
      setTotal(result.total);
      
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log(`Transactions page ${currentPage} loaded from cache`);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [page, limit, setRequestLoading]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    total,
    refetch: (newPage) => fetchTransactions(newPage, false),
    clearError: () => setError(null)
  };
};

// Hook for search with debouncing
export const usePropertySearch = (query, options = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setRequestLoading } = useOptimizedApi();
  const debounceTimeoutRef = useRef(null);

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const requestId = `search-${searchQuery}`;
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const result = await apiService.searchProperties(searchQuery, options);
      setResults(result.properties);
      
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log(`Search results for "${searchQuery}" loaded from cache`);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error searching properties:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [options, setRequestLoading]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      search(query);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, search]);

  return {
    results,
    loading,
    error,
    clearResults: () => setResults([]),
    clearError: () => setError(null)
  };
};

// Hook for analytics with caching
export const useAnalytics = (periodType = 'monthly', year = new Date().getFullYear()) => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setRequestLoading } = useOptimizedApi();

  const fetchAnalytics = useCallback(async (useCache = true) => {
    const requestId = `analytics-${periodType}-${year}`;
    
    try {
      setLoading(true);
      setRequestLoading(requestId, true);
      setError(null);

      const result = await apiService.getAnalytics(periodType, year, useCache);
      setAnalytics(result.analytics);
      
      if (process.env.NODE_ENV === 'development' && result.fromCache) {
        console.log(`Analytics for ${periodType} ${year} loaded from cache`);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRequestLoading(requestId, false);
    }
  }, [periodType, year, setRequestLoading]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: () => fetchAnalytics(false),
    clearError: () => setError(null)
  };
};

// Utility hook for prefetching data
export const usePrefetch = () => {
  const prefetchProperties = useCallback(async (propertyIds) => {
    try {
      await apiService.prefetchPropertyDetails(propertyIds);
      console.log(`Prefetched ${propertyIds.length} properties`);
    } catch (err) {
      console.error('Error prefetching properties:', err);
    }
  }, []);

  const clearCache = useCallback((pattern) => {
    // apiService.clearCache(pattern);
    console.log(pattern ? `Cleared cache for: ${pattern}` : 'Cleared all cache');
  }, []);

*/

// Placeholder exports to prevent import errors
export const useOptimizedApi = () => {
  throw new Error('useOptimizedApi hooks are currently disabled');
};

export const useProperties = () => {
  throw new Error('useProperties hook is currently disabled');
};

export const usePropertyDetails = () => {
  throw new Error('usePropertyDetails hook is currently disabled');
};

export const useUserProfile = () => {
  throw new Error('useUserProfile hook is currently disabled');
};

export const useTransactions = () => {
  throw new Error('useTransactions hook is currently disabled');
};

export const useSearchProperties = () => {
  throw new Error('useSearchProperties hook is currently disabled');
};

export const useAnalytics = () => {
  throw new Error('useAnalytics hook is currently disabled');
}; 