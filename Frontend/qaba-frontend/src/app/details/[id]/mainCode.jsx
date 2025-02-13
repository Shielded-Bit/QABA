'use client';
import { FaCar, FaShieldAlt, FaSwimmer, FaHome, FaTrafficLight } from 'react-icons/fa';
import { MdSecurity, MdMeetingRoom } from 'react-icons/md';
import { BiSolidCctv } from "react-icons/bi";
import { IoIosExpand } from 'react-icons/io';
import Button from '@/app/components/shared/Button';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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
          description: 'Details about this home...',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1737719216/housee4_hxpaex.jpg',
          ],
          type: 'rent',
        },
        2: {
          title: 'The Dream Family Home',
          price: '₦2,000,000 / Year',
          description: 'Details about this home...',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
          ],
          type: 'rent',
        },
        3: {
          title: 'The Dream Family Home',
          price: '₦20,000,000',
          description: 'Details about this home...',
          image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
          extraImages: [
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
            'https://res.cloudinary.com/dqbbm0guw/image/upload/v1737719217/houses5_yfrk9y.webp',
          ],
          type: 'buy',
        },
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
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        {property.title} <span className="text-blue-500">✔</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
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
      <section className="max-w-6xl mx-auto p-4 sm:p-8">
  <div className="flex flex-col sm:flex-row gap-8">
    {/* Left Content Section */}
    <div className="w-full sm:w-1/2">
      {/* Property Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-gray-700 text-lg font-semibold mb-6">
        <div>
          <p className="text-gray-500">Yearly Rent</p>
          <p className="text-black text-ml font-bold">₦ 700,000</p>
        </div>
        <div>
          <p className="text-gray-500">Bedrooms</p>
          <p className="text-black text-ml font-bold">2 Bedroom</p>
        </div>
        <div>
          <p className="text-gray-500">Bathroom</p>
          <p className="text-black text-ml font-bold">2 Bathrooms</p>
        </div>
        <div>
          <p className="text-gray-500">Square Feet</p>
          <p className="text-black text-ml font-bold">471 - 1,101 sq ft</p>
        </div>
      </div>

      {/* Home Description */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Home Description</h2>
        <p className="text-gray-600">
          Step into luxury and comfort with Dream Homes, a stunning property designed to cater to your every need. 
          Located in a serene and highly sought-after neighborhood, this home offers modern amenities, 
          spacious interiors, and exquisite finishes.
        </p>
      </div>

      {/* Key Features */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Key Features</h2>

      {/* Gradient Definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(1, 77, 152, 1)" />
            <stop offset="100%" stopColor="rgba(57, 181, 177, 1)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
  <div className="flex items-center gap-3">
    <FaCar style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Car Park</span>
  </div>
  <div className="flex items-center gap-3">
    <FaShieldAlt style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>House Security</span>
  </div>
  <div className="flex items-center gap-3">
    <BiSolidCctv style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>CCTV Camera</span>
  </div>
  <div className="flex items-center gap-3">
    <IoIosExpand style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>POP Ceiling</span>
  </div>
  <div className="flex items-center gap-3">
    <FaSwimmer style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Swimming Pool</span>
  </div>
  <div className="flex items-center gap-3">
    <MdSecurity style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Security Door</span>
  </div>
  <div className="flex items-center gap-3">
    <FaHome style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Big Compound</span>
  </div>
  <div className="flex items-center gap-3">
    <FaTrafficLight style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Traffic Light</span>
  </div>
  <div className="flex items-center gap-3">
    <MdMeetingRoom style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
    <span>Boys Quarters</span>
  </div>
</div>


      {/* CTA Buttons */}
      <div className="flex gap-4 mt-6">
        <Button label="Request for a Tour" variant="primary" />
        <Button label="Contact Us" variant="outline" />
      </div>
    </div>

    {/* Right Map Section */}
    <div className="w-full sm:w-1/2">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Location</h2>
      <p className="text-gray-600 mb-4">
        Our property is situated in a prime area, offering excellent access to key amenities, security, and comfort.
      </p>
      <iframe
        className="w-full h-96 rounded-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157.123456789!2d8.1234567!3d6.7890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x123456789abcdef!2sDream+Family+Home!5e0!3m2!1sen!2sus!4v1614101234567"
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  </div>
</section>
    </div>
  );
};

export default PropertyDetails;
