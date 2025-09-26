"use client";
import PropertiesNumber from './components/propertiesnumber';
import Cards from './components/cards';
import Transactions from './components/transactions';

export default function DashboardPage() {
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
        <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 pb-3 sm:pb-4">
          <div className="w-full">
            {/* Hero Content with Icon and Description */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Text Content */}
                <div>
                  <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-0 sm:mb-1">
                    Dashboard
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Manage your properties and track your performance
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3">
                  <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-white">
                   Status
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    Active
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

        {/* Cards Section */}
        <section>
          <Cards />
        </section>

        {/* Transactions Section */}
        <section>
          <Transactions />
        </section>
      </div>
    </div>
  );
}
