import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";

const ListedByCard = ({ agent }) => {
  return (
    <div className="border rounded-lg p-4 flex items-center gap-4 shadow-sm w-fit">
      {/* Agent Profile Picture */}
      <div className="w-12 h-12 rounded-full overflow-hidden relative">
        <Image
          src={agent.image}
          alt={agent.name}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>

      {/* Agent Details */}
      <div>
        <p className="text-gray-800 font-semibold flex items-center gap-1">
          {agent.name} <FaCheckCircle className="text-blue-500 text-sm" />
        </p>
        <p className="text-gray-500 text-sm">{agent.company}</p>

        {/* Star Ratings */}
        <div className="flex text-blue-500 mt-1">
          {Array.from({ length: agent.rating }, (_, i) => (
            <FaStar key={i} className="text-sm" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListedByCard;
