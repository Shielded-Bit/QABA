import React from 'react';

const ContactEnquiryModal = ({ open, onClose, property }) => {
  if (!open) return null;
  const propertyLink = `/details/${property?.id}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button>
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">Contact Us for Enquiries</h2>
        <p className="mb-4 text-gray-600">Enquire about <span className="font-semibold">{property?.property_name}</span>.</p>
        <div className="mb-4 text-sm text-blue-700">
          <span>Property ID: <span className="font-mono">{property?.id}</span></span><br />
          <a href={propertyLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">View property page</a>
        </div>
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
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} required />
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">Send Enquiry</button>
        </form>
      </div>
    </div>
  );
};

export default ContactEnquiryModal;
