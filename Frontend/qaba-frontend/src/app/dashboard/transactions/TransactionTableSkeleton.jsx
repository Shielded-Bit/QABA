// TransactionTableSkeleton.jsx
// Skeleton loader for the transactions table layout

import React from "react";

const TransactionTableSkeleton = () => (
  <div className="p-4 max-w-[1200px] mx-auto shadow-md rounded-lg overflow-x-auto relative bg-white border border-gray-100 animate-pulse">
    <div className="flex justify-between items-center pb-4">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="h-10 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="overflow-x-auto w-full relative">
      <table className="min-w-[700px] w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Type</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Property Name</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(6)].map((_, idx) => (
            <tr key={idx}>
              <td className="px-4 py-4">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TransactionTableSkeleton;
