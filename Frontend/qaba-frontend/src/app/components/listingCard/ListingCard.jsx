'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../shared/Button';

const ListingCard = ({ id, title, price, description, image, type }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/details/${id}`);
  };

  return (
    <div
      className="max-w-md bg-white rounded-lg  overflow-hidden "
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative p-4 ">
        <Image
          className="w-full rounded-lg object-cover"
          src={image}
          alt={title}
          width={400}
          height={250} // Increased height for a better layout
        />
        {/* Type Badge */}
        <span
          className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            type === 'rent' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {type === 'rent' ? 'Rent' : 'Buy'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="font-semibold text-lg flex items-center">
          {title}
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734106397/Vector_4_ec0tid.png"
            alt="Verified"
            width={20}
            height={20}
            className="ml-2"
          />
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-2">{description}</p>

        {/* Price */}
        <p className="text-gray-900 font-bold mt-3">{price}</p>

        {/* Features */}
        <div className="flex justify-between text-gray-500 text-sm mt-4">
          <span className="flex items-center">
            &#x1F3E1; Spacious Living Area
          </span>
          <span className="flex items-center">
            &#x1F373; Modern Kitchen
          </span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm mt-2">
          <span className="flex items-center">
            &#x1F3E0; Private Backyard
          </span>
          <span className="flex items-center">
            &#x1F4CC; Master Suite
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center items-center  ">
  <div className="p-14">
    <Button
      label="Learn More"
      onClick={handleCardClick}
      bgColor="white" // White background
      className="w-40 h-14 "
    />
  </div>
</div>



    </div>
  );
};

export default ListingCard;
