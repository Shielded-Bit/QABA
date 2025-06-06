"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
// import AnimatedBackground from '../components/shared/AnimatedBackground';

// Enhanced API Configuration
const API_ENDPOINTS = {
  QUOTES: 'https://api.quotable.io/random?tags=success,motivational,business',
  GITHUB_TRENDING: 'https://api.github.com/search/repositories?q=real-estate+OR+proptech&sort=stars&order=desc&per_page=6',
  // Using NewsAPI for Nigerian real estate news (you'll need to replace with your API key)
  NIGERIA_NEWS: 'https://newsapi.org/v2/everything?q=Nigeria+real+estate+property+housing&domains=businessday.ng,punchng.com,guardian.ng&language=en&sortBy=publishedAt&pageSize=12'
};

// Stock logos mapping
const STOCK_LOGOS = {
  'AAPL': 'https://logo.clearbit.com/apple.com',
  'GOOGL': 'https://logo.clearbit.com/google.com',
  'MSFT': 'https://logo.clearbit.com/microsoft.com',
  'AMZN': 'https://logo.clearbit.com/amazon.com',
  'TSLA': 'https://logo.clearbit.com/tesla.com',
  'NVDA': 'https://logo.clearbit.com/nvidia.com',
  'META': 'https://logo.clearbit.com/meta.com',
  'NFLX': 'https://logo.clearbit.com/netflix.com'
};

// Nigerian cities data for property trends
const NIGERIAN_CITIES_DATA = [
  {
    city: 'Lagos',
    averagePrice: 45000000,
    priceChange: 12.5,
    properties: 2847,
    growth: 8.3,
    hotSpots: ['Victoria Island', 'Ikoyi', 'Lekki', 'Ajah']
  },
  {
    city: 'Abuja',
    averagePrice: 38000000,
    priceChange: 10.2,
    properties: 1653,
    growth: 6.7,
    hotSpots: ['Maitama', 'Asokoro', 'Wuse 2', 'Gwarinpa']
  },
  {
    city: 'Port Harcourt',
    averagePrice: 22000000,
    priceChange: 7.8,
    properties: 892,
    growth: 4.5,
    hotSpots: ['GRA', 'Old GRA', 'Trans Amadi', 'Eliozu']
  },
  {
    city: 'Kano',
    averagePrice: 18000000,
    priceChange: 9.1,
    properties: 654,
    growth: 5.2,
    hotSpots: ['Nassarawa GRA', 'Fagge', 'Sabon Gari', 'Kano Municipal']
  },
  {
    city: 'Ibadan',
    averagePrice: 15000000,
    priceChange: 6.4,
    properties: 743,
    growth: 3.8,
    hotSpots: ['Bodija', 'Jericho', 'Oluyole', 'Ring Road']
  }
];

// Utility functions
const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { 
  style: 'currency', 
  currency: 'NGN', 
  minimumFractionDigits: 0, 
  maximumFractionDigits: 0 
}).format(amount);

const formatNumber = (num, suffix = '') => {
  if (suffix === 'K+') return `${(num / 1000).toFixed(num >= 1000 ? 0 : 1)}K+`;
  if (suffix === '%') return `${num}%`;
  if (suffix === 'M+') return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Custom hooks
const useCounterAnimation = () => {
  const animateCounter = useCallback((start, end, duration, callback) => {
    const startTime = Date.now();
    const range = end - start;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (range * easeOutQuart));
      callback(currentValue);
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
  }, []);

  return { animateCounter };
};

