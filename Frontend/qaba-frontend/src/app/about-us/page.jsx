'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const AboutPage = () => {
  const [counters, setCounters] = useState({
    properties: 0,
    customers: 0,
    successRate: 0,
    support: 0
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isMissionInView = useInView(missionRef, { once: true });
  const isTeamInView = useInView(teamRef, { once: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

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
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload_v1749026641/Franc_syeixd.jpg"
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Banner Section */}
      <motion.div 
        ref={heroRef}
        className="relative bg-gradient-to-b from-gray-50 to-white py-12 md:py-16"
        style={{ opacity: heroOpacity, scale: heroScale }}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        {/* Background Pattern */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23014d98' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </motion.div>
        <div className="w-full mx-auto px-4 md:px-16 max-w-7xl relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-[#014d98] font-medium">About QARBA</p>
              </motion.div>
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-6 leading-tight"
                variants={fadeInUp}
              >
                Your Trusted Partner in Nigerian Real Estate
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg leading-relaxed"
                variants={fadeInUp}
              >
                At QARBA, we&apos;re revolutionizing property transactions across Nigeria through innovation, transparency, and exceptional service. Our platform connects property seekers with their perfect spaces and helps property owners reach the right audience.
              </motion.p>
            </motion.div>
            
            {/* Right Side with Images */}
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/711132722f7d555237a57c3105c2ffb89aeb58f8_utfmok.jpg"
                  alt="Modern residential neighborhood"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative w-40 h-40">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">QARBA</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        ref={statsRef} 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries({
              'Listed Properties': [counters.properties, 'K+'],
              'Happy Customers': [counters.customers, 'K+'],
              'Success Rate': [counters.successRate, '%'],
              'Support Hours': [counters.support, '/7']
            }).map(([label, [value, suffix]], index) => (
              <motion.div 
                key={label}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 hover:shadow-lg transition-shadow"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-[#014d98] mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {formatNumber(value, suffix)}
                </motion.div>
                <div className="text-gray-600">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Core Values Section */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-6"
            variants={fadeInUp}
          >
            Our Core Values
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-12"
            variants={staggerChildren}
          >
            {[
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Trust & Security",
                description: "We prioritize the security of your transactions and personal information above all else."
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Innovation",
                description: "We continuously evolve our platform to provide cutting-edge solutions for property transactions."
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Customer First",
                description: "Your satisfaction drives every decision we make and every feature we develop."
              }
            ].map((value, index) => (
              <motion.div 
                key={value.title}
                className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg className="w-8 h-8 text-[#014d98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value.icon} />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mission & Vision Sections */}
        <motion.div 
          ref={missionRef}
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            {/* Mission Image */}
            <motion.div 
              className="relative overflow-visible col-start-1 row-start-2 md:row-start-1 md:col-start-1"
              variants={fadeInUp}
            >
              <motion.div 
                className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-80 relative">
                  <Image
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167908/4744e3fba07a6711d66f357c1757555c8306b0a3_ftxspq.jpg"
                    alt="Modern residential neighborhood"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="absolute top-1/2 -right-6 md:right-0 transform -translate-y-1/2 md:translate-x-12 bg-white p-3 rounded-xl shadow-lg z-20"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-24 h-32 md:w-28 md:h-36 relative rounded-lg overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/75e38b33199d3659e9dafaf019ce76d1eaadc7e6_ica1ok.jpg"
                    alt="Aerial view of properties"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Mission Content */}
            <motion.div 
              className="space-y-4 col-start-1 row-start-1 md:col-start-2 md:row-start-1"
              variants={fadeInUp}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4"
                variants={fadeInUp}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-base md:text-lg leading-relaxed"
                variants={fadeInUp}
              >
                To simplify real estate transactions by creating a transparent, secure, and user-friendly digital 
                environment for property buyers, renters, and sellers in Nigeria.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="mb-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-16"
            variants={fadeInUp}
          >
            Hear From Our Users
          </motion.h2>
          <motion.div 
            className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-stretch md:justify-center gap-8"
            variants={staggerChildren}
          >
            {/* Profile Images Row */}
            <motion.div 
              className="flex flex-row justify-center items-end gap-4 md:gap-8 md:pr-0 flex-shrink-0 w-full md:w-auto"
              variants={staggerChildren}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className={`transition-all duration-300 flex flex-col items-center ${
                    index === currentTestimonial 
                      ? 'shadow-xl scale-110 bg-white border-2 border-[#014d98]' 
                      : 'opacity-60'
                  } rounded-3xl overflow-hidden w-20 h-20 md:w-32 md:h-32 cursor-pointer`}
                  style={{ minWidth: '5rem', minHeight: '5rem' }}
                  onClick={() => setCurrentTestimonial(index)}
                  whileHover={{ scale: index === currentTestimonial ? 1.1 : 1.05 }}
                  variants={scaleIn}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-3xl"
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Testimonial Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTestimonial}
                className="flex-1 flex flex-col justify-center items-center md:items-start min-w-[280px] md:min-w-[340px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="max-w-xl w-full bg-gradient-to-r from-[#014d98]/[.07] to-[#3ab7b1]/[.07] border border-[#014d98] rounded-2xl shadow-lg p-6 md:p-8 md:ml-0"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.blockquote 
                    className="text-base md:text-xl text-gray-700 italic mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </motion.blockquote>
                  <motion.div 
                    className="font-semibold text-gray-900 text-base md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {testimonials[currentTestimonial].name}
                  </motion.div>
                  <motion.div 
                    className="text-gray-600 text-xs md:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {testimonials[currentTestimonial].title}
                  </motion.div>
                  
                  {/* Navigation Arrows */}
                  <motion.div 
                    className="flex justify-start gap-4 mt-8"
                    variants={staggerChildren}
                  >
                    <motion.button
                      onClick={prevTestimonial}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#014d98] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={nextTestimonial}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#014d98] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Meet the Team Section */}
        <motion.div 
          ref={teamRef}
          className="mb-20 bg-gradient-to-r from-[#014d98]/[.07] to-[#3ab7b1]/[.07] rounded-xl px-4 md:px-8 py-16 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4"
              variants={fadeInUp}
            >
              Meet the Team
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-lg"
              variants={fadeInUp}
            >
              Behind QARBA is a diverse, passionate team of:
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={staggerChildren}
          >
            {[1, 2, 3, 4].map((index) => (
              <motion.div 
                key={index}
                className="text-center p-2 md:p-4"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="mb-3 md:mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-32 h-32 md:w-56 md:h-56 mx-auto overflow-hidden border-4 border-white shadow-lg bg-white flex items-end"
                    style={{ borderRadius: '0 0 50px 0' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dqbbm0guw/image/upload_v1749026641/Franc_syeixd.jpg"
                      alt="Dr. Francis"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent text-base md:text-lg mb-1"
                  variants={fadeInUp}
                >
                  Dr. Francis
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3"
                  variants={fadeInUp}
                >
                  Founder
                </motion.p>
                <motion.div 
                  className="flex justify-center gap-1 md:gap-2"
                  variants={staggerChildren}
                >
                  {['facebook', 'linkedin', 'instagram'].map((social, i) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded text-white flex items-center justify-center text-xs hover:opacity-90 transition"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      variants={scaleIn}
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                        {/* Facebook Icon */}
                        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                      </svg>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-6"
            variants={fadeInUp}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            variants={fadeInUp}
          >
            Join thousands of satisfied users who have found their perfect property through QARBA.
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center"
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <Link 
                href="/buy" 
                className="inline-block px-8 py-3 bg-[#014d98] text-white rounded-lg hover:bg-[#013d78] transition-colors"
              >
                Browse Properties
              </Link>
            </motion.div>
            <motion.div variants={scaleIn}>
              <Link 
                href="/contact" 
                className="inline-block px-8 py-3 bg-white border-2 border-[#014d98] text-[#014d98] rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;