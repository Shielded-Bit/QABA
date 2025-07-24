'use client';
import Button from '@/app/components/shared/Button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import RenterReviews from '@/app/components/reviewCard/RenterReviews';
import ListedByCard from '@/app/components/ListedByCard/ListedByCard';
import CommentBox from '@/app/components/commentAndRating/CommentBox';
import ListingCard from '@/app/components/listingCard/ListingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import GoogleMap from '@/app/components/GoogleMap';
import PaymentButton from '@/app/components/PaymentButton';
// import PaymentVerifier from '@/app/components/PaymentVerifier';
import PriceBreakdown from '@/app/components/shared/PriceBreakdown';
import PropertyVerifications from '@/app/components/PropertyVerifications';
import ScheduleVisitModal from '@/app/components/modal/ScheduleVisitModal';
import EnquiryModal from '@/app/components/modal/EnquiryModal';
import 'swiper/css';
import 'swiper/css/pagination';
import PropertyDetailsSkeleton from "./PropertyDetailsSkeleton";

// Custom styles for Swiper pagination
const swiperPaginationStyles = `
  .swiper-pagination-bullet {
    background: #e5e7eb !important;
    opacity: 1 !important;
    width: 12px !important;
    height: 12px !important;
  }
  .swiper-pagination-bullet-active {
    background: linear-gradient(135deg, #1e3a8a, #059669) !important;
  }
`;

// Removed hardcoded similarListings as we'll use related_properties from API

