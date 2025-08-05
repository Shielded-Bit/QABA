'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-600 text-base">Last updated: July 17, 2025</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <div className="prose max-w-none space-y-12">
            {/* Platform Usage Section */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Usage Agreement</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  By accessing and using QARBA&apos;s real estate platform, you agree to comply with and be bound by these terms and conditions. Our platform provides real estate listings, property management tools, and related services for buyers, sellers, renters, and property agents.
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">User Eligibility</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You must provide accurate and truthful information when creating an account</li>
                    <li>Agents must possess valid real estate licenses where required by law</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Property Listings Section */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Listings & Transactions</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Listing Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>All property listings must be accurate and current</li>
                    <li>Properties must be legally available for sale or rent</li>
                    <li>Images must be authentic and represent the actual property</li>
                    <li>Pricing information must be accurate and include all mandatory fees</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Transaction Rules</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>All transactions must comply with local real estate laws</li>
                    <li>QARBA is not responsible for transactions between users</li>
                    <li>Users must verify all property information independently</li>
                    <li>Payment terms must be clearly stated in listings</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Usage</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Maintain accurate profile information</li>
                    <li>Protect account credentials</li>
                    <li>Report unauthorized access immediately</li>
                    <li>Use the platform in compliance with all applicable laws</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Posting fraudulent listings or false information</li>
                    <li>Harassing or discriminating against other users</li>
                    <li>Attempting to manipulate platform features or rankings</li>
                    <li>Using the platform for any illegal activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Platform Rules & Safety */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Rules & Safety</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Safety Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Verify identities before meeting in person</li>
                    <li>Use secure payment methods</li>
                    <li>Report suspicious activities</li>
                    <li>Follow recommended safety protocols for property viewings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>No discriminatory or offensive content</li>
                    <li>No misleading or false advertising</li>
                    <li>Respect copyright and intellectual property rights</li>
                    <li>Maintain professional communication standards</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Fees & Payments */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fees & Payments</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  QARBA may charge fees for certain services, including but not limited to premium listings, featured properties, and professional tools. All fees are non-refundable unless otherwise stated.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Payment terms are specified at the time of purchase</li>
                  <li>Users are responsible for all applicable taxes</li>
                  <li>Subscription fees are billed according to the selected plan</li>
                  <li>Cancellation policies apply as specified in service agreements</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Termination</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  QARBA reserves the right to suspend or terminate accounts that violate these terms or engage in inappropriate behavior. Users may also terminate their accounts at any time.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Violations may result in immediate account suspension</li>
                  <li>Users will be notified of any account actions</li>
                  <li>Appeal processes are available for disputed terminations</li>
                  <li>Account data retention policies apply post-termination</li>
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mt-16">
              <div className="bg-gradient-to-r from-[#014d98]/5 to-[#3ab7b1]/5 rounded-2xl p-8 border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
                  <p className="text-gray-600 max-w-2xl leading-relaxed">
                    If you have any questions about our terms and conditions or need clarification, our support team is here to help.
                  </p>
                  <Link 
                    href="/contact" 
                    className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}