'use client';

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Loading Skeleton Components
const PropertyCardSkeleton = () => (
    <div className="p-2 sm:p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-gray-200">
            <div className="absolute top-2 left-2 w-12 h-6 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center justify-between pt-1">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);

const LoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
        ))}
    </div>
);

const HeaderSkeleton = () => (
    <div className="mb-6 sm:mb-8 animate-pulse">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-6 bg-gray-200 rounded w-64"></div>
            <div className="flex bg-gray-100 rounded-2xl p-1 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none h-12 bg-gray-200 rounded-xl mx-1"></div>
                <div className="flex-1 sm:flex-none h-12 bg-gray-200 rounded-xl mx-1"></div>
            </div>
        </div>
    </div>
);

const PropertyCard = ({ house }) => {
    const router = useRouter();
    
    const handleCardClick = () => {
        router.push(`/agent-dashboard/properties/${house.id}`);
    };
    
    const formatPrice = useCallback((price) => {
        if ((price === null || price === undefined || isNaN(price))) {
            return "₦0";
        }
        
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        try {
            return `₦${Number(numericPrice).toLocaleString()}`;
        } catch (error) {
            console.error("Error formatting price:", error);
            return "₦0";
        }
    }, []); // Added dependency array for useCallback
    
    return (
        <div 
            className="p-2 sm:p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 touch-manipulation"
            onClick={handleCardClick}
        >
            <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-gray-100">
                <Image 
                    src={house.image || "/api/placeholder/400/320"} 
                    alt={house.name}
                    fill
                    style={{objectFit: "cover"}}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span
                    className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-semibold rounded-lg text-white backdrop-blur-sm ${
                        house.type === "Buy" ? "bg-blue-600/90" : "bg-green-600/90"
                    }`}
                >
                    {house.type}
                </span>
            </div>
            <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1">{house.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{house.location}</p>
                <div className="flex items-center justify-between pt-1">
                    <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
                        {formatPrice(house.amount)}
                    </p>
                    {house.type === "Rent" && house.rent_frequency && (
                        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            {house.rent_frequency_display || house.rent_frequency}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PropertyGrid = ({ properties, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(properties.length / itemsPerPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Reset to page 1 when properties change
    useEffect(() => {
        setCurrentPage(1);
    }, [properties]);

    const displayedProperties = properties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(properties.length / itemsPerPage);

    if (loading) {
        return <LoadingGrid />;
    }

    return (
        <div className="space-y-6">
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedProperties.length > 0 ? (
                    displayedProperties.map((house, index) => (
                        <PropertyCard 
                            key={house.id || index} 
                            house={house}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No properties available</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later or try refreshing the page</p>
                    </div>
                )}
            </div>

            {/* Mobile-Optimized Pagination */}
            {properties.length > itemsPerPage && (
                <div className="flex flex-col items-center space-y-4 pt-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, properties.length)} of {properties.length} properties
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 active:from-[#014d98]/20 active:via-[#3ab7b1]/20 active:to-[#3ab7b1]/20 transition-all duration-200 touch-manipulation"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-5 h-5 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]" />
                        </button>
                        
                        {/* Page Dots - Show max 5 on mobile */}
                        <div className="flex space-x-1.5">
                            {totalPages <= 5 ? (
                                // Show all pages if 5 or fewer
                                [...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                                            currentPage === index + 1 
                                                ? "bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1] text-white shadow-sm" 
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 active:from-[#014d98]/10 active:via-[#3ab7b1]/10 active:to-[#3ab7b1]/10"
                                        }`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))
                            ) : (
                                // Show condensed version for more than 5 pages
                                <>
                                    {currentPage > 3 && (
                                        <>
                                            <button
                                                className="w-8 h-8 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 transition-all duration-200"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                            <span className="text-gray-400 px-1">...</span>
                                        </>
                                    )}
                                    
                                    {[...Array(3)].map((_, index) => {
                                        const pageNum = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + index;
                                        if (pageNum <= totalPages) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                                                        currentPage === pageNum 
                                                            ? "bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1] text-white shadow-sm" 
                                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 active:bg-gray-100"
                                                    }`}
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                    
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            <span className="text-gray-400 px-1">...</span>
                                            <button
                                                className="w-8 h-8 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 transition-all duration-200"
                                                onClick={() => handlePageChange(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <button
                            className="p-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#014d98]/10 hover:via-[#3ab7b1]/10 hover:to-[#3ab7b1]/10 active:from-[#014d98]/20 active:via-[#3ab7b1]/20 active:to-[#3ab7b1]/20 transition-all duration-200 touch-manipulation"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-5 h-5 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function MyListings() {
    const [pendingProperties, setPendingProperties] = useState([]);
    const [publishedProperties, setPublishedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('approved');

    useEffect(() => {
        // Helper functions moved inside useEffect to avoid dependency issues
        const extractPrice = (property) => {
            if (!property) return null;
            
            const isRent = property.listing_type?.toLowerCase() === "rent";
            let price = isRent ? 
                (property.rent_price || property.rentPrice || property.monthly_rent || property.amount) :
                (property.sale_price || property.salePrice || property.price || property.amount);
                
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[^\d.]/g, ''));
            }
            
            return isNaN(price) ? null : price;
        };

        const formatProperties = (data) => {
            if (!Array.isArray(data)) return [];
            
            return data.map(property => ({
                id: property.id,
                name: property.property_name || 'Unnamed Property',
                location: property.location || 'Location not specified',
                amount: extractPrice(property),
                image: property.thumbnail || 
                       (property.images?.[0]?.image_url) ||
                       "/api/placeholder/400/320",
                type: (property.listing_type?.toLowerCase() === "sale") ? "Buy" : "Rent",
                listing_status: property.listing_status,
                rent_frequency: property.rent_frequency,
                rent_frequency_display: property.rent_frequency_display
            }));
        };

        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [pendingResponse, publishedResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=PENDING`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    })
                ]);
                
                if (!pendingResponse.ok || !publishedResponse.ok) {
                    throw new Error('Failed to fetch properties');
                }
                
                const [pendingData, publishedData] = await Promise.all([
                    pendingResponse.json(),
                    publishedResponse.json()
                ]);
                
                setPendingProperties(formatProperties(
                    pendingData?.results || pendingData?.data || pendingData?.properties || pendingData || []
                ));
                
                setPublishedProperties(formatProperties(
                    publishedData?.results || publishedData?.data || publishedData?.properties || publishedData || []
                ));
                
            } catch (err) {
                console.error("Failed to fetch properties:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProperties();
    }, []); // Now we can safely remove all dependencies

    const currentProperties = activeTab === 'approved' ? publishedProperties : pendingProperties;
    const approvedCount = publishedProperties.length;
    const pendingCount = pendingProperties.length;

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load properties</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1] text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
                {/* Header Section */}
                {loading ? (
                    <HeaderSkeleton />
                ) : (
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-gray-600 text-base sm:text-lg">
                                Manage and view all your property listings
                            </p>
                            
                            {/* Toggle Buttons - Mobile Optimized */}
                            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-200 w-full sm:w-auto">
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 touch-manipulation ${
                                        activeTab === 'approved'
                                            ? 'bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1] text-white shadow-sm transform scale-[0.98] sm:scale-100'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Approved</span>
                                    <span className="sm:hidden">Approved</span>
                                    <span className="ml-2 bg-white/20 sm:bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-bold">
                                        {approvedCount}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 touch-manipulation ${
                                        activeTab === 'pending'
                                            ? 'bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1] text-white shadow-sm transform scale-[0.98] sm:scale-100'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Pending</span>
                                    <span className="sm:hidden">Pending</span>
                                    <span className="ml-2 bg-white/20 sm:bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-bold">
                                        {pendingCount}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Indicator - Mobile Optimized */}
                {!loading && (
                    <div className="mb-6">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                            activeTab === 'approved' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                                activeTab === 'approved' ? 'bg-green-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="font-semibold">
                                {activeTab === 'approved' ? 'Approved Listings' : 'Pending Review'}
                            </span>
                            <span className="ml-2 text-xs font-medium">
                                {activeTab === 'approved' ? `${approvedCount} properties` : `${pendingCount} properties`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Properties Section */}
                <PropertyGrid properties={currentProperties} loading={loading} />
            </div>
        </div>
    );
};