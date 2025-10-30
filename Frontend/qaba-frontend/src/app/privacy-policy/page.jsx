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
            QARBA Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 text-base">Last updated: October 17, 2025</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <div className="prose max-w-none space-y-12">
            {/* Introduction */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                QARBA Properties (&quot;QARBA,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operate the QARBA website and mobile application (collectively, the &quot;Platform&quot;) as a real estate technology service that connects buyers, sellers, renters, and agents.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This Privacy Policy describes how we collect, use, disclose, and protect your information when you use our Platform. By accessing or using QARBA, you agree to the terms of this Privacy Policy. If you do not agree, please do not proceed with using the Platform.
              </p>
            </section>

            {/* Section 1 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>We collect different types of information to provide and improve our services:</p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">a. Personal Information</h3>
                  <p className="mb-3">When you create an account or use certain features, we may collect:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Full name, email address, and phone number</li>
                    <li>Profile information (e.g., agency name, professional license, or company details)</li>
                    <li>Property details, descriptions, and uploaded media (images/videos/documents)</li>
                    <li>Location data, and/or payment or financial related information, where applicable</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">b. Usage and Log Data</h3>
                  <p className="mb-3">When you use QARBA, we may automatically collect:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>IP address and device identifiers</li>
                    <li>Browser type and operating system</li>
                    <li>Pages viewed, actions performed, and time spent on the Platform</li>
                    <li>Access times, dates, location data, and referring URLs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">c. Cookies and Tracking Technologies</h3>
                  <p className="mb-3">QARBA and our partners may use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Recognize returning users</li>
                    <li>Improve performance and user experience</li>
                    <li>Deliver personalized content and advertisements</li>
                  </ul>
                  <p className="mt-3 text-sm">You can manage or disable cookies through your browser settings, but doing so may affect certain features of the Platform.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We use collected data to:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Provide, maintain, and improve our Platform and services</li>
                  <li>Facilitate property listings, communications, and transactions</li>
                  <li>Verify user identity and prevent fraudulent activity</li>
                  <li>Customize user experience and recommendations</li>
                  <li>Communicate updates, promotions, or service-related information</li>
                  <li>Comply with legal obligations and enforce our Terms and Conditions</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We do not sell or rent your personal data. However, we may share your information under these limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li><strong>With Service Providers:</strong> Trusted third-party vendors that assist in hosting, analytics, payment processing, or marketing.</li>
                  <li><strong>With Other Users:</strong> When you interact on the Platform (e.g., viewing listings or contacting an agent).</li>
                  <li><strong>For Legal Reasons:</strong> If required by law, regulation, or court order.</li>
                  <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of company assets.</li>
                </ul>
                <p className="mt-3">All third parties are obligated to use your information solely for the services they perform for QARBA.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain personal information as long as your account is active or as necessary to provide services and comply with legal obligations. You may request deletion of your data by contacting contact@qarba.com, subject to applicable retention policies or laws.
              </p>
            </section>

            {/* Section 5 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate administrative, technical, and physical measures to protect your data. However, please note that no online system is a 100% secure, and we cannot guarantee absolute protection against unauthorized access.
              </p>
            </section>

            {/* Section 6 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>QARBA may use or link to third-party tools and services such as:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Google Analytics</li>
                  <li>Facebook Business Tools</li>
                </ul>
                <p className="mt-3">These third parties may collect data as described in their respective privacy policies. We encourage you to review their policies for more details.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Links to External Websites</h2>
              <p className="text-gray-600 leading-relaxed">
                Our Platform may contain links to third-party websites. QARBA is not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* Section 8 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                QARBA does not knowingly collect or process data from individuals under the age of 18. If we discover that we have inadvertently collected personal data from a minor, we will promptly delete it. Parents or guardians may contact contact@qarba.com to request removal.
              </p>
            </section>

            {/* Section 9 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Your Rights</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Access, correct, or delete your personal information</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Request data portability or restriction of processing</li>
                </ul>
                <p className="mt-3">To exercise these rights, please contact us at contact@qarba.com</p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy periodically, and without (prior) notice. When we do, the updated version will be posted on this page with a revised date of update. Significant changes may be communicated via email or in-app notification.
              </p>
            </section>

            {/* Section 11 - Contact */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions, concerns, or complaints regarding this Privacy Policy or our data practices, please contact us at <a href="mailto:contact@qarba.com" className="text-[#014d98] hover:text-[#3ab7b1] underline">contact@qarba.com</a> or via our website: <a href="https://www.qarba.com" target="_blank" rel="noopener noreferrer" className="text-[#014d98] hover:text-[#3ab7b1] underline">www.qarba.com</a>.
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