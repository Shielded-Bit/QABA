"use client";

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Hide on certain pages if needed
  useEffect(() => {
    const currentPath = window.location.pathname;
    // You can add paths where you don't want the widget to show
    const hiddenPaths = ['/admin', '/login'];
    setIsVisible(!hiddenPaths.some(path => currentPath.startsWith(path)));
  }, []);

  if (!isVisible) return null;

  const phoneNumber = "+2348155901163";
  const message = encodeURIComponent("Hello! I'm interested in your real estate services. Can you help me?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FaWhatsapp size={20} />
              </div>
              <div>
                <h3 className="font-semibold">QARBA Support</h3>
                <p className="text-sm opacity-90">We&apos;re here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                👋 Hi there! Need help with properties, listings, or have any questions? 
                <br /><br />
                Click the button below to start a WhatsApp conversation with us!
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaWhatsapp size={20} />
              <span>Start Conversation</span>
            </a>

            <p className="text-xs text-gray-500 text-center mt-2">
              We typically reply within a few minutes
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
        aria-label="Open WhatsApp chat"
      >
        {isOpen ? (
          <FaTimes size={24} />
        ) : (
          <FaWhatsapp size={28} />
        )}
      </button>

      {/* Online indicator */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default WhatsAppWidget; 