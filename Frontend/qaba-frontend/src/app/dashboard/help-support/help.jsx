// pages/help-and-support.js
'use client';

import Head from 'next/head';
import { useState } from 'react';
import { Search, Mail, Phone, MessageSquare, ChevronRight, ChevronDown } from 'lucide-react';

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
    <div className="bg-gray-50">
      <Head>
        <title>Help & Support - Estate application</title>
        <meta name="description" content="Get help and support for your estate application. Find FAQs, contact support, and access resources." />
      </Head>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* FAQs Section */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] flex-shrink-0">
              Frequently Asked Questions
            </h2>
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-auto lg:max-w-md lg:min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-all duration-300 text-black placeholder-gray-500"
              />
            </div>
          </div>
          
          {searchQuery && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
          
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
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-6">
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
                href="mailto:contact@qarba.com" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                contact@qarba.com
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
                href="tel:+2348155901163" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                +234 815 590 1163
              </a>
            </div>
          </div>
        </section>

      </main>

  
    </div>
  );
}