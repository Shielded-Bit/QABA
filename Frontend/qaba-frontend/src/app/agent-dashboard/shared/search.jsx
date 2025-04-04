import { useState } from "react";
import { Search, ListFilter } from "lucide-react";

const SearchFilter = () => {
  const [query, setQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const handleFilterToggle = () => {
    setFilterActive((prev) => !prev);
  };

  return ( 
    <div className="flex justify-end md:justify-end mr-8 ml-16">
      {/* Desktop Layout */}
      <div className="hidden md:flex space-x-2 rounded-lg mt-5 mr-8 md:mr-0">
        {/* Search Input */}
        <div className="flex items-center bg-white rounded-md shadow-sm px-3 py-2 w-64">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 w-full bg-transparent focus:outline-none text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter Button */}
        <button 
          className={`flex items-center bg-white px-4 py-2 rounded-md shadow-sm text-gray-700 hover:bg-gray-200 ${filterActive ? 'bg-gray-300' : ''}`}
          onClick={handleFilterToggle}
        >
          <ListFilter className="w-5 h-5 mr-2" />
          <span>Filter</span>
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden w-full justify-end items-end mt-5 px-4 ">
        <div className="flex bg-white rounded-md shadow-sm px-3 py-2 w-full max-w-xs">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 w-full bg-transparent focus:outline-none text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button 
          className={`ml-2 bg-white p-2 rounded-md shadow-sm text-gray-700 hover:bg-gray-200 ${filterActive ? 'bg-gray-300' : ''}`}
          onClick={handleFilterToggle}
        >
          <ListFilter className="w-6 h-6" />
        </button>
      </div>
      
    </div>
  );
};

export default SearchFilter;