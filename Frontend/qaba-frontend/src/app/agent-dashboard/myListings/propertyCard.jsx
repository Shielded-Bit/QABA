import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PropertyCard = ({ house }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-11/12 sm:w-full max-w-xs shrink-0">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={house.image} alt={house.name} layout="fill" objectFit="cover" />
                <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded text-white ${
                        house.type === "Buy" ? "bg-blue-600" : "bg-green-600"
                    }`}
                >
                    {house.type}
                </span>
            </div>
            <div className="mt-3">
                <h3 className="font-semibold text-lg">{house.name}</h3>
                <p className="text-sm text-gray-500">{house.description}</p>
                <p className="font-bold mt-2 text-gray-900">₦{house.amount}</p>
            </div>
        </div>
    );
};

const PropertySection = ({ title, properties, className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // For larger screens

  const handlePageChange = (newPage) => {
      const totalPages = Math.ceil(properties.length / itemsPerPage);
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  const displayedProperties = properties.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
      <div className="mb-12">
          <h2 className={`text-gray-600 mb-6 ${className}`}>{title}</h2> {/* Apply the className here */}
          {/* Scrollable container for mobile */}
          <div className="flex overflow-x-scroll snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedProperties.map((house, index) => (
                  <PropertyCard key={index} house={house} />
              ))}
          </div>
          <div className="flex justify-center items-center mt-6 space-x-3">
              <button
                  className="p-3 bg-gray-300 rounded-full disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
              >
                  <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex space-x-2">
                  {[...Array(Math.ceil(properties.length / itemsPerPage))].map((_, index) => (
                      <button
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                              currentPage === index + 1 ? "bg-gray-800" : "bg-gray-300"
                          }`}
                          onClick={() => handlePageChange(index + 1)}
                      />
                  ))}
              </div>
              <button
                  className="p-3 bg-gray-300 rounded-full disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(properties.length / itemsPerPage)}
              >
                  <ChevronRight className="w-6 h-6" />
              </button>
          </div>
      </div>
  );
};


export default function OurWork() {
  const houses = [
      { name: "Elegant Manor", description: "A grand estate with timeless architecture.", amount: "850,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy", status: "Pending" },
      { name: "Cozy Loft", description: "A modern loft in a prime location.", amount: "750,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent", status: "Pending" },
      { name: "Charming Townhouse", description: "Cozy townhouse with a modern touch.", amount: "600,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741831327/ecd596d29e88c7613beedd309d7cc38a_zefo6z.jpg", type: "Rent", status: "Published" },
      { name: "Luxury Villa", description: "A stunning villa with premium amenities.", amount: "1,200,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy", status: "Published" },
      { name: "Opulent Retreat", description: "A luxurious retreat with breathtaking views.", amount: "1,350,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy", status: "Pending" },
      { name: "Sleek Studio", description: "A stylish studio apartment in the city.", amount: "470,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent", status: "Pending" },
      { name: "Coastal Retreat", description: "A serene getaway by the ocean.", amount: "700,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy", status: "Published" },
      { name: "Sleek Studio", description: "A stylish studio apartment in the city.", amount: "470,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent", status: "Pending" },
      { name: "Coastal Retreat", description: "A serene getaway by the ocean.", amount: "700,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy", status: "Published" },
      { name: "Downtown Condo", description: "Modern condo in the heart of downtown.", amount: "540,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent", status: "Published" }
  ];

  const pendingProperties = houses.filter(house => house.status === "Pending");
  const publishedProperties = houses.filter(house => house.status === "Published");

  return (
      <div className="w-full mx-auto px-6 md:px-12 xl:px-6 bg-gray-100 py-12 pl-14">
          <PropertySection 
              title="Pending Listed Properties" 
              properties={pendingProperties} 
              className="text-sm md:text-3xl" 
          />
          <PropertySection 
              title="Published Listed Properties" 
              properties={publishedProperties} 
              className="text-sm md:text-3xl" 
          />
      </div>
  );
}
