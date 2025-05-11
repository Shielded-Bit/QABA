'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, PlayCircle, BookImage } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/${params.id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const rawData = await response.json();
        
        const data = rawData.property ? rawData.property : 
                     rawData.data ? rawData.data : 
                     rawData;
        
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetail();
  }, [params.id]);

  const handlePrevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleBack = () => {
    router.push('/agent-dashboard/myListings');
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleDeleteProperty = async () => {
    try {
      setDeleteLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/${params.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Delete request failed with status ${response.status}`);
      }
      
      setShowDeleteModal(false);
      toast.success("Property deleted successfully!");
      
      setTimeout(() => {
        router.push('/agent-dashboard/myListings');
      }, 2000);
      
    } catch (err) {
      console.error("Failed to delete property:", err);
      toast.error(`Failed to delete property: ${err.message}`);
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to render action buttons based on property status
  const renderActionButtons = () => {
    const status = property?.listing_status?.toUpperCase();
    
    // For DRAFT properties: Show both Edit and Delete buttons
    if (status === 'DRAFT') {
      return (
        <div className="flex gap-2 mt-2 md:mt-0">
          <button 
            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => router.push(`/agent-dashboard/edit-property/${params.id}`)}
          >
            Edit
          </button>
          <button 
            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      );
    }
    
    // For APPROVED properties: Show no Edit or Delete buttons
    else if (status === 'APPROVED') {
      return (
        <div className="flex gap-2 mt-2 md:mt-0">
          <button 
            className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-green-400 text-white rounded-md hover:opacity-90 transition-all duration-300"
            onClick={handleBack}
          >
            Back to Listings
          </button>
        </div>
      );
    }
    
    // For PENDING properties: Show no Edit or Delete buttons
    else if (status === 'PENDING') {
      return (
        <div className="flex gap-2 mt-2 md:mt-0">
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
            Under Review
          </span>
          <button 
            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      );
    }
    
    // Default case: Show Edit and Delete buttons
    return (
      <div className="flex gap-2 mt-2 md:mt-0">
        <button 
          className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => router.push(`/agent-dashboard/edit-property/${params.id}`)}
        >
          Edit
        </button>
        <button 
          className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-w-md">
          <p className="text-red-700 mb-4">Error loading property: {error}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl mb-4">Property not found</p>
        <button 
          onClick={handleBack}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-green-400 text-white rounded-md hover:opacity-90 transition-all duration-300"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      return image;
    } else if (image && typeof image === 'object' && image.image_url) {
      return image.image_url;
    } else if (property.thumbnail && typeof property.thumbnail === 'string') {
      return property.thumbnail;
    } else {
      return "/api/placeholder/400/320";
    }
  };
  
  // Create a fallback for images if none are available
  const images = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ["/api/placeholder/400/320"];

  const amount = property.rent_price || property.sale_price || 'N/A';
  const propertyType = property.listing_type === "SALE" ? "Buy" : "Rent";

  // Add status indicator badge
  const getStatusBadge = () => {
    const status = property?.listing_status?.toUpperCase();
    if (status === 'APPROVED') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Approved</span>;
    } else if (status === 'PENDING') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">Pending</span>;
    } else if (status === 'DRAFT') {
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">Draft</span>;
    }
    return null;
  };

  // Check if the property has a video
  const hasVideo = property.video && property.video.video_url;

  return (
    <div className="w-full mx-auto p-0 lg:p-8 pl-14 ">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Property</h3>
            <p className="mb-6">Are you sure you want to delete &quot;{property.property_name}&quot;? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Deleting...
                  </>
                ) : (
                  'Delete Property'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">{property.property_name}</h1>
            {getStatusBadge()}
          </div>
          {renderActionButtons()}
        </div>

        <p className="text-blue-500 mb-4 md:mb-6">{property.location}</p>

        <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
          {property.amenities && property.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-500">
              {/* Use the emoji icon directly from the backend data */}
              <span className="text-2xl">{amenity.icon || '🏠'}</span>
              <span>{typeof amenity === 'string' ? amenity : amenity.name}</span>
            </div>
          ))}
        </div>

        {/* Image and Description Section - Side by Side on md and larger screens */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Image/Video Carousel - Takes full width on mobile, 50% on larger screens */}
          <div className="md:w-1/2">
            <div className="relative mb-4">
              {/* Toggle between image and video if video exists */}
              {hasVideo && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={toggleVideo}
                    className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-900 to-green-400 text-white rounded-md hover:opacity-90 transition-all duration-300"
                  >
                    {showVideo ? (
                      <>
                        <BookImage className="w-4 h-4" /> View Photos
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" /> Watch Video
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Show Video or Images */}
              {(hasVideo && showVideo) ? (
                <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden">
                  <video 
                    controls
                    className="w-full h-full object-cover"
                    src={property.video.video_url}
                    poster={property.thumbnail || (images[0] && getImageUrl(images[0]))}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden">
                  {/* Main displayed image with proper handling of image objects */}
                  {images && images[currentImageIndex] && (
                    <Image 
                      src={getImageUrl(images[currentImageIndex])} 
                      alt={property.property_name || "Property Image"}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized={true} // Important for external images
                    />
                  )}
                  
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button 
                      onClick={handlePrevImage}
                      className="bg-white rounded-full p-1 md:p-2 shadow-md ml-2 md:ml-4"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </div>
                  
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button 
                      onClick={handleNextImage}
                      className="bg-white rounded-full p-1 md:p-2 shadow-md mr-2 md:mr-4"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Only show image thumbnails when not showing video */}
            {!showVideo && (
              <div className="flex justify-center gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`w-12 h-10 md:w-16 md:h-12 rounded overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <div className="relative w-full h-full">
                      {/* Thumbnail images with proper handling of image objects */}
                      <Image 
                        src={getImageUrl(img)} 
                        alt={`Property thumbnail ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized={true} // Since we're using Cloudinary URLs
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section - Takes full width on mobile, 50% on larger screens */}
          <div className="md:w-1/2">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Home Description</h2>
            <p className="text-gray-700 mb-4">
              {property.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 border-t border-b py-6">
          <div>
            <h3 className="text-gray-500 text-sm md:text-base mb-1 md:mb-2">{propertyType === "Buy" ? "Sale Price" : `Rent (${property.rent_frequency || 'Monthly'})`}</h3>
            <p className="text-xl md:text-2xl font-bold">₦ {amount}</p>
          </div>
          
          <div>
            <h3 className="text-gray-500 text-sm md:text-base mb-1 md:mb-2">Bedrooms</h3>
            <p className="text-xl md:text-2xl font-bold">{property.bedrooms || 'N/A'} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
          </div>
          
          <div>
            <h3 className="text-gray-500 text-sm md:text-base mb-1 md:mb-2">Bathroom</h3>
            <p className="text-xl md:text-2xl font-bold">{property.bathrooms || 'N/A'} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</p>
          </div>
          
          <div>
            <h3 className="text-gray-500 text-sm md:text-base mb-1 md:mb-2">Square Feet</h3>
            <p className="text-xl md:text-2xl font-bold">
              {property.area_sqft ? 
                (typeof property.area_sqft === 'object' ? 
                  `${property.area_sqft.min} - ${property.area_sqft.max}` : 
                  property.area_sqft) : 
                'N/A'} sq ft
            </p>
          </div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Key Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 md:gap-3">
                  {/* Display the icon directly from the backend data */}
                  <span className="text-2xl">{amenity.icon || '🏠'}</span>
                  <span className="text-sm md:text-base font-medium">
                    {typeof amenity === 'string' ? amenity : amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}