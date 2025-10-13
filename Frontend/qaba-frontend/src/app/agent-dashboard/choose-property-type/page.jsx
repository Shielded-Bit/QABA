"use client";
import { useRouter } from "next/navigation";

export default function ChoosePropertyType() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-[140px] flex items-end rounded-t-2xl mx-4 lg:mx-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-t-2xl"
          style={{
            backgroundImage: `url('/proper1.png')`
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 rounded-t-2xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 lg:px-6 pb-4">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    Add New Listing
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Choose the listing type to get started
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white">
                    New
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Action cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Rent Property Card */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl transform transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 border border-[#e0f7fa] shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:shadow-[#3ab7b1]/25 group-hover:shadow-2xl">
              {/* Card icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10v-2H7v2z" />
                </svg>
              </div>
              <h3 className="text-1xl font-bold text-[#014d98] mb-3 group-hover:text-[#3ab7b1] transition-colors duration-300">
                Property For Rent
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                List rental properties and connect with tenants looking for their perfect home. Manage leases and maximize your rental income.
              </p>
              <button
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white hover:from-[#013366] hover:to-[#1e8e8e] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#3ab7b1]/30"
                onClick={() => router.push("/agent-dashboard/for-rent")}
              >
                List Property For Rent
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-300">→</span>
              </button>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#3ab7b1]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          {/* Sale Property Card */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-2xl transform transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 border border-[#e0f7fa] shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:shadow-[#014d98]/25 group-hover:shadow-2xl">
              {/* Card icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-1xl font-bold text-[#3ab7b1] mb-3 group-hover:text-[#014d98] transition-colors duration-300">
                Property For Sale
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Showcase properties for sale and help buyers find their dream home. Close deals and grow your sales portfolio.
              </p>
              <button
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#3ab7b1] to-[#014d98] text-white hover:from-[#1e8e8e] hover:to-[#013366] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#014d98]/30"
                onClick={() => router.push("/agent-dashboard/for-sell")}
              >
                List Property For Sale
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-300">→</span>
              </button>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#014d98]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
