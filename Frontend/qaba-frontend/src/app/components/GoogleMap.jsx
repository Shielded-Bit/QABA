'use client';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';

const GoogleMap = ({ address, apiKey }) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Function to load Google Maps script
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }
    
    // Check if script is already in the process of loading
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Script is loading, wait for it
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          setScriptLoaded(true);
        }
      }, 100);
      return;
    }
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      setMapError("Failed to load Google Maps script");
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
  };

  // Memoize loadGoogleMapsScript to avoid missing dependency warning
  const loadScript = useRef(loadGoogleMapsScript);
  useEffect(() => {
    loadScript.current = loadGoogleMapsScript;
  }, [loadGoogleMapsScript]);

  // Initial validation check
  useEffect(() => {
    if (!address) {
      setMapError("No address provided");
      setIsLoading(false);
      return;
    }
    
    if (!apiKey) {
      setMapError("Google Maps API key is missing");
      setIsLoading(false);
      return;
    }
    
    loadScript.current();
    
    // Cleanup
    return () => {
      setMapInstance(null);
    };
  }, [address, apiKey]);

  // Handle map initialization when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !address || !apiKey || mapInstance) return;
    
    // Make sure the container is available before creating the map
    if (!mapRef.current) {
      console.log("Map container not yet available");
      return; // Wait for next cycle when ref is available
    }

    const initializeMap = () => {
      try {
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          setIsLoading(false);
          
          if (status === 'OK' && results && results[0]) {
            const position = results[0].geometry.location;
            
            const mapOptions = {
              center: position,
              zoom: 15,
              mapTypeControl: false,
              streetViewControl: true,
              fullscreenControl: true,
            };
            
            // Create map instance
            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            
            // Add marker
            new window.google.maps.Marker({
              map,
              position,
              animation: window.google.maps.Animation.DROP,
            });
            
            setMapInstance(map);
          } else {
            setMapError(`Could not find location for "${address}"`);
          }
        });
      } catch (err) {
        console.error("Map initialization error:", err);
        setMapError(`Map initialization error: ${err.message}`);
        setIsLoading(false);
      }
    };

    // Use a timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
      } else {
        setMapError("Map container reference is not available");
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [scriptLoaded, address, apiKey, mapInstance]);

  // This forces the component to actually render the div first before any script loading
  useLayoutEffect(() => {
    // Just to ensure the ref is created in DOM before we try to use it
    console.log("Map container created:", mapRef.current ? "Yes" : "No");
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (mapError) {
    return (
      <div className="w-full h-64 bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
        <p className="text-red-600 text-center px-4">{mapError}</p>
      </div>
    );
  }

  // Render map container
  return (
    <div id="google-map-container" className="w-full h-64 rounded-lg shadow-md">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default GoogleMap;