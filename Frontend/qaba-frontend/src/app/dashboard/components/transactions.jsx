// app/components/Transactions.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import TransactionRowSkeleton from "./TransactionRowSkeleton";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          // Get only the three most recent transactions
          const recentTransactions = response.data.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);
          setTransactions(recentTransactions);
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

  return (
    <div className="p-4 w-full bg-white shadow-sm rounded-lg overflow-x-auto relative">
      <div className="flex justify-between items-center pb-3">
        <h2 className="text-md font-semibold text-gray-400">Recent Transactions</h2>
        <Link 
          href="dashboard/transactions" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto w-full relative">
          <table className="min-w-[700px] w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-xs text-gray-500">Description</th>
                <th className="p-2 text-xs text-gray-500">Date</th>
                <th className="p-2 text-xs text-gray-500">Property Type</th>
                <th className="p-2 text-xs text-gray-500">Property Name</th>
                <th className="p-2 text-xs text-gray-500">Status</th>
                <th className="p-2 text-xs text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, idx) => (
                <TransactionRowSkeleton key={idx} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="text-sm">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No transaction history found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full relative">
          <table className="min-w-[700px] w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-xs text-gray-500">Description</th>
                <th className="p-2 text-xs text-gray-500">Date</th>
                <th className="p-2 text-xs text-gray-500">Property Type</th>
                <th className="p-2 text-xs text-gray-500">Property Name</th>
                <th className="p-2 text-xs text-gray-500">Status</th>
                <th className="p-2 text-xs text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.reference}</p>
                    </div>
                  </td>
                  <td className="p-2 text-sm text-gray-600">{formatDate(transaction.created_at)}</td>
                  <td className="p-2 text-sm text-gray-600">{getPropertyType(transaction.payment_type)}</td>
                  <td className="p-2 text-sm text-gray-600">{transaction.property_name}</td>
                  <td className="p-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === "success" || transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {getDisplayStatus(transaction.status)}
                    </span>
                  </td>
                  <td className="p-2 text-sm font-medium">{formatCurrency(transaction.amount, transaction.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      

    </div>
  );
};

export default Transactions;