"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  const [counters, setCounters] = useState({
    properties: 0,
    customers: 0,
    successRate: 0,
    support: 0
  });
  const statsRef = useRef(null);

  // Counter animation function
  const animateCounter = (start, end, duration, callback) => {
    const startTime = Date.now();
    const range = end - start;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (range * easeOutQuart));
      
      callback(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    const currentRef = statsRef.current; // Store ref value
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset counters to 0 before starting new animation
            setCounters({
              properties: 0,
              customers: 0,
              successRate: 0,
              support: 0
            });
            
            // Animate all counters simultaneously
            animateCounter(0, 25000, 2000, (value) => {
              setCounters(prev => ({ ...prev, properties: value }));
            });
            
            animateCounter(0, 15000, 2200, (value) => {
              setCounters(prev => ({ ...prev, customers: value }));
            });
            
            animateCounter(0, 95, 1800, (value) => {
              setCounters(prev => ({ ...prev, successRate: value }));
            });
            
            animateCounter(0, 24, 1500, (value) => {
              setCounters(prev => ({ ...prev, support: value }));
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Format numbers for display
  const formatNumber = (num, suffix = '') => {
    if (suffix === 'K+') {
      return `${(num / 1000).toFixed(num >= 1000 ? 0 : 1)}K+`;
    }
    if (suffix === '%') {
      return `${num}%`;
    }
    if (suffix === '/7') {
      return `${num}/7`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div className="relative h-80 md:h-96">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#014d98]/80 to-[#3ab7b1]/80 z-10"></div>
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
            alt="Modern office building"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center h-full max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            About Our Story
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Connecting property owners with qualified buyers and renters through 
            innovative technology and exceptional service since 2020.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Our Mission Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To revolutionize the real estate experience by making property transactions 
              transparent, efficient, and accessible for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Transforming Real Estate</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe that finding the perfect property or the right buyer shouldn&apos;t be 
                complicated. Our platform combines cutting-edge technology with personalized 
                service to create seamless experiences for property owners, buyers, and renters.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From our humble beginnings as a small startup to becoming a trusted platform 
                for thousands of users, we&apos;ve maintained our commitment to innovation, 
                transparency, and customer satisfaction.
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 p-8 rounded-xl">
              <div className="flex justify-center mb-6">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="mission-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#014d98" />
                      <stop offset="100%" stopColor="#3ab7b1" />
                    </linearGradient>
                  </defs>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    stroke="url(#mission-gradient)"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">25,000+</h4>
                <p className="text-gray-600">Properties Listed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We build trust through transparent processes, verified listings, 
                and honest communication at every step.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our platform with the latest technology 
                to provide the best user experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what&apos;s best for our users 
                and their property journey.
              </p>
            </div>
          </div>
        </div>

       {/* Our Team Section */}
<div className="mb-20">
  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Leadership Team</h2>
  
  <div className="grid md:grid-cols-3 gap-8">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-64 bg-gradient-to-br from-[#014d98]/20 to-[#3ab7b1]/20 flex items-center justify-center">
        <img 
          src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1749026641/Franc_syeixd.jpg" 
          alt="Dr. Francis Nwebonyi"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-1">Dr. Francis Nwebonyi</h3>
        <p className="text-[#3ab7b1] font-medium mb-3">Founder</p>
        <p className="text-gray-600 text-sm">
          15+ years in real estate technology. Previously led digital transformation 
          at major property companies.
        </p>
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-64 bg-gradient-to-br from-[#014d98]/20 to-[#3ab7b1]/20 flex items-center justify-center">
        <img 
          src="/path/to/sarah-martinez.jpg" 
          alt="Sarah Martinez"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-1">Sarah Martinez</h3>
        <p className="text-[#3ab7b1] font-medium mb-3">CTO & Co-Founder</p>
        <p className="text-gray-600 text-sm">
          Tech veteran with expertise in scalable platforms. Former senior engineer 
          at leading tech companies.
        </p>
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-64 bg-gradient-to-br from-[#014d98]/20 to-[#3ab7b1]/20 flex items-center justify-center">
        <img 
          src="/path/to/david-kim.jpg" 
          alt="David Kim"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-1">David Kim</h3>
        <p className="text-[#3ab7b1] font-medium mb-3">Head of Operations</p>
        <p className="text-gray-600 text-sm">
          Operations expert focused on customer experience and process optimization. 
          MBA from top business school.
        </p>
      </div>
    </div>
  </div>
</div>

        {/* Statistics Section with Animated Counters */}
        <div ref={statsRef} className="mb-20 bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Impact in Numbers</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-2 transition-all duration-300">
                {formatNumber(counters.properties, 'K+')}
              </div>
              <p className="text-gray-600 font-medium">Properties Listed</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-2 transition-all duration-300">
                {formatNumber(counters.customers, 'K+')}
              </div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-2 transition-all duration-300">
                {formatNumber(counters.successRate, '%')}
              </div>
              <p className="text-gray-600 font-medium">Success Rate</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-2 transition-all duration-300">
                {formatNumber(counters.support, '/7')}
              </div>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Awards & Recognition</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Best PropTech Startup 2023</h3>
              <p className="text-gray-600 text-sm">Recognized for innovation in property technology</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Choice Award 2024</h3>
              <p className="text-gray-600 text-sm">Highest customer satisfaction in real estate platforms</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Top 10 Real Estate Platforms</h3>
              <p className="text-gray-600 text-sm">Featured in industry&apos;s leading platforms list</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 rounded-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Want to Learn More?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get in touch with our team to see how we can help with your property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:opacity-90 transition"
            >
              Contact Us
            </Link>
            <Link 
              href="/create-account" 
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#014d98] text-base font-medium rounded-md text-[#014d98] bg-white hover:bg-gray-50 transition"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;