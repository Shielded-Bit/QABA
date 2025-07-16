"use client";

import React from "react";
import Link from "next/link";
import { Wrench, MessageCircle, Building2, ListChecks, Calendar, BarChart3 } from "lucide-react";
import Image from "next/image";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const ManageComingSoon = () => {
  const upcomingFeatures = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Let us handle your property portfolio with professional care and attention to detail."
    },
    {
      icon: ListChecks,
      title: "Listing Services",
      description: "We'll create, manage, and optimize your property listings for maximum visibility."
    },
    {
      icon: Calendar,
      title: "Scheduling & Maintenance",
      description: "We'll coordinate viewings, handle maintenance requests, and manage tenant relations."
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Get regular updates on your property performance, occupancy rates, and revenue."
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-12 relative">
      <Image
        src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
        alt="Manage Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full z-0 opacity-20"
        priority
      />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-4">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
            Let Us Manage Your Properties
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Focus on your investments while we handle the day-to-day management of your properties. Our team is here to help!
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {upcomingFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to get started?</h2>
          <p className="text-gray-600 mb-4">
            Contact us today to discuss how we can help manage your properties effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-medium hover:opacity-90 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Message Us
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageComingSoon;
