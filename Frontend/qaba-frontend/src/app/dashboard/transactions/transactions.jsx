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
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [filterPropertyType, setFilterPropertyType] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(1);

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

        // Add pagination params
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/history/?page=${page}&limit=${pageSize}`,
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
          // Assume API returns total count or total pages
          if (response.data.totalPages) {
            setTotalPages(response.data.totalPages);
          } else if (response.data.total) {
            setTotalPages(Math.ceil(response.data.total / pageSize));
          } else {
            // Fallback: if no total info, just set 1
            setTotalPages(1);
          }
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
  }, [page, pageSize]);

  const handleResetFilters = () => {
    setFilterStatus("All");
    setFilterPaymentMethod("All");
    setFilterPropertyType("All");
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

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((t) => {
    const statusMatch = filterStatus === "All" || (t.status_display || t.status) === filterStatus;
    const paymentMethodMatch = filterPaymentMethod === "All" || (t.payment_method_display || t.payment_method) === filterPaymentMethod;
    const propertyTypeMatch = filterPropertyType === "All" || t.property_type_display === filterPropertyType;
    
    return statusMatch && paymentMethodMatch && propertyTypeMatch;
  });

  // Get unique values for filter options
  const uniqueStatuses = [...new Set(transactions.map(t => t.status_display || t.status))].filter(Boolean);
  const uniquePaymentMethods = [...new Set(transactions.map(t => t.payment_method_display || t.payment_method))].filter(Boolean);
  const uniquePropertyTypes = [...new Set(transactions.map(t => t.property_type_display))].filter(Boolean);

  // Pagination controls
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (num) => setPage(num);
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-6xl mx-auto">
      {/* Simple Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track all your payment activities</p>
          </div>
          <div className="relative">
            <button
              className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:from-[#3ab7b1] hover:to-[#014d98] text-white rounded-lg shadow-sm flex items-center gap-2 px-4 py-2.5 transition-all duration-300"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">Filters</span>
              {(filterStatus !== "All" || filterPaymentMethod !== "All" || filterPropertyType !== "All") && (
                <span className="w-5 h-5 flex items-center justify-center bg-white text-[#014d98] rounded-full text-xs font-bold">
                  {(filterStatus !== "All" ? 1 : 0) + (filterPaymentMethod !== "All" ? 1 : 0) + (filterPropertyType !== "All" ? 1 : 0)}
                </span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-20">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-gray-800">Filter Transactions</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={filterPaymentMethod}
                      onChange={(e) => setFilterPaymentMethod(e.target.value)}
                    >
                      <option value="All">All Payment Methods</option>
                      {uniquePaymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={filterPropertyType}
                      onChange={(e) => setFilterPropertyType(e.target.value)}
                    >
                      <option value="All">All Property Types</option>
                      {uniquePropertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={handleResetFilters}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-6 bg-gray-100 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg" role="alert">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold">Error Loading Transactions</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No transactions found</h3>
                <p className="text-gray-600 max-w-md mx-auto">No transaction history matches your current filters. Try adjusting your search criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {filteredTransactions.map((transaction, index) => (
                    <div key={transaction.id} className="border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-md transition-all duration-200">
                      {/* Desktop Layout - Hidden on Mobile */}
                      <div className="hidden md:flex items-start space-x-4 p-5">
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
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {transaction.description}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            {/* Property Type */}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {transaction.property_type_display || 'N/A'}
                            </span>

                            {/* Payment Method */}
                            <div className="flex items-center space-x-1.5">
                              {transaction.is_offline_payment ? (
                                <>
                                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                  <span className="text-sm text-gray-600">{transaction.payment_method_display || 'Offline Payment'}</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-sm text-gray-600">{transaction.payment_method_display || 'Online Payment'}</span>
                                </>
                              )}
                            </div>

                            {/* Verification Badge */}
                            {transaction.needs_verification && (
                              <span className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full border border-yellow-200">
                                Verification Needed
                              </span>
                            )}
                          </div>

                          {/* Property Info */}
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {transaction.property_name || 'N/A'}
                            </p>
                            {transaction.property_address && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div className="text-xl font-bold text-gray-900 mb-3">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </div>
                          <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
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
                              ⚠️ Verification Needed
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
                
                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        page === 1 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white shadow-sm border border-gray-300'
                      }`}
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === page 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        page === totalPages 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white shadow-sm border border-gray-300'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
                    <select 
                      value={pageSize} 
                      onChange={handlePageSizeChange} 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;