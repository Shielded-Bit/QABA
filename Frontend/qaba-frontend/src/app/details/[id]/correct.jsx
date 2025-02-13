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
          features: ['Car Park', 'House Security', 'CCTV Camera', 'Swimming Pool', 'Gym', 'Garden'],
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
          features: ['Elevator', 'Gym', 'Security', 'Parking', 'Close to Public Transport'],
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

      {/* Property Details */}
      <section className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Left Content Section */}
          <div className="w-full sm:w-1/2">
            {/* Property Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-gray-700 text-lg font-semibold mb-6">
              <div>
                <p className="text-gray-500">Yearly Rent</p>
                <p className="text-black text-ml font-bold">{property.price}</p>
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
                {property.description}
              </p>
            </div>

            {/* Key Features */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Key Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FaCar style={{ fill: "url(#iconGradient)" }} className="text-2xl" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-6 mt-6">
              <Button text="Contact Agent" />
              <Button text="View More Properties" />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-full sm:w-1/2">
            {/* Property Location */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Location</h2>
              <div dangerouslySetInnerHTML={{ __html: property.address }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
