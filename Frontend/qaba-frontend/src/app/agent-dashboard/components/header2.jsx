"use client";

export default function DashboardHeader() {

  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden sm:flex justify-between items-center bg-gray-100 px-8 mt-2">
        {/* Dashboard Title */}
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-transparent text-gradient py-2 sm:py-3 lg:py-4 text-center md:text-left">
  Dashboard
</h1>


      </div>

      {/* Mobile Layout - Only Dashboard Title */}
      <div className="sm:hidden flex justify-between items-center bg-gray-100 px-4 mt-4 py-3">
        {/* Dashboard Title */}
        <h1 className="text-3xl ml-11 lg:ml-11 font-bold bg-clip-text text-transparent text-gradient">
          Dashboard
        </h1>
      </div>
    </div>
  );
}
