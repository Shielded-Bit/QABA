import Image from "next/image";
import { FaCheckCircle, FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaRegStar } from "react-icons/fa";

const ListedByCard = ({ agent }) => {
  // Calculate filled and empty stars
  const filledStars = Math.floor(agent.rating);
  const emptyStars = 5 - filledStars;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 w-full">
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-xl overflow-hidden relative ring-2 ring-gray-100">
          <Image
            src={agent.image}
            alt={agent.name}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>

        {/* Main Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 font-bold text-lg">{agent.name}</h3>
            {agent.verified && (
              <FaCheckCircle className="text-blue-500 text-sm" title="Verified User" />
            )}
          </div>
          
          <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
            {agent.company}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {agent.userType}
            </span>
          </p>

          {/* Location */}
          {agent.location && (
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-400" />
              {agent.location}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      {/* Commented out contact information for privacy
      <div className="mt-4 space-y-2 border-t pt-4">
        <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaPhoneAlt className="text-gray-400" />
          <span className="text-sm">{agent.phone}</span>
        </a>
        <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaEnvelope className="text-gray-400" />
          <span className="text-sm">{agent.email}</span>
        </a>
      </div>
      */}

     
    </div>
  );
};

export default ListedByCard;