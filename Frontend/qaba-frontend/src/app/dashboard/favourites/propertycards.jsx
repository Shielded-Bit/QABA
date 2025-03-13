import { useState } from "react";
import Image from "next/image";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;
const ITEMS_PER_PAGE_MOBILE = 4;

const houses = [
    { name: "Elegant Manor", description: "A grand estate with timeless architecture.", amount: "850,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Charming Townhouse", description: "Cozy townhouse with a modern touch.", amount: "600,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741831327/ecd596d29e88c7613beedd309d7cc38a_zefo6z.jpg", type: "Rent" },
    { name: "Opulent Retreat", description: "A luxurious retreat with breathtaking views.", amount: "1,350,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Sleek Studio", description: "A stylish studio apartment in the city.", amount: "470,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
    { name: "Coastal Retreat", description: "A serene getaway by the ocean.", amount: "700,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Downtown Condo", description: "Modern condo in the heart of downtown.", amount: "540,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741831327/6014006587a2e3764662a0de8b6beb47_jnhr8n.jpg", type: "Rent" },
    { name: "Mountain Cabin", description: "Rustic cabin surrounded by nature.", amount: "420,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Skyline Penthouse", description: "Penthouse with stunning city skyline views.", amount: "1,600,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
    { name: "Modern Villa", description: "A sleek villa with high-end amenities.", amount: "780,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Suburban Oasis", description: "A peaceful home with a spacious backyard.", amount: "610,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
    { name: "Lavish Mansion", description: "An exquisite mansion with expansive grounds.", amount: "1,400,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741831327/65fbdb13ca91fe808034fdc5b87c4092_t6rpnr.jpg", type: "Buy" },
    { name: "Minimalist Loft", description: "A stylish loft with an open floor plan.", amount: "490,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
    { name: "Lakeview Cottage", description: "A cozy retreat with a scenic lake view.", amount: "690,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Buy" },
    { name: "Urban Apartment", description: "A chic apartment in a prime city location.", amount: "550,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
    { name: "Forest Lodge", description: "A tranquil lodge nestled in the woods.", amount: "430,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741831327/753fc71f431a68adb999303b49922fe3_iakhwz.jpg", type: "Buy" },
    { name: "Grand Penthouse", description: "An ultra-modern penthouse with panoramic views.", amount: "1,700,000", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1741651511/Cliff_house_design_by_THE_LINE_visualization_1_mhbuoa.png", type: "Rent" },
];

export default function OurWork() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageMobile, setCurrentPageMobile] = useState(1);
  const totalPages = Math.ceil(houses.length / ITEMS_PER_PAGE);
  const totalPagesMobile = Math.ceil(houses.length / ITEMS_PER_PAGE_MOBILE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageChangeMobile = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesMobile) {
      setCurrentPageMobile(newPage);
    }
  };

  const displayedHouses = houses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const displayedHousesMobile = houses.slice(
    (currentPageMobile - 1) * ITEMS_PER_PAGE_MOBILE,
    currentPageMobile * ITEMS_PER_PAGE_MOBILE
  );

  return (
    <div className="bg-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        {/* Large Screen Layout */}
        <div className="hidden md:block">
          <div className="mt-4 grid gap-3 divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border text-gray-600 border-gray-100 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
            {displayedHouses.map((house, index) => (
              <div key={index} className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                <div className="relative">
                  <Image
                    src={house.image}
                    alt={house.name}
                    width={400}
                    height={250}
                    className="w-full h-52 object-cover rounded-3xl p-2"
                  />
                  <div className="absolute top-3 left-3">
                    <button className={`p-2 px- text-white font-semibold text-sm rounded-full shadow-lg ${house.type === 'Buy' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}>
                      {house.type}
                    </button>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200">
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="relative px-3  ">
                  <h1 className="text-[19px] font-bold text-black mt-2">{house.name}</h1>
                  <p className="text-gray-500 text-[12px] mt-2">{house.description}</p>
                  <p className="text-[20px] font-bold text-black mt-2">${house.amount}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls for Large Screens */}
          <div className="flex justify-center items-center mt-8 space-x-2 mb-10">
            <button
              className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-bold' : 'bg-gray-200'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Screen Layout */}
        <div className="md:hidden ml-6"> 
  <div className="mt-8 grid gap-6 grid-cols-2 "> 
    {displayedHousesMobile.map((house, index) => (
      <div key={index} className="group relative bg-gray-300 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 rounded-2xl w-[145px]"> {/* Add w-64 to set a fixed width for the cards */}
        <div className="relative">
          <Image
            src={house.image}
            alt={house.name}
            width={300}
            height={150}
            className="w-full h-32 object-cover rounded-t-2xl"
          />
          <div className="absolute top-2 left-2">
            <button className={`p-1 px-2 text-white font-semibold text-xs rounded-full shadow-lg ${house.type === 'Buy' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}>
              {house.type}
            </button>
          </div>
          <div className="absolute top-2 right-2">
            <button className="p-1 bg-white rounded-full shadow-lg hover:bg-gray-200">
              <Bookmark className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-2">
          <h1 className="text-[12px] font-semibold text-black">{house.name}</h1>
          <p className="text-gray-800 text-[10px] mt-1">{house.description}</p>
          <p className="text-[10px] font-bold text-black mt-1">${house.amount}</p>
        </div>
      </div>
    ))}
  </div>
  {/* Pagination Controls for Mobile Screens */}
  <div className="flex justify-center items-center mt-6 space-x-2 mb-6">
    <button
      className="p-1 bg-gray-200 rounded-full disabled:opacity-50"
      onClick={() => handlePageChangeMobile(currentPageMobile - 1)}
      disabled={currentPageMobile === 1}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    {[...Array(totalPagesMobile)].map((_, index) => (
      <button
        key={index}
        className={`px-2 py-1 rounded-full text-sm ${currentPageMobile === index + 1 ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-bold' : 'bg-gray-200'}`}
        onClick={() => handlePageChangeMobile(index + 1)}
      >
        {index + 1}
      </button>
    ))}
    <button
      className="p-1 bg-gray-200 rounded-full disabled:opacity-50"
      onClick={() => handlePageChangeMobile(currentPageMobile + 1)}
      disabled={currentPageMobile === totalPagesMobile}
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>
      </div>
    </div>
  );
}