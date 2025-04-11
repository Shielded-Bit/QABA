'use client';
import { FaCar, FaShieldAlt, FaSwimmer, FaHome, FaTrafficLight } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import { BiSolidCctv } from "react-icons/bi";
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
import 'swiper/css';
import 'swiper/css/pagination';

const featureIcons = {
  "Car Park": <FaCar className="text-2xl text-blue-600" />,
  "House Security": <FaShieldAlt className="text-2xl text-blue-600" />,
  "CCTV Camera": <BiSolidCctv className="text-2xl text-blue-600" />,
  "Swimming Pool": <FaSwimmer className="text-2xl text-blue-600" />,
  "POP Ceiling": <FaHome className="text-2xl text-blue-600" />,
  "Security Door": <MdMeetingRoom className="text-2xl text-blue-600" />,
  "Big Compound": <FaHome className="text-2xl text-blue-600" />,
  "Traffic Light": <FaTrafficLight className="text-2xl text-blue-600" />,
  "Boys Quarters": <FaHome className="text-2xl text-blue-600" />,
};

// Example similar listings (should be fetched from API in production)
const similarListings = [
  { id: 11, title: 'Elegant Villa in Abakaliki', price: '₦120,000,000', type: 'buy', location: 'Ebonyi', city: 'Abakaliki' },
  { id: 12, title: 'Contemporary Apartment in Afikpo', price: '₦90,000,000', type: 'buy', location: 'Ebonyi', city: 'Afikpo' },
  { id: 13, title: 'Luxury Bungalow in Onueke', price: '₦80,000,000', type: 'buy', location: 'Ebonyi', city: 'Onueke' },
];

// Helper function to get icon based on amenity name
const getAmenityIcon = (amenity) => {
  const name = typeof amenity === 'string' ? amenity : amenity.name || '';
  
  if (name.toLowerCase().includes("car") || name.toLowerCase().includes("park")) {
    return <FaCar className="text-2xl text-blue-600" />;
  } else if (name.toLowerCase().includes("security") || name.toLowerCase().includes("secure")) {
    return <FaShieldAlt className="text-2xl text-blue-600" />;
  } else if (name.toLowerCase().includes("cctv") || name.toLowerCase().includes("camera")) {
    return <BiSolidCctv className="text-2xl text-blue-600" />;
  } else if (name.toLowerCase().includes("swim")) {
    return <FaSwimmer className="text-2xl text-blue-600" />;
  } else if (name.toLowerCase().includes("door")) {
    return <MdMeetingRoom className="text-2xl text-blue-600" />;
  } else if (name.toLowerCase().includes("compound")) {
    return <FaHome className="text-2xl text-blue-600" />;
  } else {
    return <FaHome className="text-2xl text-blue-600" />;
  }
};

