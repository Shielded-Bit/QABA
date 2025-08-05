import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Skeleton loader for property cards
export const PropertyCardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Image skeleton */}
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Skeleton loader for property details
export const PropertyDetailsSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-7xl mx-auto px-4 py-8"
  >
    {/* Header skeleton */}
    <div className="mb-8">
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>

    {/* Image gallery skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>

    {/* Details skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      ))}
    </div>
  </motion.div>
);

// Loading spinner with cache indicator
export const LoadingSpinner = ({ size = 'md', showCache = false, fromCache = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {showCache && fromCache && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-green-600 font-medium"
        >
          Cached
        </motion.span>
      )}
    </div>
  );
};

// Progress bar for page loading
export const ProgressBar = ({ progress = 0, showPercentage = false }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full bg-gray-200 rounded-full h-1"
  >
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-teal-500 h-1 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3 }}
    />
    {showPercentage && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-gray-600 mt-1 text-center"
      >
        {Math.round(progress)}%
      </motion.div>
    )}
  </motion.div>
);

// Enhanced loading overlay with context
export const LoadingOverlay = ({ 
  loading, 
  message = "Loading...", 
  showProgress = false, 
  progress = 0,
  fromCache = false 
}) => (
  <AnimatePresence>
    {loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4"
        >
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" showCache fromCache={fromCache} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
              {fromCache && (
                <p className="text-sm text-green-600 mt-1">Loading from cache</p>
              )}
            </div>
            {showProgress && (
              <ProgressBar progress={progress} showPercentage />
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Smart loading component that adapts based on content type
export const SmartLoader = ({ 
  loading, 
  type = 'properties', 
  count = 3, 
  fromCache = false,
  children 
}) => {
  if (!loading) {
    return children;
  }

  const loaderComponents = {
    properties: <PropertyCardSkeleton count={count} />,
    property: <PropertyDetailsSkeleton />,
    spinner: <LoadingSpinner size="lg" showCache fromCache={fromCache} />
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-64 flex items-center justify-center"
    >
      {loaderComponents[type] || loaderComponents.spinner}
    </motion.div>
  );
};

// Error boundary with retry functionality
export const ErrorFallback = ({ error, onRetry, fromCache = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-64 flex items-center justify-center p-8"
  >
    <div className="text-center max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred'}</p>
      {fromCache && (
        <p className="text-sm text-orange-600 mb-4">
          This is cached data. Try refreshing for latest information.
        </p>
      )}
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </div>
  </motion.div>
);

// Success indicator for fast operations
export const SuccessIndicator = ({ show, message = "Success!" }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{message}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const EnhancedLoadingComponents = {
  PropertyCardSkeleton,
  PropertyDetailsSkeleton,
  LoadingSpinner,
  ProgressBar,
  LoadingOverlay,
  SmartLoader,
  ErrorFallback,
  SuccessIndicator
};

export default EnhancedLoadingComponents; 