"use client";

import Help from './help';

export default function HelpSupportPage() {
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
        
        {/* Gradient Overlay - Dark left to light right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 rounded-t-2xl"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 lg:px-6 pb-4">
          <div className="w-full">
            {/* Hero Content with Icon and Description */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Text Content */}
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    Help & Support
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Find answers and get the help you need
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white">
                    Support
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    Available 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Consistent Spacing */}
      <div className="px-4 lg:px-6 py-6">
        <Help />
      </div>
    </div>
  );
}