const useFetchData = () => {
  const [realEstateNews, setRealEstateNews] = useState([]);
  const [quotesData, setQuotesData] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [propertyTypesData, setPropertyTypesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Public news fetch ONLY, no mock data fallback
  const fetchRealEstateNews = async () => {
    try {
      // GNews public endpoint (limited, no key)
      const response = await fetch(
        'https://gnews.io/api/v4/search?q=Nigeria%20real%20estate%20property%20housing&lang=en&country=ng&max=9&token=demo'
      );
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      if (!data.articles) throw new Error('No articles found');
      return data.articles.map((article, idx) => ({
        id: idx + 1,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        source: article.source.name,
        url: article.url,
        urlToImage: article.image || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png',
        category: 'General',
      }));
    } catch (e) {
      // If fetch fails, return empty array (no news displayed)
      return [];
    }
  };

  const fetchQuotes = async () => {
    const response = await fetch(API_ENDPOINTS.QUOTES);
    if (!response.ok) throw new Error('Failed to fetch quotes');
    return response.json();
  };

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GITHUB_TRENDING);
      if (!response.ok) throw new Error('Failed to fetch GitHub data');
      const data = await response.json();
      return data.items.slice(0, 6);
    } catch (error) {
      console.error('GitHub fetch failed:', error);
      return [];
    }
  };

  // Add fetchPropertyTypesData function
  const fetchPropertyTypesData = async () => {
    try {
      // Example: Use a placeholder public API for demonstration
      // Replace with a real property types API if available
      const response = await fetch('https://api.sampleapis.com/realestate/types');
      if (!response.ok) throw new Error('Failed to fetch property types');
      const data = await response.json();
      return data.map((item, idx) => ({
        type: item.type || 'Unknown',
        averagePrice: item.averagePrice || 0,
        demand: item.demand || 0,
        roi: item.roi || 0,
        trend: item.trend || 'stable',
        icon: item.icon || '🏠',
      }));
    } catch (e) {
      return [];
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [news, quotes, github, propertyTypes] = await Promise.allSettled([
        fetchRealEstateNews(),
        fetchQuotes(),
        fetchGitHubRepos(),
        fetchPropertyTypesData()
      ]);
      if (news.status === 'fulfilled') setRealEstateNews(news.value);
      if (quotes.status === 'fulfilled') setQuotesData(quotes.value);
      if (github.status === 'fulfilled') setGithubRepos(github.value);
      if (propertyTypes.status === 'fulfilled') setPropertyTypesData(propertyTypes.value);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { realEstateNews, quotesData, githubRepos, propertyTypesData, loading, error, fetchData };
};


// Infinite Scroll Carousel Component for Cities
const CitiesCarousel = ({ cities }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) scrollPosition = 0;
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => { if (animationId) cancelAnimationFrame(animationId); };
    const handleMouseLeave = () => { animationId = requestAnimationFrame(animate); };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cities]);

  const renderCityCard = (city, index) => (
    <div key={`${city.city}-${index}`} className="flex-shrink-0 w-80 mx-3">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:shadow-2xl hover:border-green-500/50 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-xl">🏙️ {city.city}</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            city.priceChange >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {city.priceChange >= 0 ? '↗️' : '↘️'} {Math.abs(city.priceChange)}%
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-white">{formatCurrency(city.averagePrice)}</p>
            <p className="text-sm text-gray-400">Average Property Price</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Properties Listed</p>
              <p className="font-semibold text-white">{formatNumber(city.properties)}</p>
            </div>
            <div>
              <p className="text-gray-400">Market Growth</p>
              <p className="font-semibold text-green-400">{city.growth}%</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Hot Spots:</p>
            <div className="flex flex-wrap gap-1">
              {city.hotSpots.slice(0, 3).map((spot, i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {spot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const duplicatedCities = [...cities, ...cities];

  return (
    <div className="relative overflow-hidden">
      <div ref={scrollRef} className="flex overflow-x-hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {duplicatedCities.map((city, index) => renderCityCard(city, index))}
      </div>
    </div>
  );
};

// Main component
const NigerianRealEstateDashboard = () => {
  const { realEstateNews, quotesData, githubRepos, propertyTypesData, loading, error, fetchData } = useFetchData();
  const { animateCounter } = useCounterAnimation();
  const [counters, setCounters] = useState({ properties: 0, transactions: 0, growth: 0 });
  const statsRef = useRef(null);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const currentRef = statsRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCounters({ properties: 0, transactions: 0, growth: 0 });
            animateCounter(0, 125000, 2200, (value) => setCounters(prev => ({ ...prev, properties: value })));
            animateCounter(0, 45000, 1800, (value) => setCounters(prev => ({ ...prev, transactions: value })));
            animateCounter(0, 18, 1500, (value) => setCounters(prev => ({ ...prev, growth: value })));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, [animateCounter]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Content</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button onClick={fetchData} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:opacity-90 transition font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div className="relative z-10">
    
          {/* Hero Banner Section */}
              <div className="relative h-80 md:h-96">
                {/* Background Image with Gradient */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#014d98]/80 to-[#3ab7b1]/80 z-10"></div>
                  <Image
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
                    alt="Modern office building"
                    layout="fill"
                    objectFit="cover"
                    className="z-0"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-20 flex flex-col justify-center h-full max-w-6xl mx-auto px-4 md:px-8">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Nigerian Real Estate Market Hub
                  </h1>
                  <p className="text-white text-lg md:text-xl max-w-2xl">
                    Your premier destination for Nigerian property market insights,
                    trends, and investment opportunities across major cities.
                  </p>
                </div>
              </div>

        {/* Quote Section */}
        {quotesData && (
          <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <blockquote className="text-2xl md:text-3xl italic text-gray-200 mb-6 leading-relaxed">
                &ldquo;{quotesData.content}&rdquo;
              </blockquote>
              <cite className="text-lg text-green-400 font-medium">— {quotesData.author}</cite>
              {quotesData.tags.length > 0 && (
                <div className="mt-4 flex justify-center flex-wrap gap-2">
                  {quotesData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full text-sm">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Nigerian Cities Real Estate Trends */}
        <section className="py-16 bg-gray-900 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">🏘️ Major Cities Property Trends</h2>
              <p className="text-gray-400 text-lg">Live property market data across Nigeria&apos;s key metropolitan areas</p>
            </div>
            <CitiesCarousel cities={NIGERIAN_CITIES_DATA} />
          </div>
        </section>

        {/* Property Types Overview */}
        <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">🏠 Property Types & ROI Analysis</h2>
              <p className="text-gray-400 text-lg">Investment opportunities across different property categories</p>
            </div>
            {propertyTypesData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyTypesData.map((property) => (
                  <div key={property.type} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{property.icon}</span>
                        <h3 className="font-semibold text-lg text-white">{property.type}</h3>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${property.trend === 'up' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {property.trend === 'up' ? '📈' : '📊'} {property.trend}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xl font-bold text-white">{formatCurrency(property.averagePrice)}</p>
                        <p className="text-sm text-gray-400">Average Price</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Demand</p>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: `${property.demand}%`}}></div>
                            </div>
                            <span className="text-white font-medium">{property.demand}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400">ROI</p>
                          <p className="font-semibold text-green-400">{property.roi}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">No property types data available.</div>
            )}
          </div>
        </section>

        {/* Latest Real Estate News */}
        {realEstateNews.length > 0 && (
          <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">📰 Latest Real Estate News</h2>
                <p className="text-gray-400 text-lg">Stay updated with the latest developments in Nigerian real estate</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realEstateNews.map((article) => (
                  <div key={article.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-green-500/50 transition-all duration-300">
                    <div className="relative h-48">
                      <Image
                        src={article.urlToImage}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">{article.source}</span>
                        <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
                      </div>
                      <h3 className="font-bold text-lg text-white mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                      >
                        Read Full Article →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GitHub Trending PropTech */}
        {githubRepos.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-white">🚀 Trending PropTech Projects</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {githubRepos.map((repo) => (
                  <div key={repo.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-white">{repo.name}</h3>
                      <div className="flex items-center text-yellow-400">
                        <span className="mr-1">⭐</span>
                        <span className="text-sm font-medium">{formatNumber(repo.stargazers_count)}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{repo.description || 'No description available'}</p>
                    <div className="flex items-center justify-between">
                      {repo.language && <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">{repo.language}</span>}
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">View on GitHub →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nigerian Real Estate Market Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{formatNumber(counters.properties, 'K+')}</div>
                <div className="text-lg opacity-90">Active Property Listings</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{formatNumber(counters.transactions, 'K+')}</div>
                <div className="text-lg opacity-90">Annual Transactions</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{formatNumber(counters.growth, '%')}</div>
                <div className="text-lg opacity-90">Average Market Growth</div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-sm mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-200 font-medium">Loading latest market data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NigerianRealEstateDashboard;