"use client"; // This tells Next.js that the component is a client component
import { CiSearch } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import Button from "../shared/Button"; // Assuming the Button component exists in the same directory
import { useRouter } from "next/navigation";
import { getPropertyLocationSuggestions, getAllPropertyLocations } from "../../utils/propertyLocationIndex";

const SearchInput = ({ onSearch, placeholder = "e.g Abakiliki" }) => {
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch available locations from API based on active tab
  useEffect(() => {
    const fetchAvailableLocations = async () => {
      try {
        setLoading(true);
        // If no active tab is selected, fetch all properties
        const listingType = activeTab === "buy" ? "SALE" : activeTab === "rent" ? "RENT" : "";
        const apiUrl = listingType 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED&listing_type=${listingType}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED`;
        
        const response = await fetch(apiUrl, {
          headers: { 'accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          const properties = data.data || [];
          
          // Extract unique locations from properties for this specific listing type
          const uniqueLocations = [...new Set(
            properties
              .map(property => property.location)
              .filter(location => location && location.trim())
          )];

          // Extract unique cities from properties for this specific listing type
          const uniqueCities = [...new Set(
            properties
              .map(property => property.city)
              .filter(city => city && city.trim())
          )];

          // Only use actual API locations for this listing type
          // Don't mix with all predefined locations to keep suggestions specific
          const specificLocations = [
            ...uniqueLocations,
            ...uniqueCities
          ];

          // Remove duplicates and sort
          const finalLocations = [...new Set(specificLocations)].sort();
          setAvailableLocations(finalLocations);
        } else {
          // If API fails, use predefined locations as fallback
          setAvailableLocations(getAllPropertyLocations());
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to predefined locations only if API completely fails
        setAvailableLocations(getAllPropertyLocations());
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableLocations();
  }, [activeTab]);

  // Generate suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    // Prioritize suggestions from actual available locations (API-based) for the current listing type
    const apiSuggestions = availableLocations.filter(location =>
      location.toLowerCase().includes(searchLower)
    );
    
    // Get suggestions from predefined locations as secondary option
    const predefinedSuggestions = getPropertyLocationSuggestions(searchTerm);
    
    // Only include predefined suggestions that aren't already in API suggestions
    const uniquePredefinedSuggestions = predefinedSuggestions.filter(location =>
      !apiSuggestions.some(apiLoc => apiLoc.toLowerCase() === location.toLowerCase())
    );

    // Prioritize API suggestions (actual properties available) over predefined ones
    const allSuggestions = [
      ...apiSuggestions,
      ...uniquePredefinedSuggestions
    ];
    
    // Limit to top 8 suggestions and sort by relevance, prioritizing API suggestions
    const sortedSuggestions = allSuggestions
      .sort((a, b) => {
        const aIsFromAPI = apiSuggestions.includes(a);
        const bIsFromAPI = apiSuggestions.includes(b);
        
        // Prioritize API suggestions
        if (aIsFromAPI && !bIsFromAPI) return -1;
        if (!aIsFromAPI && bIsFromAPI) return 1;
        
        // Within the same type, prioritize those that start with search term
        const aStartsWith = a.toLowerCase().startsWith(searchLower);
        const bStartsWith = b.toLowerCase().startsWith(searchLower);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        return a.localeCompare(b);
      })
      .slice(0, 8);

    setSuggestions(sortedSuggestions);
    setShowSuggestions(sortedSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm, availableLocations, activeTab]);

  const handleTabClick = (tab) => {
    if (tab === 'sell') {
      router.push('/add-listing');
      return;
    }
    setActiveTab(tab);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Trigger search immediately
    if (activeTab) {
      router.push(`/${activeTab}?q=${encodeURIComponent(suggestion)}`);
    } else {
      router.push(`/properties?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    if (activeTab) {
      if (searchTerm.trim()) {
        router.push(`/${activeTab}?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        router.push(`/${activeTab}`);
      }
    } else {
      // When no tab is selected, always go to all properties page
      if (searchTerm.trim()) {
        router.push(`/properties?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        router.push(`/properties`);
      }
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e) => {
    // Delay hiding suggestions to allow for clicking
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  return (
    <div className="bg-white bg-opacity-45 rounded-lg shadow-md p-4 sm:p-6 w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
      {/* Tabs Section */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium transition-all duration-200 ${
            activeTab === "buy"
              ? "text-black border-b-2 border-blue-500"
              : "text-gray-500 hover:text-black hover:border-b-2 hover:border-blue-500"
          }`}
          onClick={() => handleTabClick("buy")}
        >
          Buy
        </button>
        <button
          className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium transition-all duration-200 ${
            activeTab === "rent"
              ? "text-black border-b-2 border-blue-500"
              : "text-gray-500 hover:text-black hover:border-b-2 hover:border-blue-500"
          }`}
          onClick={() => handleTabClick("rent")}
        >
          Rent
        </button>
        <button
          className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium text-gray-500 hover:text-black hover:border-b-2 hover:border-blue-500 transition-all duration-200`}
          onClick={() => handleTabClick("sell")}
        >
          List Your Property
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-2 relative">
        {/* Label */}
        <div className="text-left">
          <label
            htmlFor="search"
            className="block text-gray-700 font-medium text-sm sm:text-base"
          >
            Enter a location
          </label>
        </div>

        {/* Input and Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center border rounded-md p-2">
          <input
            ref={inputRef}
            id="search"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="flex-grow bg-transparent outline-none text-gray-900 px-2 py-2 w-full text-sm sm:text-base placeholder:text-gray-600"
            autoComplete="off"
          />
          <Button
            label={
              <span className="flex items-center gap-2 text-sm sm:text-base">
                Search <CiSearch />
              </span>
            }
            onClick={handleSearch}
            className="mt-2 sm:mt-0 sm:ml-4 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-black font-semibold px-4 sm:px-6 py-2 rounded-md hover:opacity-90"
          />
        </div>

        {/* Location Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-64 overflow-y-auto"
          >
            {loading && (
              <div className="px-4 py-2 text-gray-500 text-sm">
                Loading locations...
              </div>
            )}
            
            {!loading && suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50 font-medium">
                  {activeTab ? `Properties for ${activeTab} available in:` : 'All properties available in:'}
                </div>
                                  {suggestions.map((suggestion, index) => {
                    const isFromAPI = availableLocations.includes(suggestion);
                    return (
                      <button
                        key={`${suggestion}-${index}`}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          selectedIndex === index 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700'
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CiSearch className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{suggestion}</span>
                          </div>
                          {isFromAPI && (
                            <div className="flex items-center">
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                Available
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </>
            )}
            
            {!loading && suggestions.length === 0 && searchTerm && (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No locations found for &ldquo;{searchTerm}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
