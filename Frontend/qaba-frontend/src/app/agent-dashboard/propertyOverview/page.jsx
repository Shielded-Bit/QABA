"use client";
import PropertiesNumber from '../components/propertiesnumber';
import MonthlyRevenue from '../components/monthlyRevenue';
import PropertyStats from '../components/propertyStats';

export default function PropertyOverview() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Property Overview
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Comprehensive view of your property portfolio performance
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

        {/* Monthly Revenue Chart Section */}
        <section>
          <MonthlyRevenue />
        </section>

        {/* Property Stats Section */}
        <section>
          <PropertyStats />
        </section>
      </div>
    </div>
  );
}
