"use client";
import PropertiesNumber from '../components/propertiesnumber';
import Draft from '../components/draft';

export default function DraftPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              My Draft Properties
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Continue working on your saved property drafts
            </p>
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
