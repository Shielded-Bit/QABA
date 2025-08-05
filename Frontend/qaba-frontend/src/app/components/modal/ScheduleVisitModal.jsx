import React, { useState } from 'react';

const ScheduleVisitModal = ({ isOpen, onClose, property }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Debug: Log the property to see what's being passed
  console.log("Property passed to modal:", property);

  if (!isOpen) return null;

  // Function to convert time to ISO format (HH:MM:SS.sssZ)
  const formatTimeToISO = (timeString) => {
    if (!timeString) return new Date().toISOString().split('T')[1];
    
    // Create a date object with today's date and the selected time
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Return time portion in ISO format (HH:MM:SS.sssZ)
    return today.toISOString().split('T')[1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    // Get access token from localStorage or cookies
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';
    }

    // Prepare payload matching backend expectations exactly
    const payload = {
      property_id: property?.id || property?.property_id || '',
      scheduled_date: date,
      scheduled_time: formatTimeToISO(time),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 hover:text-gray-700 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
          disabled={isLoading}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Schedule a Visit
          <div className="mt-2 space-y-1">
            <p className="text-lg font-medium text-gray-700">
              {property?.name || property?.property_name}
            </p>
          </div>
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Date</label>
            <input 
              type="date" 
              className="w-full border rounded px-3 py-2" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Time</label>
            <select
              className="w-full border rounded px-3 py-2"
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
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
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
            className="w-full py-2 rounded font-semibold bg-gradient-to-r from-blue-900 to-green-600 text-white hover:opacity-90 transition relative"
            disabled={isLoading}
          >
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              Submit Request
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;