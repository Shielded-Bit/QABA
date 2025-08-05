"use client";
import Header2 from './components/header2';
import PropertiesNumber from './components/propertiesnumber';
import Cards from './components/cards';
import Transactions from './components/transactions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Consistent Header Wrapper */}
      <div className="px-4 lg:px-6 pt-4">
        <Header2 />
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
