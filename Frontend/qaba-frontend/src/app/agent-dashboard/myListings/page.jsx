"use client";
import PropertiesNumber from '../components/propertiesnumber';


import Propertycards from '../../agent-dashboard/myListings/propertyCard';

export default function FavouritesPage() {
  return (
    <div className="px-4 lg:px-6 py-6">
       {/* Header Section */}
       <div className="mb-6">
         <h1 className="text-xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">
           My Listings
         </h1>
         <PropertiesNumber />
       </div>

      {/* Main Content */}
      <div className="space-y-4">
        <Propertycards />
      </div>
    </div>
  );
}