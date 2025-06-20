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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const statsRef = useRef(null);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "Thanks to this platform, I found my dream home in no time! The search feature made it incredibly easy to navigate through listings.",
      name: "Emeka Anara",
      title: "Homebuyer in Abuja",
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1749026641/Franc_syeixd.jpg"
    },
    {
      id: 2,
      quote: "The best real estate platform I've used. Professional service and excellent customer support throughout my property search.",
      name: "Sarah Johnson",
      title: "Property Investor",
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1749026641/Franc_syeixd.jpg"
    },
    {
      id: 3,
      quote: "QARBA made selling my property effortless. The listing process was smooth and I got genuine buyers quickly.",
      name: "Michael Okafor",
      title: "Property Seller in Lagos",
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1749026641/Franc_syeixd.jpg"
    }
  ];

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div className="relative bg-gray-50 py-6 md:py-10">
        <div className="w-full mx-auto px-8 md:px-16">
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
                  src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/711132722f7d555237a57c3105c2ffb89aeb58f8_utfmok.jpg"
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
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl transform rotate-12 z-0"></div>
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
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4">
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
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4">
                Our Vision
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                To become Nigeria&apos;s most trusted digital real estate marketplace, empowering millions to find and list 
                properties without hassle or fear.
              </p>
            </div>
            
            {/* Vision Image */}
            <div className="relative overflow-visible md:order-2">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl transform rotate-12 z-0"></div>
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

        {/* Statistics Section with Animated Counters */}
        <div ref={statsRef} className="mb-20 bg-gradient-to-r from-[#014d98]/[.07] to-[#3ab7b1]/[.07] rounded-xl p-12">
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

        {/* Testimonials Section - Hear From Our Users */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-16">Hear From Our Users</h2>
          <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-stretch md:justify-center gap-8">
            {/* Profile Images Row (left, now horizontal) */}
            <div className="flex flex-row justify-center items-end gap-4 md:gap-8 md:pr-0 flex-shrink-0 w-full md:w-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`transition-all duration-300 flex flex-col items-center ${
                    index === currentTestimonial 
                      ? 'shadow-xl scale-110 bg-white border-2 border-[#014d98]' 
                      : 'opacity-60'
                  } rounded-3xl overflow-hidden w-20 h-20 md:w-32 md:h-32 cursor-pointer`}
                  style={{ minWidth: '5rem', minHeight: '5rem' }}
                  onClick={() => setCurrentTestimonial(index)}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-3xl"
                  />
                </div>
              ))}
            </div>
            {/* Testimonial Content (right) */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start min-w-[280px] md:min-w-[340px]">
              <div className="max-w-xl w-full bg-gradient-to-r from-[#014d98]/[.07] to-[#3ab7b1]/[.07] border border-[#014d98] rounded-2xl shadow-lg p-6 md:p-8 md:ml-0">
                <blockquote className="text-base md:text-xl text-gray-700 italic mb-6 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                </blockquote>
                <div className="font-semibold text-gray-900 text-base md:text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600 text-xs md:text-sm">
                  {testimonials[currentTestimonial].title}
                </div>
                {/* Navigation Arrows */}
                <div className="flex justify-start gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#014d98] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1] hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#014d98] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1] hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-20 bg-gradient-to-r from-[#014d98]/[.07] to-[#3ab7b1]/[.07] rounded-xl px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4">Meet the Team</h2>
            <p className="text-gray-600 text-lg">Behind QARBA is a diverse, passionate team of:</p>
          </div>
          {/* Team Grid - 4 identical Dr. Francis cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className="w-40 h-40 md:w-56 md:h-56 mx-auto overflow-hidden border-4 border-white shadow-lg bg-white flex items-end" style={{ borderRadius: '0 0 70px 0' }}>
                    <Image
                      src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1749026641/Franc_syeixd.jpg"
                      alt="Dr. Francis"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent text-lg mb-1">Dr. Francis</h3>
                <p className="text-gray-600 text-sm mb-3">Founder</p>
                {/* Social Media Icons */}
                <div className="flex justify-center gap-2">
                  <a href="#" className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded text-white flex items-center justify-center text-xs hover:opacity-90 transition">
                    {/* Facebook Icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded text-white flex items-center justify-center text-xs hover:opacity-90 transition">
                    {/* LinkedIn Icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded text-white flex items-center justify-center text-xs hover:opacity-90 transition">
                    {/* Instagram Icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.059-1.281.353-2.393 1.334-3.374.981-.981 2.093-1.275 3.374-1.334C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.981.981-1.275 2.093-1.334 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.353 2.393 1.334 3.374.981.981 2.093 1.275 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.353 3.374-1.334.981-.981 1.275-2.093 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.353-2.393-1.334-3.374-.981-.981-2.093-1.275-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
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