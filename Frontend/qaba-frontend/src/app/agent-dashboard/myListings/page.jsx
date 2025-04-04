"use client";
import PropertiesNumber from '../components/propertiesnumber';


import Propertycards from '../../agent-dashboard/myListings/propertyCard';

export default function FavouritesPage() {
  return (
    <>
    
       {/* Top Numbers Row Wrapper */}
       <div className="dashboard-numbers sm:pl-10 pl-12 px-6">
    {/* Text with fixed gradient */}
    <h1 className="text-xl font-normal px-4 py-4 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">
        My Listings
    </h1>
    <section className="ml-2 lg:ml-0">
        <PropertiesNumber />
    </section>
</div>

      <div className="space-y-4 ml-6 lg:ml-5">
        <Propertycards />
      </div>
    </>
  );
}