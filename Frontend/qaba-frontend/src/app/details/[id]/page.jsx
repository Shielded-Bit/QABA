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

const similarListings = [
  { id: 11, title: 'Elegant Villa in Abakaliki', price: '₦120,000,000', type: 'buy', location: 'Ebonyi', city: 'Abakaliki' },
  { id: 12, title: 'Contemporary Apartment in Afikpo', price: '₦90,000,000', type: 'buy', location: 'Ebonyi', city: 'Afikpo' },
  { id: 13, title: 'Luxury Bungalow in Onueke', price: '₦80,000,000', type: 'buy', location: 'Ebonyi', city: 'Onueke' },
];

const PropertyDetails = ({ params }) => {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [similarProperties, setSimilarProperties] = useState(similarListings);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${unwrappedParams.id}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const rawData = await response.json();
        const data = rawData.property || rawData.data || rawData;
        
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Title and Location */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
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
            <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors" onClick={handlePrev}>←</button>
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
            <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors" onClick={handleNext}>→</button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Quick Info Grid */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
                <div>
                  <p className="text-gray-500">{propertyType === "Buy" ? "Total Price" : `${property.rent_frequency_display || 'Monthly'} Rent`}</p>
                  <p className="text-black font-bold mt-1">₦ {parseFloat(totalPrice).toLocaleString()} {priceFrequency}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bedrooms</p>
                  <p className="text-black font-bold mt-1">{property.bedrooms || 'N/A'} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bathroom</p>
                  <p className="text-black font-bold mt-1">{property.bathrooms || 'N/A'} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Square Feet</p>
                  <p className="text-black font-bold mt-1">
                    {property.area_sqft ? 
                      (typeof property.area_sqft === 'object' ? 
                        `${property.area_sqft.min} - ${property.area_sqft.max}` : 
                        property.area_sqft) : 
                      'N/A'} sq ft
                  </p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <PriceBreakdown property={property} />

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb used-8">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Home Description
              </h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Key Features */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                  Key Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className="text-2xl">{amenity.icon || ''}</span>
                      <span className="text-gray-800 font-medium">
                        {typeof amenity === 'string' ? amenity : amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Listed By Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h4 className="font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Listed By:
              </h4>
              {property.agent ? (
                <ListedByCard agent={property.agent} />
              ) : property.listed_by ? (
                <ListedByCard 
                  agent={{
                    name: `${property.listed_by.first_name} ${property.listed_by.last_name}`,
                    company: property.listed_by.user_type === "AGENT" ? "Real Estate Agent" : "Property Owner",
                    image: property.listed_by.agentprofile?.profile_photo_url || "/assets/images/default-user.png",
                    rating: 4,
                    email: property.listed_by.email,
                    phone: property.listed_by.phone_number,
                    location: property.listed_by.agentprofile ? 
                      `${property.listed_by.agentprofile.city || ''}, ${property.listed_by.agentprofile.state || ''}`.trim() : 
                      "Nigeria"
                  }} 
                />
              ) : null}
            </div>

            {/* Property Verification */}
            <PropertyVerifications propertyId={property.id} />
          </div>

          {/* Right Column */}
          <div>
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                Location
              </h2>
              
              {property.location ? (
                <GoogleMap 
                  address={property.location} 
                  apiKey={"AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"} 
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p>Address information not available</p>
                </div>
              )}
            </div>

            {/* Property Video */}
            {hasVideo && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
                  Property Video
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

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="space-y-4">
                {paymentSuccess ? (
                  <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Payment successful! Thank you for your purchase.
                  </div>
                ) : (
                  <>
                    <PaymentButton 
                      propertyId={property.id} 
                      propertyType={property.listing_type}
                      price={property.total_price || property.listing_type === "SALE" ? property.sale_price : property.rent_price}
                    />
                    <div className="space-y-4">
                      <Button 
                        label="Schedule a visit to view property" 
                        variant="primary" 
                        className="w-full"
                        onClick={() => setShowScheduleModal(true)}
                      />
                      <Button 
                        label="Contact us for enquiries" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowEnquiryModal(true)}
                      />
                      <p className="text-sm text-gray-500 text-center">
                        Not ready to make a payment? Contact the agent directly to discuss pricing, 
                        availability, or any other questions you may have about this property.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <RenterReviews property={property} />
          </div>
        </section>

        {/* Comment Section */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <CommentBox propertyId={property?.id} />
          </div>
        </section>

        {/* Similar Properties */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-light mb-6 sm:text-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Similar homes</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">you may like</span>
            </h2>
            <p className="text-gray-600 mb-6">Explore available properties in these vibrant cities across Ebonyi State.</p>

            <div className="block md:hidden">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="pb-10"
              >
                {similarProperties.map((listing) => (
                  <SwiperSlide key={listing.id}>
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      description={listing.description || 'Beautiful home description'}
                      image="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png"
                      type={listing.type}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  description={listing.description || 'Beautiful home description'}
                  image="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png"
                  type={listing.type}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PropertyDetails;