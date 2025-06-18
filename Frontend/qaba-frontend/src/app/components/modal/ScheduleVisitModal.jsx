import React from 'react';

const ScheduleVisitModal = ({ isOpen, onClose, property }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Schedule a Visit</h2>
        <p className="mb-4 text-gray-600">Schedule a visit to view <span className="font-semibold">{property?.property_name}</span>.</p>
        {/* Example form fields */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" required />
          </div>
          <button type="submit" className="w-full py-2 rounded font-semibold bg-gradient-to-r from-blue-900 to-green-600 text-white hover:opacity-90 transition">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;
