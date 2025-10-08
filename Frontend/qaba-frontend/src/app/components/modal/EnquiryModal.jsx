import React, { useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    // Check authentication
    let user = null;
    if (typeof window !== 'undefined') {
      // Try to get user info from localStorage (user_data)
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch {}
      }
      // Try to get more robust info from localStorage (profile fields)
      if (!user || !user.email) {
        // Try to get from profile fields (as in profile page)
        const email = localStorage.getItem('user_email');
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');
        const phone = localStorage.getItem('phone_number');
        if (email) {
          user = {
            email,
            name: (firstName || '') + (lastName ? ' ' + lastName : ''),
            phone: phone || '',
          };
        }
      }
    }
    if (!user || !user.email) {
      // Not authenticated, route to contact page
      setIsSending(false);
      router.push('/contact');
      return;
    }
    // Authenticated: extract info and submit
    const payload = {
      name: user.name || user.fullName || user.first_name || '',
      email: user.email,
      phone: user.phone || user.phone_number || '',
      subject: `Enquiry about ${property?.property_name || 'a property'}`,
      message,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubmitted(true);
        setIsSending(false);
      } else {
        setIsSending(false);
        alert('Failed to send enquiry. Please try again.');
      }
    } catch (err) {
      setIsSending(false);
      alert('Failed to send enquiry. Please try again.');
    }
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
          <button type="submit" disabled={isSending} className="w-full py-2 rounded font-semibold bg-gradient-to-r from-blue-900 to-green-600 text-white hover:opacity-90 transition disabled:opacity-60">
            {isSending ? 'Sending enquiry...' : 'Send Enquiry'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
