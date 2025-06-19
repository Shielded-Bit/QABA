// app/components/TransactionTable.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionTableSkeleton from "./TransactionTableSkeleton";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch transactions when component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com'}/api/v1/history/`,
          {
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setTransactions(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message || "Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleResetFilters = () => {
    setFilterStatus("All");
    setFilterType("All");
  };

  // Helper function to format currency
  const formatCurrency = (amount, currency = "NGN") => {
    const currencySymbols = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£"
    };
    
    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${Number(amount).toLocaleString()}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  // Convert payment_type to more readable property type
  const getPropertyType = (paymentType) => {
    const typeMap = {
      'rent': 'Rental',
      'purchase': 'Purchase',
      'lease': 'Lease'
      // Add more mappings as needed
    };
    
    return typeMap[paymentType] || paymentType;
  };

  // Maps transaction status to display values
  const getDisplayStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'completed': 'Completed',
      'failed': 'Failed',
      'success': 'Bought'
      // Add more mappings as needed
    };
    
    return statusMap[status] || status;
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((t) => {
    const status = getDisplayStatus(t.status);
    const type = getPropertyType(t.payment_type);
    
    const isStatusMatch = filterStatus === "All" || status === filterStatus;
    const isTypeMatch = filterType === "All" || type === filterType;
    
    return isStatusMatch && isTypeMatch;
  });

  // Get unique statuses and property types for filter options
  const uniqueStatuses = [...new Set(transactions.map(t => getDisplayStatus(t.status)))];
  const uniqueTypes = [...new Set(transactions.map(t => getPropertyType(t.payment_type)))];

  return (
    <div className="p-4 max-w-[1200px] mx-auto shadow-md rounded-lg overflow-x-auto relative bg-white border border-gray-100">
      <div className="flex justify-between items-center pb-4">
        <h2 className="lg:text-xl text-[17px] font-bold text-gray-800">Recent Transaction History</h2>
        <div className="relative">
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg shadow-sm flex items-center gap-2 hover:opacity-90 transition"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {(filterStatus !== "All" || filterType !== "All") && (
              <span className="w-5 h-5 flex items-center justify-center bg-white text-blue-600 rounded-full text-xs font-bold">
                {(filterStatus !== "All" ? 1 : 0) + (filterType !== "All" ? 1 : 0)}
              </span>
            )}
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
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Type</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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

      {isLoading ? (
        <TransactionTableSkeleton />
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-4" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error Loading Transactions</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full relative">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">No transaction history found with the current filters.</p>
            </div>
          ) : (
            <table className="min-w-[700px] w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.reference}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatDate(transaction.created_at)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{getPropertyType(transaction.payment_type)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{transaction.property_name}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "success" || transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {getDisplayStatus(transaction.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;