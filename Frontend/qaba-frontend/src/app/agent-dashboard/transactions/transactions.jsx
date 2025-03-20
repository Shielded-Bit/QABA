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
    price: "\u20A6 1,000,000",
  },
  {
    name: "Naomi Michaels",
    id: "#1122345",
    date: "2025-01-12",
    type: "Self Con",
    property: "The Royal Villa",
    status: "Bought",
    price: "\u20A6 1,200,000",
  },
  {
    name: "Naomi Michaels",
    id: "#1122345",
    date: "2025-01-12",
    type: "Duplex",
    property: "Prince & Princess Estate",
    status: "Rented",
    price: "\u20A6 1,000,000",
  },
  {
    name: "John Doe",
    id: "#1122346",
    date: "2025-02-15",
    type: "Single Room",
    property: "Cozy Studio Apartment",
    status: "Rented",
    price: "\u20A6 500,000",
  },
  {
    name: "Jane Smith",
    id: "#1122347",
    date: "2025-03-20",
    type: "Duplex",
    property: "Luxury Duplex Suite",
    status: "Bought",
    price: "\u20A6 2,000,000",
  },
  {
    name: "Michael Johnson",
    id: "#1122348",
    date: "2025-04-10",
    type: "Flat",
    property: "Modern City Flat",
    status: "Rented",
    price: "\u20A6 800,000",
  },
  {
    name: "Emily Davis",
    id: "#1122349",
    date: "2025-05-05",
    type: "Self Con",
    property: "Private Bungalow",
    status: "Bought",
    price: "\u20A6 5,000,000",
  },
  {
    name: "Daniel Wilson",
    id: "#1122350",
    date: "2025-06-18",
    type: "Single Room",
    property: "Affordable Single Room",
    status: "Rented",
    price: "\u20A6 300,000",
  },
  {
    name: "Olivia Brown",
    id: "#1122351",
    date: "2025-07-22",
    type: "Duplex",
    property: "Elegant Duplex Home",
    status: "Bought",
    price: "\u20A6 9,000,000",
  },
  {
    name: "William Taylor",
    id: "#1122352",
    date: "2025-08-30",
    type: "Flat",
    property: "Spacious Family Flat",
    status: "Rented",
    price: "\u20A6 1,200,000",
  },
  {
    name: "Sophia Martinez",
    id: "#1122353",
    date: "2025-09-12",
    type: "Self Con",
    property: "Exclusive Villa",
    status: "Bought",
    price: "\u20A6 1,050,000",
  },
  {
    name: "James Anderson",
    id: "#1122354",
    date: "2025-10-25",
    type: "Single Room",
    property: "Budget-Friendly Room",
    status: "Rented",
    price: "\u20A6 250,000",
  },
  {
    name: "Emma Thomas",
    id: "#1122355",
    date: "2025-11-14",
    type: "Duplex",
    property: "Grand Duplex Residence",
    status: "Bought",
    price: "\u20A6 8,000,000",
  },
  {
    name: "Alexander Hernandez",
    id: "#1122356",
    date: "2025-12-05",
    type: "Flat",
    property: "City Center Flat",
    status: "Rented",
    price: "\u20A6 900,000",
  },
  {
    name: "Mia Moore",
    id: "#1122357",
    date: "2026-01-18",
    type: "Self Con",
    property: "Luxury Bungalow",
    status: "Bought",
    price: "\u20A6 5,000,000",
  },
  {
    name: "Ethan Jackson",
    id: "#1122358",
    date: "2026-02-22",
    type: "Single Room",
    property: "Compact Single Room",
    status: "Rented",
    price: "\u20A6 200,000",
  },
  {
    name: "Charlotte Lee",
    id: "#1122359",
    date: "2026-03-30",
    type: "Duplex",
    property: "Modern Duplex Apartment",
    status: "Bought",
    price: "\u20A6 6,000,000",
  },
  {
    name: "Liam Perez",
    id: "#1122360",
    date: "2026-04-15",
    type: "Flat",
    property: "Affordable Family Flat",
    status: "Rented",
    price: "\u20A6 750,000",
  },
  {
    name: "Amelia White",
    id: "#1122361",
    date: "2026-05-20",
    type: "Self Con",
    property: "Private Villa",
    status: "Bought",
    price: "\u20A6 7,000,000",
  },
  {
    name: "Noah Harris",
    id: "#1122362",
    date: "2026-06-10",
    type: "Single Room",
    property: "Cozy Single Room",
    status: "Rented",
    price: "\u20A6 350,000",
  },
  {
    name: "Ava Clark",
    id: "#1122363",
    date: "2026-07-25",
    type: "Duplex",
    property: "Elegant Duplex House",
    status: "Bought",
    price: "\u20A6 2,000,000",
  },
  {
    name: "Lucas Lewis",
    id: "#1122364",
    date: "2026-08-12",
    type: "Flat",
    property: "Modern Flat",
    status: "Rented",
    price: "\u20A6 1,100,000",
  },
  {
    name: "Isabella Walker",
    id: "#1122365",
    date: "2026-09-18",
    type: "Self Con",
    property: "Luxury Villa",
    status: "Bought",
    price: "\u20A6 5,000,000",
  },
  {
    name: "Mason Hall",
    id: "#1122366",
    date: "2026-10-30",
    type: "Single Room",
    property: "Affordable Room",
    status: "Rented",
    price: "\u20A6 400,000",
  },
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
    <div className="p-4  max-w-[1200px]  mx-auto shadow-sm rounded-lg overflow-x-auto relative">
      <div className="flex justify-between items-center pb-3">
        <h2 className="lg:text-xl text-[17px]  font-bold text-gray-700">Recent Transaction History</h2>
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