const PropertyDetails = ({ params }) => {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!unwrappedParams?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch property details directly
        const accessToken = localStorage.getItem('access_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${unwrappedParams.id}/`, {
          method: 'GET',
          headers,
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Property not found');
          }
          throw new Error(`Failed to fetch property: ${res.status}`);
        }
        
        const response = await res.json();
        const data = response.data;
        
        if (!data) {
          throw new Error('Property not found');
        }
        
        if (data.listed_by) {
          const listedBy = data.listed_by;
          data.agent = {
            id: listedBy.id,
            name: `${listedBy.first_name} ${listedBy.last_name}`,
            email: listedBy.email,
            phone: listedBy.phone_number,
            userType: listedBy.user_type,
            company: listedBy.user_type === "AGENT" ? "Real Estate Agent" : "Property Owner",
            image: listedBy.agentprofile?.profile_photo_url || "/assets/images/default-user.png",
            rating: 4,
            country: listedBy.agentprofile?.country,
            state: listedBy.agentprofile?.state,
            city: listedBy.agentprofile?.city,
            address: listedBy.agentprofile?.address,
            location: listedBy.agentprofile ? 
              `${listedBy.agentprofile.city || ''}, ${listedBy.agentprofile.state || ''}`.trim() : 
              "Nigeria"
          };
        }
        
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetail();
  }, [unwrappedParams]);

  useEffect(() => {
    if (!property?.images?.length) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < property.images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [property]);

  const handleNext = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < property.images.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const handlePrev = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : property.images.length - 1
      );
    }
  };

  const handleBack = () => router.back();

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image?.image_url) return image.image_url;
    if (property?.thumbnail) return property.thumbnail;
    return "/api/placeholder/400/320";
  };

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-w-md">
          <p className="text-red-700 mb-4">Error loading property: {error}</p>
          <div className="flex gap-2">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Try Again
            </button>
            <button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl mb-4">Property not found</p>
        <button onClick={handleBack} className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-green-400 text-white rounded-md hover:opacity-90 transition-all duration-300">
          Back
        </button>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : ["/api/placeholder/400/320"];
  const propertyType = property.listing_type === "SALE" ? "Buy" : "Rent";
  const basePrice = property.rent_price || property.sale_price || 'N/A';
  const totalPrice = property.total_price || basePrice;
  const priceFrequency = property.listing_type === "RENT" ? `/ ${property.rent_frequency_display || 'Month'}` : '';
  const hasVideo = property.video?.video_url;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Custom Swiper Styles */}
      <style jsx global>{swiperPaginationStyles}</style>
      
      {/* Modals */}
      {showScheduleModal && property && (
        <ScheduleVisitModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          property={{
            id: property.id,
            name: property.property_name,
            link: typeof window !== 'undefined' ? window.location.href : '',
          }}
        />
      )}
      {showEnquiryModal && property && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          property={{
            id: property.id,
            name: property.property_name,
            link: typeof window !== 'undefined' ? window.location.href : '',
          }}
        />
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          onClick={handleBack} 
          className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>←</span> Back to listings
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Property Title and Location */}
        <div className="mb-3">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
            {property.property_name} {property.listing_status === 'APPROVED' && <span className="text-blue-500">✔</span>}
          </h1>
          <p className="text-blue-500 text-lg">{property.location}</p>
          
          {property.rating && (
            <div className="flex items-center mt-2">
              <div className="flex text-blue-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(property.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="ml-2 text-gray-700 text-lg">
                {property.rating} ({property.rating_count || 0} Ratings)
              </span>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2">
              <div className="relative h-60 sm:h-96">
                <Image
                  className="rounded-lg"
                  src={getImageUrl(images[currentImageIndex])}
                  alt={`Property Image ${currentImageIndex + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized={true}
                />
              </div>
            </div>

            <div className="hidden sm:block w-full sm:w-1/2">
              <div className="relative h-60 sm:h-96">
                <Image
                  className="rounded-lg"
                  src={getImageUrl(images[(currentImageIndex + 1) % images.length])}
                  alt="Secondary property image"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized={true}
                />
              </div>
            </div>
          </div>

          {/* Thumbnails Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors" onClick={handlePrev}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2 items-center overflow-x-auto max-w-lg">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border ${currentImageIndex === index ? 'ring-2 ring-blue-500 w-14 h-14' : 'w-10 h-10'} rounded-lg flex-shrink-0 transition-all`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      className="rounded-lg"
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized={true}
                    />
                  </div>
                </button>
              ))}
            </div>
            <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors" onClick={handleNext}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Quick Property Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">{propertyType === "Buy" ? "Total Price" : `${property.rent_frequency_display || 'Monthly'} Rent`}</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₦ {parseFloat(totalPrice).toLocaleString()}</p>
              {priceFrequency && <p className="text-sm text-gray-500">{priceFrequency}</p>}
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Bedrooms</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{property.bedrooms || 'N/A'}</p>
              <p className="text-sm text-gray-500">{property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Bathrooms</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{property.bathrooms || 'N/A'}</p>
              <p className="text-sm text-gray-500">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-orange-600 text-sm font-medium">Square Feet</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {property.area_sqft ? 
                  (typeof property.area_sqft === 'object' ? 
                    `${property.area_sqft.min}-${property.area_sqft.max}` : 
                    property.area_sqft) : 
                  'N/A'}
              </p>
              <p className="text-sm text-gray-500">sq ft</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Property Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
            </div>

            {/* Key Features */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                  Key Features & Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Display icon if available */}
                      {amenity.icon ? (
                        <span className="text-xl flex-shrink-0">{amenity.icon}</span>
                      ) : (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                      <span className="text-gray-800 font-medium">
                        {typeof amenity === 'string' ? amenity : amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <PriceBreakdown property={property} />
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Location & Map
              </h2>
              <div className="mb-4">
                <p className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {property.location}
                </p>
              </div>
              
              {property.location ? (
                <GoogleMap 
                  address={property.location} 
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p>Address information not available</p>
                </div>
              )}
            </div>

            {/* Property Video */}
            {hasVideo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                  Property Video Tour
                </h3>
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                  <video 
                    controls
                    className="w-full h-full object-cover"
                    src={property.video.video_url}
                    poster={property.thumbnail || (images[0] && getImageUrl(images[0]))}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 z-10">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Take Action
              </h3>
              <div className="space-y-4">
                {paymentSuccess ? (
                  <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Payment successful! Thank you for your purchase.</span>
                  </div>
                ) : (
                  <>
                    <PaymentButton 
                      propertyId={property.id} 
                      propertyType={property.listing_type}
                      price={property.total_price || property.listing_type === "SALE" ? property.sale_price : property.rent_price}
                    />
                    <div className="space-y-3">
                      <Button 
                        label="Schedule a Visit" 
                        variant="primary" 
                        className="w-full"
                        onClick={() => setShowScheduleModal(true)}
                      />
                      <Button 
                        label="Make an Enquiry" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowEnquiryModal(true)}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Have questions? Contact the agent directly to discuss pricing, 
                        availability, or schedule a viewing.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Listed By Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Listed By
              </h4>
              {property.listed_by && (
                <ListedByCard 
                  agent={{
                    name: `${property.listed_by.first_name} ${property.listed_by.last_name}`,
                    company: property.listed_by.user_type === "AGENT" ? "Real Estate Agent" : 
                            property.listed_by.user_type === "LANDLORD" ? "Property Owner" : "Private Seller",
                    image: property.listed_by.profile?.profile_photo_url || "/assets/images/default-user.png",
                    rating: property.average_rating || 0,
                    userType: property.listed_by.user_type,
                    location: property.listed_by.profile ? 
                      `${property.listed_by.profile.state || ''}, ${property.listed_by.profile.country || 'Nigeria'}`.trim() : 
                      property.state ? `${property.state}, Nigeria` : "Nigeria",
                    verified: property.listed_by.is_email_verified
                  }} 
                />
              )}
            </div>

            {/* Property Verification */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              
              <PropertyVerifications propertyId={property.id} />
            </div>
          </div>
        </div>

        {/* Reviews and Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
              Property Reviews
            </h2>
            <RenterReviews property={property} />
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
             Share your feedback            </h2>
            <CommentBox propertyId={property?.id} />
          </div>
        </div>

        {/* Similar Properties Section */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                  Similar Properties You May Like
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Explore more amazing properties in {property.city}, {property.state}
              </p>
            </div>

            {property.related_properties && property.related_properties.length > 0 ? (
              <div className="space-y-6">
                {/* Mobile Swiper */}
                <div className="block md:hidden">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    pagination={{ 
                      clickable: true,
                      bulletClass: 'swiper-pagination-bullet',
                      bulletActiveClass: 'swiper-pagination-bullet-active'
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="pb-12"
                  >
                    {property.related_properties.map((listing) => (
                      <SwiperSlide key={listing.id}>
                        <ListingCard
                          id={listing.id}
                          title={listing.property_name}
                          price={listing.listing_type === 'SALE' 
                            ? `₦${parseFloat(listing.sale_price).toLocaleString()}` 
                            : `₦${parseFloat(listing.rent_price).toLocaleString()}${listing.rent_frequency ? ` / ${listing.rent_frequency_display}` : ''}`
                          }
                          description={listing.description || `${listing.bedrooms} bedroom ${listing.property_type_display.toLowerCase()} in ${listing.city}, ${listing.state}`}
                          image={listing.thumbnail}
                          type={listing.listing_type.toLowerCase()}
                          location={`${listing.city}, ${listing.state}`}
                          propertyType={listing.property_type_display}
                          bedrooms={listing.bedrooms}
                          bathrooms={listing.bathrooms}
                          status={listing.property_status_display}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.related_properties.slice(0, 6).map((listing) => (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.property_name}
                      price={listing.listing_type === 'SALE' 
                        ? `₦${parseFloat(listing.sale_price).toLocaleString()}` 
                        : `₦${parseFloat(listing.rent_price).toLocaleString()}${listing.rent_frequency ? ` / ${listing.rent_frequency_display}` : ''}`
                      }
                      description={listing.description || `${listing.bedrooms} bedroom ${listing.property_type_display.toLowerCase()} in ${listing.city}, ${listing.state}`}
                      image={listing.thumbnail}
                      type={listing.listing_type.toLowerCase()}
                      location={`${listing.city}, ${listing.state}`}
                      propertyType={listing.property_type_display}
                      bedrooms={listing.bedrooms}
                      bathrooms={listing.bathrooms}
                      status={listing.property_status_display}
                    />
                  ))}
                </div>

                {/* View More Button */}
                {property.related_properties.length > 6 && (
                  <div className="text-center mt-8">
                    <Button 
                      label={`View ${property.related_properties.length - 6} More Properties`}
                      variant="outline"
                      className="px-8 py-3"
                      onClick={() => router.push(`/search?location=${encodeURIComponent(property.city + ', ' + property.state)}`)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-4">No similar properties found in this area.</p>
                <Button 
                  label="Browse All Properties"
                  variant="primary"
                  onClick={() => router.push('/search')}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PropertyDetails;