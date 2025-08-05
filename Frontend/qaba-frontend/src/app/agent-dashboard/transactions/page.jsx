"use client";
import Transactions from './transactions';

export default function TransactionsPage() {
  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Transactions Header */}
      <div className="mb-6">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <h1 className="text-xl sm:text-2xl lg:text-2xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
            Transactions
          </h1>
        </div>
      </div>
      
      <div className="space-y-4">
        <Transactions/>
      </div>
    </div>
  );
}
