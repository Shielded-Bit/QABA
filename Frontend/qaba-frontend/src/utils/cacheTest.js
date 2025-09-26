// Simple test utility to verify caching functionality
// This can be run in the browser console to test the cache

export const testPropertiesCache = () => {
  console.log('🧪 Testing All Caches...');
  
  const now = new Date().getTime();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes
  const landingCacheDuration = 10 * 60 * 1000; // 10 minutes
  
  // Test main properties cache
  const propertiesCache = localStorage.getItem('properties_cache_data');
  const citiesCache = localStorage.getItem('properties_cities_cache');
  const propertiesLastFetch = localStorage.getItem('properties_last_fetch');
  
  // Test rent cache
  const rentCache = localStorage.getItem('properties_cache_RENT');
  const rentCitiesCache = localStorage.getItem('properties_cities_RENT');
  const rentLastFetch = localStorage.getItem('properties_last_fetch_RENT');
  
  // Test sale cache
  const saleCache = localStorage.getItem('properties_cache_SALE');
  const saleCitiesCache = localStorage.getItem('properties_cities_SALE');
  const saleLastFetch = localStorage.getItem('properties_last_fetch_SALE');
  
  // Test landing page cache
  const landingPropertiesCache = localStorage.getItem('landing_page_properties_cache');
  const landingBlogsCache = localStorage.getItem('landing_page_blogs_cache');
  const landingLastFetch = localStorage.getItem('landing_page_last_fetch');
  
  const checkCacheStatus = (data, cities, fetchTime, duration = cacheDuration) => {
    if (!data || !cities || !fetchTime) {
      return 'Empty/Not set';
    }
    const parsedFetchTime = parseInt(fetchTime);
    if (isNaN(parsedFetchTime)) {
      return 'Invalid fetch time';
    }
    const isValid = (now - parsedFetchTime) < duration;
    return isValid ? `Valid (${Math.round((duration - (now - parsedFetchTime)) / 1000)}s remaining)` : 'Expired';
  };
  
  const result = {
    propertiesPage: {
      data: propertiesCache ? JSON.parse(propertiesCache).length : 0,
      cities: citiesCache ? JSON.parse(citiesCache).length : 0,
      lastFetch: propertiesLastFetch ? new Date(parseInt(propertiesLastFetch)).toLocaleString() : 'N/A',
      status: checkCacheStatus(propertiesCache, citiesCache, propertiesLastFetch),
    },
    rentPage: {
      data: rentCache ? JSON.parse(rentCache).length : 0,
      cities: rentCitiesCache ? JSON.parse(rentCitiesCache).length : 0,
      lastFetch: rentLastFetch ? new Date(parseInt(rentLastFetch)).toLocaleString() : 'N/A',
      status: checkCacheStatus(rentCache, rentCitiesCache, rentLastFetch),
    },
    buyPage: {
      data: saleCache ? JSON.parse(saleCache).length : 0,
      cities: saleCitiesCache ? JSON.parse(saleCitiesCache).length : 0,
      lastFetch: saleLastFetch ? new Date(parseInt(saleLastFetch)).toLocaleString() : 'N/A',
      status: checkCacheStatus(saleCache, saleCitiesCache, saleLastFetch),
    },
    landingPage: {
      properties: landingPropertiesCache ? JSON.parse(landingPropertiesCache).length : 0,
      blogs: landingBlogsCache ? JSON.parse(landingBlogsCache).length : 0,
      lastFetch: landingLastFetch ? new Date(parseInt(landingLastFetch)).toLocaleString() : 'N/A',
      status: checkCacheStatus(landingPropertiesCache, landingBlogsCache, landingLastFetch, landingCacheDuration),
    },
  };
  
  console.log('📦 Cache Status:', result);
  return result;
};

// Clear cache test
export const clearCacheTest = () => {
  console.log('🗑️ Clearing All Caches...');
  
  const keys = [
    'properties_cache_data',
    'properties_cities_cache', 
    'properties_last_fetch',
    'properties_cache_RENT',
    'properties_cities_RENT',
    'properties_last_fetch_RENT',
    'properties_cache_SALE',
    'properties_cities_SALE',
    'properties_last_fetch_SALE',
    'landing_page_properties_cache',
    'landing_page_blogs_cache',
    'landing_page_last_fetch'
  ];
  
  keys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed ${key}`);
  });
  
  console.log('🎉 All caches cleared successfully!');
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testPropertiesCache = testPropertiesCache;
  window.clearCacheTest = clearCacheTest;
}
