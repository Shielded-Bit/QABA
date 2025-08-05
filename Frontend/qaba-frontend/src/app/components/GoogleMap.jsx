'use client';
import { useState } from 'react';

const GoogleMap = ({ address, apiKey }) => {
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validation checks
  if (!address) {
    return (
      <div className="w-full h-64 bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
        <p className="text-red-600 text-center px-4">No address provided</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-64 bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
        <p className="text-red-600 text-center px-4">Google Maps API key is missing</p>
      </div>
    );
  }

  // Create Google Maps Embed URL
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setMapError("Failed to load map");
    setIsLoading(false);
  };

  return (
    <div className="location-section">
      <div className="w-full h-64 relative rounded-lg overflow-hidden shadow-md">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {mapError ? (
          <div className="w-full h-full bg-red-50 flex items-center justify-center border border-red-200">
            <p className="text-red-600 text-center px-4">{mapError}</p>
          </div>
        ) : (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen=""
            loading="lazy"
            title="Property Location"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleMap;