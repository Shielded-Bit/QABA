
"use client";
import Header1 from '../components/header1';
import Header2 from '../components/header2';
import PropertiesNumber from '../components/propertiesnumber';
import Cards from '../components/cards';
import Transactions from '../components/transactions';

export default function DashboardPage() {
  return (
    <div className="bg-gray-100">
      

      <div className=''>
        {/* Header Wrapper */}
        <div className="dashboard-header lg:ml-4 ml-3 ">
          <Header1 />
          <Header2 />
        </div>

        <main className="p-1 lg:p-4 overflow-auto ml-14 lg:ml-2 " role="main">
          {/* Top Numbers Row Wrapper */}
          <div className="dashboard-numbers">
            <section className="ml-2 lg:ml-0">
              <PropertiesNumber />
            </section>
          </div>

          {/* Middle Section Wrapper */}
          <div className="dashboard-cards mt-5">
            <section>
              <div className="ml-2 lg:ml-0 ">
                <Cards />
              </div>
            </section>
          </div>

          {/* Transaction History Wrapper */}
          <div className="dashboard-transactions mt-4 ">
            <section>
              <Transactions />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