const PropertyDetails = ({ params }) => {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [similarProperties, setSimilarProperties] = useState(similarListings);

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
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const rawData = await response.json();
        
        // Handle different response structures
        const data = rawData.property ? rawData.property : 
                     rawData.data ? rawData.data : 
                     rawData;
        
        setProperty(data);
        console.log('Property data:', data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError(err.message);
        
        // Fallback to mock data in case of error
        // This should be removed in production
        setProperty({
          property_name: "The Dream Family Home",
          description: "Step into luxury and comfort with Dream Homes, a stunning property designed to cater to your every need.",
          location: "555 W Madison St, Abakiliki, Ebonyi State.",
          rent_price: "700,000",
          sale_price: null,
          rent_frequency: "Yearly",
          listing_type: "RENT",
          bedrooms: 2,
          bathrooms: 2,
          area_sqft: "1,101",
          amenities: [
            "Car Park",
            "House Security",
            "CCTV Camera",
            "Swimming Pool",
            "POP Ceiling",
            "Security Door"
          ],
          images: [
            "https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png",
            "https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp",
            "https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png",
            "https://res.cloudinary.com/dqbbm0guw/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1737719216/housee4_hxpaex.jpg"
          ],
          rating: 4.0,
          rating_count: 80,
          agent: {
            name: "Chijioke Prince",
            company: "Homeland Real-estate",
            image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1738312518/jooj_bzdu1r.png",
            rating: 4
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetail();
  }, [unwrappedParams]);

  useEffect(() => {
    // Image auto-rotation
    if (!property?.images?.length) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < property.images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000); // Change image every 5 seconds
    
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

  const handleBack = () => {
    router.back(); // Go back to previous page
  };

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
        <button 
          onClick={handleBack}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-green-400 text-white rounded-md hover:opacity-90 transition-all duration-300"
        >
          Back
        </button>
      </div>
    );
  }

  // Create a fallback for images if none are available
  const images = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ["/api/placeholder/400/320"];

  // Determine if property is for rent or sale
  const propertyType = property.listing_type === "SALE" ? "Buy" : "Rent";
  const price = property.rent_price || property.sale_price || 'N/A';
  const priceFrequency = property.listing_type === "RENT" ? `/ ${property.rent_frequency || 'Month'}` : '';

  // Check if the property has a video
  const hasVideo = property.video && property.video.video_url;

  return (
    <div className="w-full mx-auto p-2 sm:p-4 bg-slate-50">
      {/* Header Section */}
      <div className="mb-4">
        <button 
          onClick={handleBack}
          className="mb-4 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {property.property_name} {property.listing_status === 'APPROVED' && <span className="text-blue-500">✔</span>}
        </h1>
        
        <p className="text-blue-500 text-lg">{property.location}</p>
        
        {/* Rating Section - Only show if available */}
        {property.rating && (
          <div className="flex items-center mt-2">
            <div className="flex text-blue-500">
              {/* Star Icons */}
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
        {/* Main Image */}
        <div className="w-full sm:w-1/2">
          <div className="relative h-60 sm:h-96">
            <Image
              className="rounded-lg"
              src={getImageUrl(images[currentImageIndex])}
              alt={`Property Image ${currentImageIndex + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority
              unoptimized={true} // Important for external images
            />
          </div>
        </div>

        {/* Secondary Image (if available) */}
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
        <button
          className="bg-gray-200 p-3 rounded-full hover:bg-gray-300"
          onClick={handlePrev}
        >
          ←
        </button>
        <div className="flex gap-2 items-center overflow-x-auto max-w-lg">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`border ${
                currentImageIndex === index ? 'ring-2 ring-blue-500 w-14 h-14' : 'w-10 h-10'
              } rounded-lg flex-shrink-0`}
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
        <button
          className="bg-gray-200 p-3 rounded-full hover:bg-gray-300"
          onClick={handleNext}
        >
          →
        </button>
      </div>

      {/* Property Details */}
      <section className="w-full mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Left Content Section */}
          <div className="w-full sm:w-1/2">
            {/* Property Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700 text-lg py-5">
              <div>
                <p className="text-gray-500">{propertyType === "Buy" ? "Sale Price" : `${property.rent_frequency || 'Monthly'} Rent`}</p>
                <p className="text-black font-bold mt-1">₦ {price} {priceFrequency}</p>
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

            {/* Home Description */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Home Description</h2>
              <p className="text-gray-600">
                {property.description}
              </p>
            </div>

            {/* Key Features Section */}
            {property.amenities && property.amenities.length > 0 && (
              <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getAmenityIcon(amenity)}
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
              <h4>Listed By <span>:</span></h4>
              {property.agent ? (
                <ListedByCard agent={property.agent} />
              ) : (
                <ListedByCard 
                  agent={{
                    name: "Chijioke Prince",
                    company: "Homeland Real-estate",
                    image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1738312518/jooj_bzdu1r.png",
                    rating: 4,
                  }} 
                />
              )}

              {/* Verified Property & CTA */}
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-4.03 2.39a.75.75 0 01-1.12-.79l.77-4.49-3.26-3.19a.75.75 0 01.41-1.28l4.51-.66 2.02-4.08a.75.75 0 011.34 0l2.02 4.08 4.51.66a.75.75 0 01.41 1.28l-3.26 3.19.77 4.49a.75.75 0 01-1.12.79L12 17.75z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Property is verified by us</h4>
                    <p className="text-sm text-gray-500">If reported as fake, we&apos;ll investigate to confirm if this listing isn&apos;t real.</p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:opacity-90">
                  Proceed for Payment
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-full sm:w-1/2">
            {/* Property Location Map */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Location</h2>
              {/* Map Integration - Using iframe if available or fallback */}
              {property.map_embed ? (
                <div dangerouslySetInnerHTML={{ __html: property.map_embed }} />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p>Map not available</p>
                </div>
              )}
              
              {/* Video Display if available */}
              {hasVideo && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Property Video</h3>
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
              
              {/* CTA Buttons */}
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
            Similar homes
          </span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
            you may like
          </span>
        </h2>
        <p className="text-gray-600 mb-6">
          Explore available properties in these vibrant cities across Ebonyi State.
        </p>

        {/* Mobile View: Swiper Slider */}
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

        {/* Desktop View: Grid Layout */}
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