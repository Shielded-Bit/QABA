"use client";
import PropertiesNumber from '../components/propertiesnumber';
import MonthlyRevenue from '../components/monthlyRevenue'; // Import the chart component
import PropertyStats from '../components/propertyStats';

export default function PropertyOverview() {
  return (
    <>
     
       {/* Top Numbers Row Wrapper */}
       <div className="dashboard-numbers sm:pl-10 pl-16 px-6">
        {/* Main heading with gradient text */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-transparent text-gradient py-2 sm:py-3 lg:py-4 text-center md:text-left">
          Property Overview
        </h1>
        <section className="ml-2 lg:ml-0">
          <PropertiesNumber />
        </section>
        <section className='ml-2 lg:ml-0 px-2 py-8'>
          {/* Include the chart */}
          <MonthlyRevenue />
        </section>
        <section className='ml-2 lg:ml-0 px-2 py-3'>
  <PropertyStats />
</section>

      </div>
    </>
  );
}
