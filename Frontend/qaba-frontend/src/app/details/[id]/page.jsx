'use client';
import { FaCar, FaShieldAlt, FaSwimmer, FaHome, FaTrafficLight } from 'react-icons/fa';
import { MdSecurity, MdMeetingRoom } from 'react-icons/md';

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
import 'swiper/css';
import 'swiper/css/pagination';


const featureIcons = {
  "Car Park": <FaCar className="text-2xl text-blue-600" />,
  "House Security": <FaShieldAlt className="text-2xl text-blue-600" />,
  "CCTV Camera": <BiSolidCctv className="text-2xl text-blue-600" />,
  "Swimming Pool": <FaSwimmer className="text-2xl text-blue-600" />,
  "POP Ceiling": <FaHome className="text-2xl text-blue-600" />, // You can change this icon based on your design
  "Security Door": <MdMeetingRoom className="text-2xl text-blue-600" />,
  "Big Compound": <FaHome className="text-2xl text-blue-600" />,
  "Traffic Light": <FaTrafficLight className="text-2xl text-blue-600" />,
  "Boys Quarters": <FaHome className="text-2xl text-blue-600" />,
};
const ebonyiListings = [
  { id: 11, title: 'Elegant Villa in Abakaliki', price: '₦120,000,000', type: 'buy', location: 'Ebonyi', city: 'Abakaliki' },
  { id: 12, title: 'Contemporary Apartment in Afikpo', price: '₦90,000,000', type: 'buy', location: 'Ebonyi', city: 'Afikpo' },
  { id: 13, title: 'Luxury Bungalow in Onueke', price: '₦80,000,000', type: 'buy', location: 'Ebonyi', city: 'Onueke' },
];

