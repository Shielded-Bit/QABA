import { useRouter } from 'next/router';
import Image from 'next/image';

const PropertyDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const property = {
    1: {
      title: 'The Dream Family Home',
      price: '₦700,000 / Year',
      description: 'Details about this home...',
      image: '/path-to-image1.jpg',
      type: 'rent',
    },
    2: {
      title: 'The Dream Family Home',
      price: '₦2,000,000 / Year',
      description: 'Details about this home...',
      image: '/path-to-image2.jpg',
      type: 'rent',
    },
    3: {
      title: 'The Dream Family Home',
      price: '₦20,000,000',
      description: 'Details about this home...',
      image: '/path-to-image3.jpg',
      type: 'buy',
    },
  }[id];

  if (!property) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Replace <img> with <Image /> */}
      <Image
        className="w-full rounded-lg mb-8"
        src={property.image}
        alt={property.title}
        width={800} // Specify the image width
        height={500} // Specify the image height
        layout="responsive" // Makes the image responsive
        priority // Ensures the image loads quickly
      />
      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      <p className="text-xl text-green-500 font-semibold mb-4">{property.price}</p>
      <p className="text-gray-700 text-lg">{property.description}</p>
    </div>
  );
};

export default PropertyDetails;
