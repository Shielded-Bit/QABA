// pages/help-and-support.js
'use client';

import Head from 'next/head';
import { useState } from 'react';
import { Search, Mail, Phone, MessageSquare, ChevronRight, ChevronDown, Bookmark, Play, Users } from 'lucide-react';

export default function HelpAndSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create a new property listing?",
      answer: "To create a new property listing, go to the \"Listings\" section in your dashboard and click on \"Add New Listing.\" Fill in the required details and submit."
    },
    {
      id: 2,
      question: "How can I edit my profile information?",
      answer: "Navigate to the \"Profile\" section in your account settings. You can update your information and save the changes."
    },
    {
      id: 3,
      question: "What payment methods are supported?",
      answer: "We support credit/debit cards, PayPal, and bank transfers. You can manage your payment methods in the \"Billing\" section."
    },
    {
      id: 4,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email to reset your password."
    },
    {
      id: 5,
      question: "Can I download property reports?",
      answer: "Yes, you can generate and download property reports from the 'Reports' section in your dashboard."
    }
  ];

  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Help & Support - Estate Software</title>
        <meta name="description" content="Get help and support for your estate software. Find FAQs, contact support, and access resources." />
      </Head>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-green-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
            <p className="text-gray-100 mb-8">Find answers, resources, and get the support you need</p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-95 border-0 rounded-full shadow-lg focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* FAQs Section */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
              Frequently Asked Questions
            </h2>
            {searchQuery && (
              <p className="text-sm text-gray-500">
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                    <div className="flex-shrink-0 ml-2">
                      {expandedFaq === faq.id ? (
                        <ChevronDown size={18} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top duration-300">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No matching questions found.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-800 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* Contact Support Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600 mb-6">
            Contact Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-900">
                  <Mail size={18} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Get a response within 24 hours on business days</p>
              <a 
                href="mailto:support@estatesoftware.com" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                support@estatesoftware.com
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                  <MessageSquare size={18} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">Live Chat</h3>
              </div>
              <p className="text-gray-600 mb-4">Available Monday-Friday, 9AM-5PM</p>
              <button 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Start a chat
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                  <Phone size={18} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">Phone Support</h3>
              </div>
              <p className="text-gray-600 mb-4">For urgent inquiries during business hours</p>
              <a 
                href="tel:+1234567890" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600 mb-6">
            Learning Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="h-32 bg-gradient-to-br from-blue-900/90 to-blue-700 p-6 flex items-center justify-center">
                <Bookmark size={32} className="text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">User Guides</h3>
                <p className="text-gray-600 mb-4">Access our comprehensive user guides to learn how to use all features of the software.</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read Guides <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="h-32 bg-gradient-to-br from-green-700/90 to-green-500 p-6 flex items-center justify-center">
                <Play size={32} className="text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">Watch step-by-step video tutorials to get the most out of your estate software.</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Watch Videos <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="h-32 bg-gradient-to-br from-purple-800/90 to-purple-600 p-6 flex items-center justify-center">
                <Users size={32} className="text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Community Forum</h3>
                <p className="text-gray-600 mb-4">Join our community forum to connect with other users and share tips.</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Join Community <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

  
    </div>
  );
}