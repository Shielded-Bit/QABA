class OptimizedApiService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.baseURL = process.env.NEXT_PUBLIC_API_URL;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cached data or return null if expired
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Store data in cache
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Generate cache key from URL and parameters
  getCacheKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${paramString ? '?' + paramString : ''}`;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Enhanced fetch with caching and deduplication
  async fetch(endpoint, options = {}) {
    const { useCache = true, params = {}, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, params);

    // Return cached data if available and caching is enabled
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { data: cached, fromCache: true };
      }
    }

    // Check if same request is already pending (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Build URL with query parameters
    const urlWithParams = new URL(url);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        urlWithParams.searchParams.append(key, params[key]);
      }
    });

    // Create the request promise
    const requestPromise = fetch(urlWithParams.toString(), {
      headers: this.getAuthHeaders(),
      ...fetchOptions
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Cache successful responses
      if (useCache && response.status === 200) {
        this.setCache(cacheKey, data);
      }
      
      return { data, fromCache: false };
    })
    .finally(() => {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    });

    // Store pending request for deduplication
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  // Batch multiple requests
  async batchRequests(requests) {
    return Promise.allSettled(requests.map(req => this.fetch(req.endpoint, req.options)));
  }

  // Optimized properties fetching with pagination and filtering
  async getProperties(options = {}) {
    const {
      listingStatus = 'APPROVED',
      listingType,
      page = 1,
      limit = 20,
      city,
      propertyType,
      minPrice,
      maxPrice,
      useCache = true
    } = options;

    const params = {
      listing_status: listingStatus,
      page,
      limit,
      ...(listingType && { listing_type: listingType }),
      ...(city && { city, q: city }),
      ...(propertyType && { property_type: propertyType }),
      ...(minPrice && { min_total: minPrice }),
      ...(maxPrice && { max_total: maxPrice })
    };

    try {
      const result = await this.fetch('/api/v1/properties/', { params, useCache });
      const properties = result.data?.data || result.data || [];
      
      return {
        properties: Array.isArray(properties) ? properties : [],
        total: result.data?.total || properties.length,
        fromCache: result.fromCache
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return { properties: [], total: 0, fromCache: false };
    }
  }

  // Get property details with caching
  async getPropertyDetails(propertyId, useCache = true) {
    try {
      const result = await this.fetch(`/api/v1/properties/${propertyId}/`, { useCache });
      const property = result.data?.property || result.data?.data || result.data;
      
      return {
        property,
        fromCache: result.fromCache
      };
    } catch (error) {
      console.error('Error fetching property details:', error);
      return { property: null, fromCache: false };
    }
  }

  // Get user profile data with caching
  async getUserProfile(useCache = true) {
    try {
      const userType = typeof window !== 'undefined' ? localStorage.getItem('user_type') : null;
      
      const requests = [
        { endpoint: '/api/v1/users/me/', options: { useCache } }
      ];

      if (userType) {
        const profileEndpoint = (userType === 'AGENT' || userType === 'LANDLORD') 
          ? '/api/v1/profile/agent/' 
          : '/api/v1/profile/client/';
        requests.push({ endpoint: profileEndpoint, options: { useCache } });
      }

      const results = await this.batchRequests(requests);
      
      const userData = results[0].status === 'fulfilled' ? results[0].value.data?.data : null;
      const profileData = results[1]?.status === 'fulfilled' ? results[1].value.data?.data : null;

      return {
        userData,
        profileData,
        fromCache: results.some(r => r.value?.fromCache)
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { userData: null, profileData: null, fromCache: false };
    }
  }

  // Get transaction history with pagination
  async getTransactions(page = 1, limit = 10, useCache = true) {
    try {
      const result = await this.fetch('/api/v1/history/', {
        params: { page, limit },
        useCache
      });

      return {
        transactions: result.data?.data || [],
        total: result.data?.total || 0,
        fromCache: result.fromCache
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { transactions: [], total: 0, fromCache: false };
    }
  }

  // Get analytics data with caching
  async getAnalytics(periodType = 'monthly', year = new Date().getFullYear(), useCache = true) {
    try {
      const result = await this.fetch('/api/v1/analytics/agent/', {
        params: { period_type: periodType, year },
        useCache
      });

      return {
        analytics: result.data?.data || [],
        fromCache: result.fromCache
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { analytics: [], fromCache: false };
    }
  }

  // Optimized search with debouncing
  async searchProperties(query, options = {}) {
    const {
      listingType,
      useCache = true,
      limit = 10
    } = options;

    if (!query || query.length < 2) {
      return { properties: [], fromCache: false };
    }

    const params = {
      q: query,
      limit,
      listing_status: 'APPROVED',
      ...(listingType && { listing_type: listingType })
    };

    try {
      const result = await this.fetch('/api/v1/properties/', { params, useCache });
      return {
        properties: result.data?.data || [],
        fromCache: result.fromCache
      };
    } catch (error) {
      console.error('Error searching properties:', error);
      return { properties: [], fromCache: false };
    }
  }

  // Clear cache for specific keys or all
  clearCache(pattern = null) {
    if (pattern) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.includes(pattern)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  // Prefetch data for better UX
  async prefetchPropertyDetails(propertyIds) {
    const requests = propertyIds.map(id => ({
      endpoint: `/api/v1/properties/${id}/`,
      options: { useCache: true }
    }));

    return this.batchRequests(requests);
  }
}

// Create singleton instance
const apiService = new OptimizedApiService();

export default apiService;

// Export individual methods for convenience
export const {
  getProperties,
  getPropertyDetails,
  getUserProfile,
  getTransactions,
  getAnalytics,
  searchProperties,
  clearCache,
  prefetchPropertyDetails
} = apiService; 