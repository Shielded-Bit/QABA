import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ScheduleVisitModal = ({ isOpen, onClose, property }) => {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Debug: Log the property to see what's being passed

  if (!isOpen) return null;

  // Function to format time to HH:MM:SS format (no timezone conversion)
  const formatTime = (timeString) => {
    if (!timeString) return '09:00:00';

    // Simply append seconds to the HH:MM format
    // No timezone conversion - send local time as-is
    return `${timeString}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';
    }

    if (!token) {
      // User is not logged in - show login prompt
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirect_after_login', window.location.pathname);
      }
      setShowLoginPrompt(true);
      return;
    }

    // Validate that both date and time are selected
    if (!date || !time) {
      setErrorMessage('Please select both date and time for your visit');
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Prepare API call to schedule meeting
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com';
    const endpoint = `${API_URL}/api/v1/survey-meetings/create/`;

    // Prepare payload matching backend expectations exactly
    const payload = {
      property_id: property?.id || property?.property_id || '',
      scheduled_date: date,
      scheduled_time: formatTime(time), // Send local time without timezone conversion
      message,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of error responses
        if (data.errors?.non_field_errors) {
          setErrorMessage(data.errors.non_field_errors[0]);
        } else if (data.errors?.scheduled_time) {
          setErrorMessage(data.errors.scheduled_time[0]);
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage('Failed to schedule visit. Please try again.');
        }
        return;
      }

      // Show success message
      setSuccessMessage(data.message);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setDate("");
        setTime("");
        setMessage("");
        setSuccessMessage("");
        setErrorMessage("");
        onClose();
      }, 2000);

    } catch (err) {
      setErrorMessage('An error occurred while scheduling the visit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time options (9 AM to 6 PM in 30-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleLoginRedirect = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    router.push('/signin');
  };

  const handleCancelLogin = () => {
    setShowLoginPrompt(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:text-gray-700 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
          disabled={isLoading}
        >
          ✕
        </button>

        {showLoginPrompt ? (
          <div className="space-y-6 pt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">
                Please log in to schedule a visit for this property. You&apos;ll be redirected back here after signing in.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300"
                >
                  Go to Sign In
                </button>
                <button
                  onClick={handleCancelLogin}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : successMessage ? (
          <div className="space-y-4 text-center py-6">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Visit Scheduled Successfully!</h3>
            <p className="text-gray-600">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage("");
                onClose();
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Schedule a Visit
              <div className="mt-2 space-y-1">
                <p className="text-lg font-medium text-gray-700">
                  {property?.name || property?.property_name}
                </p>
              </div>
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Preferred Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Preferred Time</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select a time</option>
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.display}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Message</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting Request...
                  </span>
                ) : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleVisitModal;