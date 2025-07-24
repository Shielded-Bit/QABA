"use client";

import Header2 from '../components/header2';
import Transactions from './transactions';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen">
      {/* Consistent Header Wrapper */}
      <div className="px-4 lg:px-6 pt-4">
        <Header2 />
      </div>

      {/* Main Content with Consistent Spacing */}
      <div className="px-4 lg:px-6 py-6">
        <Transactions />
      </div>
    </div>
  );
}
