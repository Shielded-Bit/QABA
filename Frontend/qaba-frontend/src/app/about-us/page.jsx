'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    { 
      name: 'Dr. Francis Nwebonyi', 
      role: 'Founder & CEO',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/e8dc205f3764aa41b240407b18fbb838a8c95bd2_f4ttue.jpg'
    },
    { 
      name: 'Augustine Anwuchie', 
      role: 'Project Manager',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/970bf03ef57fbac492292cc1a01e963241b37072_vix0yn.jpg'
    },
    { 
      name: 'Barr Obinna Nwali', 
      role: 'Legal Advisor',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/2ff7e6829479d3f2711230609d728a4fdf38b10b_n1appd.jpg'
    },
    { 
      name: 'Ngozi Paschaline', 
      role: 'Director of Communications',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/686fdc43b680eb6988d2d5e9c657c1b8f4e7f95a_tme9hx.jpg'
    },
    { 
      name: 'Steve Tylor', 
      role: 'Strategic Advisor',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/b9aa07f09a65f1983c484e5a566e48d7faf18755_idzalw.jpg'
    },
    { 
      name: 'Dr Elias Eze', 
      role: 'Consultant',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752834634/991b8383b25dc6b783b37dcc5ed08e4766490a9c_ce8zbo.png'
    },
    { 
      name: 'Michael Nwogha', 
      role: 'Backend Engineer',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831217/dc493f7f71fe86d94e2fea23918fba8ff651b9db_n2krvq.jpg'
    },
    { 
      name: 'Godwin Chisom .H.', 
      role: 'Frontend Engineer',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/1268bddf6bc58f2b5a398c774813568726601444_xjzhio.jpg'
    },
    { 
      name: 'Onuorah Victor .M.', 
      role: 'Product Designer',
      image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1752831216/ea487a1f5cf357adc16c7720a78b83d8c3c4acb1_eaupxr.jpg'
    }
  ];

  const [counters, setCounters] = useState({
    properties: 0,
    customers: 0,
    successRate: 0,
    support: 0
  });
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const teamCarouselRef = useRef(null);

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

  // Manual scroll team carousel (auto-scroll disabled)



  // Manual navigation for team carousel
  const handleTeamNavigation = (direction) => {
    const cardWidth = 320; // Card width + gap
    const container = teamCarouselRef.current;
    if (!container) return;

    if (direction === 'prev') {
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      setCurrentTeamIndex(prev => Math.max(0, prev - 1));
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      setCurrentTeamIndex(prev => Math.min(teamMembers.length - 1, prev + 1));
    }
  };



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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-14">
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
        <div className="w-full relative">
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
        <div className="px-4 sm:px-6 lg:px-14">
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

      <div className="px-4 sm:px-6 lg:px-14 py-16">
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
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167908/4744e3fba07a6711d66f357c1757555c8306b0a3_ftxspq.jpg"
                    alt="Future of real estate"
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

          {/* Vision Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center mt-20">
            {/* Vision Content */}
            <motion.div 
              className="space-y-4"
              variants={fadeInUp}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4"
                variants={fadeInUp}
              >
                Our Vision
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-base md:text-lg leading-relaxed"
                variants={fadeInUp}
              >
                To become Nigeria&apos;s most trusted digital real estate platform, revolutionizing how people buy, 
                sell, and rent properties through innovative technology and unwavering commitment to transparency 
                and customer satisfaction.
              </motion.p>
            </motion.div>

            {/* Vision Image */}
            <motion.div 
              className="relative overflow-visible"
              variants={fadeInUp}
            >
              <motion.div 
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-[#3ab7b1] to-[#014d98] rounded-2xl"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-80 relative">
                  <Image
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/711132722f7d555237a57c3105c2ffb89aeb58f8_utfmok.jpg"
                    alt="Modern real estate vision"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="absolute top-1/2 -left-6 md:left-0 transform -translate-y-1/2 md:-translate-x-12 bg-white p-3 rounded-xl shadow-lg z-20"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-24 h-32 md:w-28 md:h-36 relative rounded-lg overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167908/4744e3fba07a6711d66f357c1757555c8306b0a3_ftxspq.jpg"
                    alt="Future of real estate"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>



  
{/* Meet the Team Section */}
<motion.div 
  ref={teamRef}
  className="mb-16 py-12 w-full overflow-hidden"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={staggerChildren}
>
  <motion.div 
    className="text-center mb-8"
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
      Behind QARBA is a diverse and passionate team of experts
    </motion.p>
  </motion.div>

  {/* Carousel Container */}
  <div className="relative">
    {/* Navigation Arrows */}
    <button 
      onClick={() => handleTeamNavigation('prev')}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
      aria-label="Previous team members"
    >
      <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button 
      onClick={() => handleTeamNavigation('next')}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
      aria-label="Next team members"
    >
      <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>



    {/* Scrollable Container */}
    <div 
      ref={teamCarouselRef}
      className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbar: { display: 'none' }
      }}
    >
      {teamMembers.map((member, index) => (
        <motion.div 
          key={index}
          className="flex-none w-72 text-center p-4 group"
          variants={scaleIn}
          whileHover={{ y: -10 }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}

        >
          <motion.div 
            className="mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-48 h-48 mx-auto overflow-hidden border-4 border-white shadow-lg bg-white"
              style={{ borderRadius: '0 0 60px 0' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Name and LinkedIn on same row */}
          <motion.div 
            className="flex items-center justify-center mb-1"
            variants={fadeInUp}
          >
            <motion.h3 
              className="font-bold text-gray-900 text-base text-center"
              variants={fadeInUp}
            >
              {member.name}
            </motion.h3>
            
            <motion.a
              href="#"
              className="w-6 h-6 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-md text-white flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all duration-300 flex-shrink-0 ml-3"
              whileHover={{ scale: 1.15, rotate: 3 }}
              variants={scaleIn}
              aria-label={`Connect with ${member.name} on LinkedIn`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 text-sm mb-3"
            variants={fadeInUp}
          >
            {member.role}
          </motion.p>
        </motion.div>
      ))}
    </div>

    {/* Scroll Indicators */}
    <div className="flex justify-center mt-8 gap-2">
      {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map((_, index) => (
        <button
          key={index}
          onClick={() => {
            const container = teamCarouselRef.current;
            if (container) {
              container.scrollTo({ left: index * 960, behavior: 'smooth' });
              setCurrentTeamIndex(index * 3);
            }
          }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            Math.floor(currentTeamIndex / 3) === index 
              ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] scale-125' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to team members ${index * 3 + 1}-${Math.min((index + 1) * 3, teamMembers.length)}`}
        ></button>
      ))}
    </div>

  </div>

  {/* Additional CSS for hiding scrollbar */}
  <style jsx>{`
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `}</style>
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
    </div>
  );
};

export default AboutPage;