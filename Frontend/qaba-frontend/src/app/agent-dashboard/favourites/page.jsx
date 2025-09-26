"use client";
import Propertycards from './propertycards';

export default function FavouritesPage() {
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
        <div className="relative z-10 w-full px-6 lg:px-6 pb-4">
          <div className="w-full">
            {/* Hero Content with Icon and Description */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Text Content */}
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    My Favorites
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Keep track of properties you&apos;re interested in
                  </p>
                </div>
              </div>
              
              {/* Favorites Count */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white">
                    Saved
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    Properties
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-6">
        <Propertycards />
      </div>
    </div>
  );
}