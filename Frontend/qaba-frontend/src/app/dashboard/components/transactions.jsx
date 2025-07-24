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
        // Use paginated API to fetch only 3 most recent transactions
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
          // Defensive: always show only the 3 most recent transactions
          setTransactions((response.data.data || []).slice(0, 3));
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'completed':
      case 'success':
        return "bg-green-50 text-green-700 border border-green-200";
      case 'pending':
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case 'failed':
      case 'cancelled':
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg text-gray-600">
      {/* Simple Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">Latest payment activities</p>
          </div>
          <Link 
            href="dashboard/transactions" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-100 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg" role="alert">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600">Your transaction history will appear here once you make payments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                {/* Desktop Layout - Hidden on Mobile */}
                <div className="hidden md:flex items-start space-x-4 p-4">
                  {/* Transaction Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {transaction.description}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/* Property Type */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {transaction.property_type_display || 'N/A'}
                      </span>

                      {/* Payment Method */}
                      <div className="flex items-center space-x-1.5">
                        {transaction.is_offline_payment ? (
                          <>
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">{transaction.payment_method_display || 'Offline'}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">{transaction.payment_method_display || 'Online'}</span>
                          </>
                        )}
                      </div>

                      {/* Verification Badge */}
                      {transaction.needs_verification && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                          Verification Pending
                        </span>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {transaction.property_name || 'N/A'}
                      </p>
                      {transaction.property_address && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {transaction.property_address}
                        </p>
                      )}
                    </div>

                    {/* Reference */}
                    <p className="text-xs text-gray-400 font-mono">
                      Ref: {transaction.reference}
                    </p>
                  </div>

                  {/* Amount and Status */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status_display || transaction.status}
                    </span>
                  </div>
                </div>

                {/* Mobile Layout - Only Visible on Mobile */}
                <div className="md:hidden p-3 space-y-3">
                  {/* Header Section with Icon, Title and Amount */}
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1 leading-tight">
                        {transaction.description}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Full Width */}
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status_display || transaction.status}
                    </span>
                  </div>

                  {/* Property Type and Payment Method - Two Column */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-1">Type</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {transaction.property_type_display || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Payment</span>
                      <div className="flex items-center space-x-1">
                        {transaction.is_offline_payment ? (
                          <>
                            <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                            <span className="text-xs text-gray-600 truncate">
                              {transaction.payment_method_display?.replace('Payment', '') || 'Offline'}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                            <span className="text-xs text-gray-600 truncate">
                              {transaction.payment_method_display?.replace('Payment', '') || 'Online'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge - If Needed */}
                  {transaction.needs_verification && (
                    <div>
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                        ⚠️ Verification Pending
                      </span>
                    </div>
                  )}

                  {/* Property Info - Compact */}
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-gray-700 mb-1 truncate">
                      {transaction.property_name || 'Property name not available'}
                    </p>
                    {transaction.property_address && (
                      <p className="text-xs text-gray-500 flex items-start">
                        <svg className="w-3 h-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
                        </svg>
                        <span className="line-clamp-2 leading-tight">
                          {transaction.property_address}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Reference - Compact */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-mono truncate">
                      {transaction.reference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;