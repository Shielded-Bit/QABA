import React, { useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // Check if user is logged in
    let token = '';
    let user = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';

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

    if (!token || !user || !user.email) {
      // User is not logged in - show login prompt
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirect_after_login', window.location.pathname);
      }
      setIsSending(false);
      setShowLoginPrompt(true);
      return;
    }
    // Authenticated: extract info and submit
    const payload = {
      name: user.name || user.fullName || user.first_name || '',
      email: user.email,
      phone: user.phone || user.phone_number || '',
      subject: `Enquiry about ${property?.property_name || 'a property'}`,
      message,
      property_id: property?.id || 0,
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Enquiry for ${property?.property_name || ''}`.trim()}>
      {showLoginPrompt ? (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please log in to make an enquiry about this property. You&apos;ll be redirected back here after signing in.
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
      ) : submitted ? (
        <div className="space-y-4 text-center py-6">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Enquiry Sent Successfully!</h3>
          <p className="text-gray-600">We will contact you soon with more details about this property.</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Your Message</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Type your enquiry here..."
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending enquiry...
              </span>
            ) : 'Send Enquiry'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
