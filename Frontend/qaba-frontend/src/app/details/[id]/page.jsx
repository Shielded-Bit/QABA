import { use } from 'react';
import Image from 'next/image';

const PropertyDetails = ({ params }) => {
  const resolvedParams = use(params); // Resolve the params Promise
  const { id } = resolvedParams; // Now safely access id

  const property = {
    1: {
      title: 'The Dream Family Home',
      price: '₦700,000 / Year',
      description: 'Details about this home...',
      image: '/images/image1.jpg',
      type: 'rent',
    },
    2: {
      title: 'The Dream Family Home',
      price: '₦2,000,000 / Year',
      description: 'Details about this home...',
      image: '/images/image2.jpg',
      type: 'rent',
    },
    3: {
      title: 'The Dream Family Home',
      price: '₦20,000,000',
      description: 'Details about this home...',
      image: '/images/image3.jpg',
      type: 'buy',
    },
  }[Number(id)]; // Convert id to a number for lookup

  if (!property) {
    return <p>Property not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Image
        className="w-full rounded-lg mb-8"
        src={property.image}
        alt={property.title}
        width={800}
        height={500}
        layout="responsive"
        priority
      />
      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      <p className="text-xl text-green-500 font-semibold mb-4">{property.price}</p>
      <p className="text-gray-700 text-lg">{property.description}</p>
    </div>
  );
};

export default PropertyDetails;
