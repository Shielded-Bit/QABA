"use client";

import Header2 from './components/header2';
import PropertiesNumber from './components/propertiesnumber';
import Cards from './components/cards';
import Transactions from './components/transactions';

export default function DashboardPage() {
  return (
    <div className="bg-gray-100 ml-12 lg:ml-4 mt-5 mb-10">
      <div className=''>
        {/* Header Wrapper */}
        <div className="dashboard-header lg:ml-4 ml-3">
          <Header2 />
        </div>

        {/* Main Content */}
        <div className='mt-6 px-4'>
          {/* <PropertiesNumber /> */}
          <div className='mt-8'>
            <Cards />
          </div>
          <div className='mt-8'>
            <Transactions />
          </div>
        </div>
      </div>
    </div>
  );
}
