import { useState } from "react";

export default function CommentBox({ propertyId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleRating = (value) => setRating(value);
  
  const handleSubmit = async () => {
    if (!comment.trim() || !rating) return;
    
    if (!propertyId) {
      setError("Unable to submit review: Property ID is missing");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      // Get auth token
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("Please log in to submit a review");
      }

      const requestBody = {
        rating: Number(rating),
        comment: comment.trim(),
        reviewed_property: propertyId
      };

      console.log('Submitting review with data:', requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          throw new Error(errorMessages);
        }
        
        // Handle other types of errors
        const errorMessage = data.detail || data.message || 
          (typeof data.error === 'string' ? data.error : JSON.stringify(data));
        throw new Error(errorMessage);
      }

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setComment("");
        setRating(0);
      }, 3000);

    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.message || "Failed to submit review. Please try again.");
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const currentRating = hoverRating || rating;

  if (submitted) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-green-800">Thank you for your feedback!</h4>
            <p className="text-green-600 text-sm">Your review has been submitted successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl">
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Rating Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate your experience
        </label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= currentRating ? "url(#grad1)" : "none"}
                stroke={star <= currentRating ? "none" : "#d1d5db"}
                strokeWidth="1.5"
                className="w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-110"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            ))}
          </div>
          {currentRating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-600 animate-fade-in">
              {ratingLabels[currentRating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your comment
        </label>
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            placeholder="Share your thoughts about this property..."
            rows="4"
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {comment.length}/500
          </div>
        </div>
      </div>

      {/* Action Section - Responsive Layout */}
      <div className="space-y-4">
        {/* Security Notice */}
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-center sm:text-left">Your feedback helps others make informed decisions</span>
        </div>
        
        {/* Buttons - Stack on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button 
            onClick={() => {
              setComment("");
              setRating(0);
              setHoverRating(0);
              setError("");
            }}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            disabled={isSubmitting}
          >
            Clear
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!comment.trim() || !rating || isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className="hidden sm:inline">Submitting...</span>
                <span className="sm:hidden">Submitting</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Submit Review</span>
                <span className="sm:hidden">Submit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}