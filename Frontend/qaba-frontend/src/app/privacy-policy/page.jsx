'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
            Privacy Policy & Terms
          </h1>
          <p className="mt-3 text-gray-600 text-base">Last updated: July 17, 2025</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <div className="prose max-w-none space-y-12">
            {/* Terms Sections */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of our Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By visiting the website, viewing, accessing or otherwise using any of the services or information created, collected, compiled or submitted to QARBA, you agree to be bound by these Terms and Conditions of Service. If you do not want to be bound by our Terms then do not use our services. These Terms constitute a legally binding agreement between you and QARBA, and your use shall indicate your conclusive acceptance of this agreement.
              </p>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Provision of Services</h2>
              <p className="text-gray-600 leading-relaxed">
                You acknowledge that we are entitled to modify, improve, or discontinue any of our services at our sole discretion and without notice to you. Furthermore, you agree that we are entitled to provide services to you through subsidiaries or affiliated entities.
              </p>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Collection & Cookies</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Comments and Media</h3>
                  <p className="mb-3">
                    When you interact with our site, we collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Data shown in comment forms</li>
                    <li>Your IP address for security</li>
                    <li>Browser user agent string</li>
                    <li>Profile pictures through Gravatar (if applicable)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Cookie Usage</h3>
                  <p className="mb-3">Our cookies serve the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Saving your preferences (1 year duration)</li>
                    <li>Maintaining login sessions (2 days)</li>
                    <li>Remember Me functionality (2 weeks)</li>
                    <li>Screen display preferences (1 year)</li>
                    <li>Comment functionality</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Your Data Rights</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>As a user, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Request an export of your personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Access and edit your profile information</li>
                  <li>Opt-out of non-essential data collection</li>
                </ul>
              </div>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                We shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages. This includes damages for loss of profits, business interruption, business reputation or goodwill, loss of data, or other intangible losses arising from your use of our services.
              </p>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. External Content</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may include hyperlinks to third-party content, advertising, or websites. You acknowledge that we are not responsible for and do not endorse any advertising, products, or resources available from such external sources.
              </p>
            </section>

            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms from time to time at our sole discretion and without notice. Changes become effective immediately upon posting, and your continued use signifies acceptance of these changes.
              </p>
            </section>

            {/* Contact Section with Modern Card Design */}
            <section className="mt-16">
              <div className="bg-gradient-to-r from-[#014d98]/5 to-[#3ab7b1]/5 rounded-2xl p-8 border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Questions About Our Privacy Policy?</h2>
                  <p className="text-gray-600 max-w-2xl leading-relaxed">
                    We&apos;re here to help! If you have any questions about our privacy policy or how we handle your data, our support team is ready to assist you.
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