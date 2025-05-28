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
import PaymentVerifier from '@/app/components/PaymentVerifier';
import 'swiper/css';
import 'swiper/css/pagination';
import PropertyVerifications from '@/app/components/PropertyVerifications';

const similarListings = [
  { id: 11, title: 'Elegant Villa in Abakaliki', price: '₦120,000,000', type: 'buy', location: 'Ebonyi', city: 'Abakaliki' },
  { id: 12, title: 'Contemporary Apartment in Afikpo', price: '₦90,000,000', type: 'buy', location: 'Ebonyi', city: 'Afikpo' },
  { id: 13, title: 'Luxury Bungalow in Onueke', price: '₦80,000,000', type: 'buy', location: 'Ebonyi', city: 'Onueke' },
];

// Price Breakdown Component
const PriceBreakdown = ({ property }) => {
  const basePrice = property.rent_price || property.sale_price;
  const agentCommission = property.agent_commission;
  const qabaFee = property.qaba_fee;
  const totalPrice = property.total_price;
  const isRent = property.listing_type === "RENT";
  const frequency = property.rent_frequency_display || 'Monthly';

  if (!basePrice) return null;

  const formatPrice = (price) => {
    return price ? parseFloat(price).toLocaleString() : '0';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            {isRent ? `${frequency} Rent` : 'Sale Price'}
          </span>
          <span className="font-medium">₦{formatPrice(basePrice)}</span>
        </div>
        
        {agentCommission && parseFloat(agentCommission) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Agent Commission</span>
            <span className="font-medium">₦{formatPrice(agentCommission)}</span>
          </div>
        )}
        
        {qabaFee && parseFloat(qabaFee) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Qaba Service Fee</span>
            <span className="font-medium">₦{formatPrice(qabaFee)}</span>
          </div>
        )}
        
        <hr className="my-2" />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span className="text-blue-600">
            ₦{formatPrice(totalPrice || basePrice)}
            {isRent && ` / ${frequency}`}
          </span>
        </div>
      </div>
      
      {(agentCommission || qabaFee) && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Additional fees may apply for processing and verification services.
          </span>
        </div>
      )}
    </div>
  );
};

const PropertyDetails = ({ params }) => {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [similarProperties, setSimilarProperties] = useState(similarListings);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/${unwrappedParams.id}/`, {
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
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
      <div className="flex flex-col justify-center items-center h-screen">
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
    <div className="w-full mx-auto p-2 sm:p-4 bg-slate-50">
      <PaymentVerifier 
        onSuccess={handlePaymentSuccess}
        onError={(message) => console.error("Payment verification error:", message)}
      />

      {/* Header Section */}
      <div className="mb-4 px-2 sm:px-7">
        <button onClick={handleBack} className="mb-4 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
          <span>←</span> Back
        </button>
        
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

      {/* Images Display Section */}
      <div className="flex flex-col sm:flex-row gap-6 p-2 sm:p-8">
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

      {/* Thumbnails and Navigation */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300" onClick={handlePrev}>←</button>
        <div className="flex gap-2 items-center overflow-x-auto max-w-lg">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`border ${currentImageIndex === index ? 'ring-2 ring-blue-500 w-14 h-14' : 'w-10 h-10'} rounded-lg flex-shrink-0`}
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
        <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300" onClick={handleNext}>→</button>
      </div>

      {/* Property Details */}
      <section className="w-full mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Left Content Section */}
          <div className="w-full sm:w-1/2">
            {/* Property Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700 text-lg py-5">
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

            {/* Price Breakdown Component */}
            <PriceBreakdown property={property} />

            {/* Home Description */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Home Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>

            {/* Key Features Section */}
            {property.amenities?.length > 0 && (
              <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-2xl">{amenity.icon || ''}</span>
                      <span className="text-gray-800 font-medium">
                        {typeof amenity === 'string' ? amenity : amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Listed By Section */}
            <div className="mt-24">
              <h4 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Listed By:</h4>
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

              {/* Verified Property & CTA */}
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-4.03 2.39a.75.75 0 01-1.12-.79l.77-4.49-3.26-3.19a.75.75 0 01.41-1.28l4.51-.66 2.02-4.08a.75.75 0 011.34 0l2.02 4.08 4.51.66a.75.75 0 01.41 1.28l-3.26 3.19.77 4.49a.75.75 0 01-1.12.79L12 17.75z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Property is verified by us</h4>
                  </div>
                </div>
                
                <div className="mt-4">
                  {paymentSuccess ? (
                    <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Payment successful! Thank you for your purchase.
                    </div>
                  ) : (
                    <PaymentButton 
                      propertyId={property.id} 
                      propertyType={property.listing_type}
                      price={property.total_price || property.listing_type === "SALE" ? property.sale_price : property.rent_price}
                    />
                  )}
                </div>
              </div>

              <PropertyVerifications propertyId={property.id} />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-full sm:w-1/2">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Location</h2>
              
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
              
              {hasVideo && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Property Video</h3>
                  <div className="w-full h-64 relative rounded-lg overflow-hidden">
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
              
              <div className="flex gap-4 mt-6">
                <Button label="Request for a Tour" variant="primary" />
                <Button label="Contact Us" variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <div className="w-full mx-auto p-4 sm:p-8">
        <RenterReviews property={property} />
      </div>
      
      {/* Comment Box */}
      <div className='w-full p-4 sm:p-8'>
        <CommentBox property={property} />
      </div>
      
      {/* Similar Properties Section */}
      <div className="p-4 sm:p-8 py-7">
        <h2 className="text-xl font-light mb-4 md:mb-6 sm:text-3xl">
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
    </div>
  );
};

export default PropertyDetails;