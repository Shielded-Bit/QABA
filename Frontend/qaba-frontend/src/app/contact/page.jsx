'use client';
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use backend API endpoint for contact form
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-[#3ab7b1] text-xl" />,
      title: "Phone",
      content: "+234 707 664 7640",
      action: "tel:+2347076647640"
    },
    {
      icon: <FaWhatsapp className="text-[#3ab7b1] text-xl" />,
      title: "WhatsApp",
      content: "+234 707 664 7640",
      action: "https://wa.me/2347076647640"
    },
    {
      icon: <FaEnvelope className="text-[#3ab7b1] text-xl" />,
      title: "Email",
      content: "contact@qarba.com",
      action: "mailto:contact@qarba.com"
    },
    {
      icon: <FaMapMarkerAlt className="text-[#3ab7b1] text-xl" />,
      title: "Office Address",
      content: "123 Abakaliki Road, Ebonyi State, Nigeria",
      action: "https://maps.google.com/?q=123+Abakaliki+Road+Ebonyi+State+Nigeria"
    },
    {
      icon: <FaClock className="text-[#3ab7b1] text-xl" />,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM",
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Updated to match About page styling */}
      <div className="relative h-80 md:h-96">
        {/* Background Image with Gradient - matching About page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#014d98]/80 to-[#3ab7b1]/80 z-10"></div>
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
            alt="Modern office building - Contact us"
            fill
            style={{objectFit: "cover"}}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center h-full max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Get in touch with us for any inquiries about properties, listings, or general questions. 
            We&apos;re here to help you with your property journey.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ab7b1] focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ab7b1] focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ab7b1] focus:border-transparent transition-colors"
                  placeholder="+234 803 123 4567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ab7b1] focus:border-transparent transition-colors"
                  placeholder="Property Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ab7b1] focus:border-transparent transition-colors resize-vertical"
                  placeholder="Your message here..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Thank you for your message. We will get back to you soon!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  There was an error sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.action}
                    target={info.action?.startsWith('http') ? '_blank' : undefined}
                    rel={info.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gradient-to-r hover:from-[#014d98]/5 hover:to-[#3ab7b1]/5 transition-all duration-200 ${
                      info.action ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="mt-1">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1]  rounded-xl shadow-lg border border-gray-100 p-6 md:p-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Our Location
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7277149272324!2d7.929373514770072!3d6.438056095343943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1044714b0270feb7%3A0x68c4b0494c486c0e!2sAbakaliki%2C%20Ebonyi!5e0!3m2!1sen!2sng!4v1625641008978!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional CTA Section - matching About page style */}
        <div className="mt-20 text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust us with their property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+2348031234567" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:opacity-90 transition"
            >
              Call Us Now
            </a>
            <a 
              href="https://wa.me/2348031234567" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#014d98] text-base font-medium rounded-md text-[#014d98] bg-white hover:bg-gray-50 transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;