const PropertyDetails = ({ params }) => {
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      const id = unwrappedParams.id; // Access unwrapped id from params
      const selectedProperty = {
        1: {
          title: 'The Dream Family Home',
          price: '₦700,000 / Year',
          description: 'Step into luxury and comfort with Dream Homes, a stunning property designed to cater to your every need. This property features spacious rooms, modern finishes, and a prime location that offers convenience and security for your family. With a large backyard and premium amenities, it’s the perfect place to call home.',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1737719216/housee4_hxpaex.jpg',
          ],
          type: 'rent',
          features: ['Car Park', 'House Security', 'CCTV Camera', 'Swimming Pool', 'POP Ceiling', 'Security Door'],
          address: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234567890123456!2d-73.123456!3d40.123456" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>',
        },
        2: {
          title: 'Modern Luxury Villa',
          price: '₦1,500,000 / Year',
          description: 'Experience the epitome of modern living with this stunning luxury villa. With its open-concept design, state-of-the-art kitchen, and spacious living areas, this villa offers the perfect blend of comfort and elegance. The villa is located in a serene neighborhood with breathtaking views, perfect for those seeking tranquility without sacrificing style.',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1737719216/housee4_hxpaex.jpg',
          ],
          type: 'rent',
          features: ['Car Park', 'House Security', 'CCTV Camera', 'Swimming Pool', 'POP Ceiling', 'Security Door'],
          address: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234567890123456!2d-73.123456!3d40.123456" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>',
        },
        3: {
          title: 'Cozy Urban Apartment',
          price: '₦500,000 / Year',
          description: 'This cozy urban apartment is perfect for young professionals or small families. With modern finishes and a prime location in the heart of the city, this apartment offers convenience and comfort. The open floor plan and large windows provide a bright and airy living space, while the nearby amenities ensure you’re always close to everything you need.',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1737719216/housee4_hxpaex.jpg',
          ],
          type: 'rent',
          features: ['Car Park', 'House Security', 'CCTV Camera', 'Swimming Pool', 'POP Ceiling', 'Security Door'],
          address: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234567890123456!2d-73.123456!3d40.123456" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>',
        },
        // Add more properties here...
      }[Number(id)];
      

      setProperty(selectedProperty);
    }
  }, [unwrappedParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < property.extraImages.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [property]);

  if (!unwrappedParams || !property) {
    return <p>Loading...</p>;
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < property.extraImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : property.extraImages.length - 1
    );
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4 bg-slate-50">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        {property.title} <span className="text-blue-500">✔</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 p-2 sm:p-8">
        {/* Main Image */}
        <div className="w-full sm:w-1/2">
          <div className="relative h-60 sm:h-96">
            <Image
              className="rounded-lg"
              src={property.extraImages[currentImageIndex]}
              alt={`Property Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>

        {/* Secondary Image */}
        <div className="hidden sm:block w-full sm:w-1/2"> {/* Hide on small screens */}
          <div className="relative h-60 sm:h-96">
            <Image
              className="rounded-lg"
              src={property.image}
              alt="Main property image"
              layout="fill"
              objectFit="cover"
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
        <div className="flex gap-2 items-center">
          {property.extraImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`border overflow-hidden ${
                currentImageIndex === index ? 'w-14 h-14' : 'w-10 h-10'
              } rounded-lg`} // Change size based on current image index
            >
              <div className="relative w-full h-full">
                <Image
                  className="rounded-lg"
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
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
           {/* Property Name, Address, and Rating */}
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-black">The Dream Family Home</h1>
        <p className="text-blue-500 text-lg">555 W Madison St, Abakiliki, Ebonyi State.</p>
        <div className="flex items-center mt-2">
          <div className="flex text-blue-500">
            {/* Star Icons (Using Unicode Stars or Replace with Icons) */}
            <span>&#9733;&#9733;&#9733;&#9733;&#9734;</span>
          </div>
          <span className="ml-2 text-gray-700 text-lg">4.0 (80 Ratings)</span>
        </div>
      </div>
        {/* Property Details */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700 text-lg py-5">
  <div>
    <p className="text-gray-500">Yearly Rent</p>
    <p className="text-black font-bold mt-1">₦ 700,000</p>
  </div>
  <div>
    <p className="text-gray-500">Bedrooms</p>
    <p className="text-black font-bold mt-1">2 Bedroom</p>
  </div>
  <div>
    <p className="text-gray-500">Bathroom</p>
    <p className="text-black font-bold mt-1">2 Bathrooms</p>
  </div>
  <div>
    <p className="text-gray-500">Square Feet</p>
    <p className="text-black font-bold mt-1">1,101 q ft</p>
  </div>
</div>


            {/* Home Description */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Home Description</h2>
              <p className="text-gray-600">
                {property.description}
              </p>
            </div>

            
             {/* Key Features */}
             <section className="mt-8">
  <h2 className="text-2xl font-bold mb-4">Key Features</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
    {property.features.map((feature, index) => (
      <div key={index} className="flex items-center gap-3">
        {featureIcons[feature] || <FaCar className="text-3xl text-gray-500" />}
        <span className="text-gray-800 font-medium">{feature}</span>
      </div>
    ))}
  </div>
</section>
<div className="mt-24">
  <h4>
    Listed By <span>:</span>
  </h4>
  <ListedByCard 
    agent={{
      name: "Chijioke Prince",
      company: "Homeland Real-estate",
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1738312518/jooj_bzdu1r.png",
      rating: 4,
    }} 
  />

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
            {/* Property Location */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Location</h2>
              <div dangerouslySetInnerHTML={{ __html: property.address }} />
              {/* CTA Buttons */}
              <div className="flex gap-4 mt-6">
              <Button label="Request for a Tour" variant="primary" />
              <Button label="Contact Us" variant="outline" />
              </div>

            </div>
          </div>
        </div>
      </section>


      {/*nrental review */}
       <div className="w-full mx-auto p-4 sm:p-8">
    
    <RenterReviews />
  </div>
  <div className='w-full p-4 sm:p-8'>
      <CommentBox />
    </div>
    {/* Other Cities Section */}
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
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1} // Single card on mobile
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {ebonyiListings.map((listing) => (
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
        {ebonyiListings.map((listing) => (
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
