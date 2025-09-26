"use client";
import PropertiesNumber from '../components/propertiesnumber';
import Draft from '../components/draft';

export default function DraftPage() {
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
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Text Content */}
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    Draft Properties
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Continue working on your saved property drafts
                  </p>
                </div>
              </div>
              
              {/* Draft Status */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white">
                    Drafts
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    Saved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Consistent Spacing */}
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* Properties Number Section */}
        <section>
          <PropertiesNumber />
        </section>

        {/* Draft Section */}
        <section>
          <Draft />
        </section>
      </div>
    </div>
  );
}
