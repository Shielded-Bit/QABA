import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";

const ListedByCard = ({ agent }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-fit group">
      {/* Agent Profile Picture */}
      <div className="w-14 h-14 rounded-xl overflow-hidden relative ring-3 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300">
        <Image
          src={agent.image}
          alt={agent.name}
          layout="fill"
          objectFit="cover"
          className="rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Agent Details */}
      <div>
        <p className="text-gray-900 font-bold text-lg flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
          {agent.name} 
          <FaCheckCircle className="text-blue-500 text-sm" />
        </p>
        <p className="text-gray-600 text-sm font-medium mb-2">{agent.company}</p>

        {/* Star Ratings */}
        <div className="flex text-amber-400">
          {Array.from({ length: agent.rating }, (_, i) => (
            <FaStar key={i} className="text-base drop-shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListedByCard;