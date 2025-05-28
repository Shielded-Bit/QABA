"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

export default function DashboardHeader() {
  const [dates, setDates] = useState({ start: "", end: "" });

  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden sm:flex justify-between items-center bg-gray-100 px-4 mt-2">
        {/* Dashboard Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-transparent text-gradient py-2 sm:py-3 lg:py-4 text-center md:text-left">
          Dashboard
        </h1>

        {/* Right Section - Date Filter + Export Button */}
        <div className="flex items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-300">
            <CalendarDays className="h-5 w-5 text-gray-600 mr-2" />
            <input
              type="date"
              className="bg-transparent focus:outline-none"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="bg-transparent focus:outline-none"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
            />
          </div>

        
        </div>
      </div>

      {/* Mobile Layout - Only Dashboard Title */}
      <div className="sm:hidden flex justify-between items-center bg-gray-100 px-4 mt-4 py-3">
        {/* Dashboard Title */}
        <h1 className="text-2xl ml-11 lg:ml-11 font-bold text-gradient">
          Dashboard
        </h1>
      </div>
    </div>
  );
}
