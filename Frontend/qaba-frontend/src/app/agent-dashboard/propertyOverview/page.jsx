"use client";
import Header1 from '../components/header1';
import PropertiesNumber from '../components/propertiesnumber';
import MonthlyRevenue from '../components/monthlyRevenue'; // Import the chart component
import PropertyStats from '../components/propertyStats';

export default function PropertyOverview() {
  return (
    <>
      <div className="dashboard-header lg:ml-4 ml-3">
        <Header1 /> 
      </div>
       {/* Top Numbers Row Wrapper */}
       <div className="dashboard-numbers sm:pl-10 pl-16 px-6">
        {/* Text with fixed gradient */}
        <h1 className="text-2xl font-medium px-4 py-4 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">
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
