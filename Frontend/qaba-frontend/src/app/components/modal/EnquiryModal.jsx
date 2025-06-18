import React, { useState } from 'react';
import Modal from './Modal';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the enquiry to your backend
    setSubmitted(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enquiry for ${property?.property_name || ''}`.trim()}>
      {submitted ? (
        <div className="text-green-600 font-semibold text-center">Enquiry sent! We will contact you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Message</label>
            <textarea className="w-full border rounded px-3 py-2" value={message} onChange={e => setMessage(e.target.value)} rows={4} required placeholder="Type your enquiry here..." />
          </div>
          <button type="submit" className="w-full py-2 rounded font-semibold bg-gradient-to-r from-blue-900 to-green-600 text-white hover:opacity-90 transition">Send Enquiry</button>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
