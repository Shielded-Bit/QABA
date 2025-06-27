// app/components/TransactionTable.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) {
          throw new Error("Authentication token not found");
        }
        // Always fetch only the 3 most recent transactions for dashboard preview
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/history/?page=1&limit=3`,
          {
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.success) {
          // Only show the 3 most recent transactions
          setTransactions(response.data.data.slice(0, 3));
        } else {
          throw new Error(response.data.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError(err.message || "Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount, currency = "NGN") => {
    const currencySymbols = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getPropertyType = (paymentType) => {
    const typeMap = { rent: 'Rental', purchase: 'Purchase', lease: 'Lease' };
    return typeMap[paymentType] || paymentType;
  };

  const getDisplayStatus = (status) => {
    const statusMap = { pending: 'Pending', completed: 'Completed', failed: 'Failed', success: 'Bought' };
    return statusMap[status] || status;
  };

  return (
    <div className="p-4 w-full bg-white shadow-sm rounded-lg overflow-x-auto z-30">
      <div className="flex justify-between items-center pb-3">
        <h2 className="text-md font-semibold text-gray-400">Transaction History</h2>
        <Link href="/agent-dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">View More →</Link>
      </div>
      <div className="overflow-x-auto w-full relative">
        {isLoading ? (
          <table className="min-w-[700px] w-full text-left border-collapse animate-pulse">
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
              {[1,2,3].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No transactions found</div>
        ) : (
          <>
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
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="hover:bg-gray-50 transition-colors">
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
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;