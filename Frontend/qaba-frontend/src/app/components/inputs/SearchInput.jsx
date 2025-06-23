"use client"; // This tells Next.js that the component is a client component
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import Button from "../shared/Button"; // Assuming the Button component exists in the same directory
import { useRouter } from "next/navigation";

const SearchInput = ({ onSearch, placeholder = "e.g Abakiliki" }) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    // Route to /buy or /rent with query param
    router.push(`/${activeTab}?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="bg-white bg-opacity-45 rounded-lg shadow-md p-4 sm:p-6 w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
      {/* Tabs Section */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium ${
            activeTab === "buy"
              ? "text-black border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("buy")}
        >
          Buy
        </button>
        <button
          className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium ${
            activeTab === "rent"
              ? "text-black border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("rent")}
        >
          Rent
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        {/* Label */}
        <div className="text-left">
          <label
            htmlFor="search"
            className="block text-gray-700 font-medium text-sm sm:text-base"
          >
            Enter a location
          </label>
        </div>

        {/* Input and Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center border rounded-md p-2">
          <input
            id="search"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-grow bg-transparent outline-none text-gray-900 px-2 py-2 w-full text-sm sm:text-base placeholder:text-gray-600"
          />
          <Button
            label={
              <span className="flex items-center gap-2 text-sm sm:text-base">
                Search <CiSearch />
              </span>
            }
            onClick={handleSearch}
            className="mt-2 sm:mt-0 sm:ml-4 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-black font-semibold px-4 sm:px-6 py-2 rounded-md hover:opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
