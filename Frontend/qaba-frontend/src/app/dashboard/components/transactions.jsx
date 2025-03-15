// app/components/TransactionTable.js
"use client";

import React, { useState } from "react";

const transactions = [
  {
    name: "Naomi Michaels",
    id: "#1122345",
    date: "2025-01-12",
    type: "Flat",
    property: "The Dream Family Home",
    status: "Bought",
    price: "\u20A6 10,000,000",
  },
  {
    name: "Naomi Michaels",
    id: "#1122345",
    date: "2025-01-12",
    type: "Self Con",
    property: "The Royal Villa",
    status: "Bought",
    price: "\u20A6 15,200,000",
  },
  {
    name: "Naomi Michaels",
    id: "#1122345",
    date: "2025-01-12",
    type: "Duplex",
    property: "Prince & Princess Estate",
    status: "Rented",
    price: "\u20A6 1,000,000",
  }
];

const TransactionTable = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const handleResetFilters = () => {
    setFilterStatus("All");
    setFilterType("All");
  };

  const filteredTransactions = transactions.filter((t) => {
    const isStatusMatch = filterStatus === "All" || t.status === filterStatus;
    const isTypeMatch = filterType === "All" || t.type === filterType;
    return isStatusMatch && isTypeMatch;
  });

  return (
    <div className="p-4 w-full bg-white shadow-sm rounded-lg overflow-x-auto relative">
      <div className="flex justify-between items-center pb-3">
        <h2 className="text-md font-semibold text-gray-400">Transaction History</h2>
        <div className="relative">
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-700 transition"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span className="font-medium">Filters</span>
            <span className="w-5 h-5 flex items-center justify-center bg-white text-blue-600 rounded-full text-xs">{filterStatus !== "All" || filterType !== "All" ? 1 : 0}</span>
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border border-gray-200 rounded-lg z-10 p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Bought">Bought</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Property Type</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Flat">Flat</option>
                    <option value="Self Con">Self Con</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Single Room">Single Room</option>
                  </select>
                </div>

                <button
                  className="w-full bg-gray-600 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto w-full relative">
        <table className="min-w-[700px] w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-xs text-gray-500">Orders</th>
              <th className="p-2 text-xs text-gray-500">Date</th>
              <th className="p-2 text-xs text-gray-500">Property Type</th>
              <th className="p-2 text-xs text-gray-500">Property Name</th>
              <th className="p-2 text-xs text-gray-500">Status</th>
              <th className="p-2 text-xs text-gray-500">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-2 flex items-center gap-2">
                  <img
                    src="https://res.cloudinary.com/ddzaww11y/image/upload/v1740505215/profile_mmaj88.png"
                    alt="avatar"
                    className="w-9 h-9 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{transaction.name}</p>
                    <p className="text-xs text-gray-500">{transaction.id}</p>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-600">{transaction.date}</td>
                <td className="p-2 text-sm text-gray-600">{transaction.type}</td>
                <td className="p-2 text-sm text-gray-600">{transaction.property}</td>
                <td
                  className={`p-2 text-sm font-medium ${
                    transaction.status === "Bought" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  {transaction.status}
                </td>
                <td className="p-2 text-sm text-gray-600">{transaction.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
