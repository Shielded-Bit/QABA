"use client";
import PropertiesNumber from '../components/propertiesnumber';
import Draft from '../components/draft';

export default function FavouritesPage() {
  return (
    <div className="pl-12"> {/* Wrapped everything in a single div with pl-6 */}
      
      {/* Gradient Header at the Top */}
      <h1 className="text-2xl font-normal text-gradient bg-clip-text px-2 py-6">
        My Draft
      </h1>

      {/* Properties Section */}
      <div className="space-y-2">
        <section>
          <PropertiesNumber />
        </section>
      </div>

      {/* Draft Section */}
      <div className="space-y-2">
        <Draft />
      </div>

    </div>
  );
}
