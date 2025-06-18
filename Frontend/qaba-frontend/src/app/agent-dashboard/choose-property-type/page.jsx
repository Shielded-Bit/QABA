"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChoosePropertyType() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#014d98]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3ab7b1]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#014d98]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#014d98]/30 rotate-45 animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-[#3ab7b1]/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-8 bg-[#014d98]/20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 lg:px-0 ml-10 lg:ml-0">
        {/* Header section with enhanced typography */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-[#e0f7fa] rounded-full text-[#3ab7b1] font-medium text-sm tracking-wide uppercase shadow-sm">
              Real Estate Agent Portal
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] tracking-tight leading-tight">
            Welcome
            <span className="block text-4xl md:text-5xl mt-2 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] bg-clip-text text-transparent">
              Agent!
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-normal max-w-2xl mx-auto leading-relaxed">
            Ready to expand your property portfolio? Choose your next move and let&apos;s make it happen.
          </p>
        </div>

        {/* Enhanced action cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-0 lg:px-8">
          {/* Rent Property Card */}
          <div
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredCard('rent')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl transform transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 border border-[#e0f7fa] shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:shadow-[#3ab7b1]/25 group-hover:shadow-2xl">
              {/* Card icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10v-2H7v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#014d98] mb-3 group-hover:text-[#3ab7b1] transition-colors duration-300">
                Property For Rent
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                List rental properties and connect with tenants looking for their perfect home. Manage leases and maximize your rental income.
              </p>
              <button
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white hover:from-[#013366] hover:to-[#1e8e8e] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#3ab7b1]/30"
                onClick={() => router.push("/agent-dashboard/for-rent")}
              >
                Create Rental Listing
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-300">→</span>
              </button>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#3ab7b1]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          {/* Sale Property Card */}
          <div
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredCard('sale')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-2xl transform transition-transform duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 border border-[#e0f7fa] shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:shadow-[#014d98]/25 group-hover:shadow-2xl">
              {/* Card icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3ab7b1] mb-3 group-hover:text-[#014d98] transition-colors duration-300">
                Property For Sale
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Showcase properties for sale and help buyers find their dream home. Close deals and grow your sales portfolio.
              </p>
              <button
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#3ab7b1] to-[#014d98] text-white hover:from-[#1e8e8e] hover:to-[#013366] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#014d98]/30"
                onClick={() => router.push("/agent-dashboard/for-sell")}
              >
                Create Sale Listing
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-300">→</span>
              </button>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#014d98]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
        {/* Additional stats or info section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="text-center p-6 bg-white/80 rounded-xl border border-[#e0f7fa]">
            <div className="text-3xl font-bold text-[#3ab7b1] mb-2">500+</div>
            <div className="text-gray-700">Properties Listed</div>
          </div>
          <div className="text-center p-6 bg-white/80 rounded-xl border border-[#e0f7fa]">
            <div className="text-3xl font-bold text-[#014d98] mb-2">98%</div>
            <div className="text-gray-700">Success Rate</div>
          </div>
          <div className="text-center p-6 bg-white/80 rounded-xl border border-[#e0f7fa]">
            <div className="text-3xl font-bold text-[#7c3aed] mb-2">24/7</div>
            <div className="text-gray-700">Support Available</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}