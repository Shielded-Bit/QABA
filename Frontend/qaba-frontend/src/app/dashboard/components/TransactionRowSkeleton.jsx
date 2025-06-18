// TransactionRowSkeleton.jsx
import React from "react";

const TransactionRowSkeleton = () => (
  <tr>
    <td className="p-2">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-20"></div>
    </td>
    <td className="p-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="p-2">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="p-2">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="p-2">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="p-2">
      <div className="h-5 bg-gray-200 rounded w-20"></div>
    </td>
  </tr>
);

export default TransactionRowSkeleton;
