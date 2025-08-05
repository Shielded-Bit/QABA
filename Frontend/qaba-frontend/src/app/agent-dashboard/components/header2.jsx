"use client";

export default function DashboardHeader() {
  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden sm:flex justify-start items-center bg-gray-100 px-4 mt-2">
        {/* Dashboard Title */}
        <h1 className="text-xl sm:text-2xl lg:text-2xl font-normal text-transparent text-gradient py-2 sm:py-3 lg:py-4">
          Dashboard
        </h1>
      </div>

      {/* Mobile Layout - Only Dashboard Title */}
      <div className="sm:hidden flex justify-start items-center bg-gray-100 px-2 mt-4 py-0">
        {/* Dashboard Title */}
        <h1 className="text-2xl font-normal text-gradient">
          Dashboard
        </h1>
      </div>
    </div>
  );
}
