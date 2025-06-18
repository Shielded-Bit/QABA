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
    const currentRef = statsRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCounters({
              properties: 0,
              customers: 0,
              successRate: 0,
              support: 0
            });
            
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
      <div className="relative bg-gray-50 py-6 md:py-10">
        <div className="w-full mx-auto px-8 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center ">
            {/* Left Content */}
            <div>
              <p className="text-xl font-medium text-gray-600 mb-2">About us</p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-6 leading-tight">
                Welcome to Qarba, Your Trusted Partner in Real Estate
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                At QARBA, we are on a mission to redefine how people discover, buy, rent, and list properties across Nigeria.
              </p>
            </div>
            
            {/* Right Side with Images */}
            <div className="relative">
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
                  alt="Modern residential neighborhood"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                    <div className="w-full h-full bg-white flex items-center justify-center">
                      <span className="text-[#3ab7b1] font-bold text-lg md:text-xl">QARBA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Introduction Text */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Whether you&apos;re looking for your first home, seeking an investment property, or trying 
            to find the perfect tenant, our platform provides you with a smart, reliable, and 
            stress-free solution.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe property transactions should be simple, safe, and accessible, and that&apos;s 
            exactly what we&apos;re here to offer.
          </p>
        </div>

 {/* Our Mission Section - Updated to match the image exactly */}
<div className="mb-20">
  <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
    {/* Mission Image */}
    <div className="relative overflow-visible">
      <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#4a90e2] rounded-2xl transform rotate-12 z-0"></div>
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
        <div className="h-80 relative">
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167908/4744e3fba07a6711d66f357c1757555c8306b0a3_ftxspq.jpg"
            alt="Modern residential neighborhood"
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </div>
      </div>
      {/* Small overlay image positioned outside the main image container - increased height */}
      <div className="absolute top-1/2 -right-6 md:right-0 transform -translate-y-1/2 md:translate-x-12 bg-white p-3 rounded-xl shadow-lg z-20">
        <div className="w-24 h-32 md:w-28 md:h-36 relative rounded-lg overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/75e38b33199d3659e9dafaf019ce76d1eaadc7e6_ica1ok.jpg"
            alt="Aerial view of properties"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
    
    {/* Mission Content */}
    <div className="space-y-4 mt-8 md:mt-0">
      <h2 className="text-3xl md:text-4xl font-bold text-[#4a90e2] mb-4">
        Our Mission
      </h2>
      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
        To simplify real estate transactions by creating a transparent, secure, and user-friendly digital 
        environment for property buyers, renters, and sellers in Nigeria.
      </p>
    </div>
  </div>
  
  {/* Our Vision Section - Updated to match the image exactly */}
  <div className="grid md:grid-cols-2 gap-16 items-center">
    {/* Vision Content */}
    <div className="space-y-4 md:order-1 mt-8 md:mt-0">
      <h2 className="text-3xl md:text-4xl font-bold text-[#4a90e2] mb-4">
        Our Vision
      </h2>
      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
        To become Nigeria&apos;s most trusted digital real estate marketplace, empowering millions to find and list 
        properties without hassle or fear.
      </p>
    </div>
    
    {/* Vision Image */}
    <div className="relative overflow-visible md:order-2">
      <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#4a90e2] rounded-2xl transform rotate-12 z-0"></div>
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
        <div className="h-80 relative">
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/bbef79fe26ddca2a59cc4804b4cbce5b512b18c9_qbps2s.jpg"
            alt="Modern residential neighborhood"
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </div>
      </div>
      {/* Small overlay image positioned outside the main image container - increased height */}
      <div className="absolute top-1/2 -right-6 md:right-0 transform -translate-y-1/2 md:translate-x-12 bg-white p-3 rounded-xl shadow-lg z-20">
        <div className="w-24 h-32 md:w-28 md:h-36 relative rounded-lg overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167908/7260c1bcbd2e7d9da3c2e041a545ccdad2162d75_gnkcfu.jpg"
            alt="Aerial view of properties"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
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