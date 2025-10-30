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
            QARBA – Terms and Conditions
          </h1>
          <p className="mt-3 text-gray-600 text-base">Last updated: October 22, 2025</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <div className="prose max-w-none space-y-12">
            {/* Introduction */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to QARBA, a real estate technology platform that connects buyers, sellers, renters, and agents. By accessing or using our website, mobile app, or related services (&quot;Platform&quot;), you agree to comply with and be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform.
              </p>
            </section>

            {/* About QARBA */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About QARBA</h2>
              <p className="text-gray-600 leading-relaxed">
                QARBA provides real estate listings, property management tools, and digital services that facilitate transactions between Agents, Landlords and Clients (renter/buyers). We may not act as a real estate agent or broker and may not participate in direct property transactions between users. If at any point we are acting directly as an Agent, it will be explicitly made clear to both parties.
              </p>
            </section>

            {/* User Eligibility */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Eligibility</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>You must be at least 18 years old to use our services.</li>
                  <li>You must provide accurate, complete, and current information when creating an account.</li>
                  <li>Real estate agents or agencies must possess valid licenses as required by law. It is your responsibility to ensure you possess due licences before registering on our platform.</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</li>
                  <li>You must promptly report any unauthorized access or suspicious activity on your account.</li>
                </ul>
              </div>
            </section>

            {/* Property Listings & Transactions */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Listings & Transactions</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">I. Listing Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>All property information, images, and descriptions must be accurate, truthful, and up to date.</li>
                    <li>Listed properties must be legally available for sale, lease, or rent, as indicated.</li>
                    <li>Images and videos must represent the actual property and comply with copyright laws.</li>
                    <li>Prices must include all mandatory fees and charges.</li>
                    <li>Listing of fake property may lead to prosecution.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">II. Transaction Rules</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>All transactions conducted via the Platform must comply with applicable real estate laws.</li>
                    <li>QARBA is not responsible for any transactions or agreements made between users.</li>
                    <li>Users are encouraged to independently verify all property information, ownership, and legal documents.</li>
                    <li>Payment terms must be clearly stated within listings or user agreements, and be disclosed to Qarba.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. User Responsibilities</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">i. Account Usage</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Keep your profile information accurate and updated.</li>
                    <li>Maintain control of your account and do not share login details.</li>
                    <li>Report unauthorized use immediately.</li>
                    <li>Comply with all applicable laws and regulations while using QARBA.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ii. Prohibited Activities</h3>
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Post fraudulent, misleading, fake, or duplicate listings.</li>
                    <li>Harass, discriminate, or defraud other users.</li>
                    <li>Use automated systems to scrape, harvest, or manipulate listings.</li>
                    <li>Upload or share content that infringes copyright or intellectual property.</li>
                    <li>Use the Platform for illegal or prohibited activities.</li>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">i. Safety Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>It is your responsibility to verify properties and (other) users before physical meetings.</li>
                    <li>Use secure payment channels and avoid cash transactions (where possible).</li>
                    <li>Report suspicious users or listings via our support system.</li>
                    <li>Follow due safety protocols during property viewings, as much as possible, have someone accompanying you, and do not go to dodgy locations.</li>
                    <li>Do not meet at suspicious venues, and apply safety protocol.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ii. Content Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>No discriminatory, offensive, or defamatory content.</li>
                    <li>No false or deceptive advertising.</li>
                    <li>Respect intellectual property and privacy rights.</li>
                    <li>Maintain a professional and respectful tone in all communications.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Fees and Payments */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fees and Payments</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>QARBA may charge fees for certain services (e.g., subscription, premium listings, featured placements, or professional tools).</li>
                  <li>All fees are non-refundable unless otherwise stated in writing.</li>
                  <li>Payment terms, billing cycles, and applicable taxes are disclosed at the time of purchase. This may be subject to changes.</li>
                  <li>Subscription fees may be billed according to your selected plan.</li>
                  <li>Refunds and cancellations follow the policy provided in the applicable service agreement. Generally, a no refund policy apply.</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property Rights */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>All content, design elements, software, and trademarks on QARBA are the exclusive property of QARBA Properties.</li>
                  <li>You may not copy, reproduce, or distribute any content from the Platform without prior written permission.</li>
                  <li>You grant QARBA a non-exclusive, royalty-free license to display and promote your listings on the Platform and partner channels.</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
              <p className="text-gray-600 leading-relaxed">
                QARBA provides its services on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee that the Platform will be error-free, uninterrupted, or free of viruses. QARBA makes no warranties, express or implied, regarding the accuracy, reliability, or completeness of listings or other user-generated content. Nothing on this Platform constitutes legal, financial, or professional advice.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>To the maximum extent permitted by law, QARBA shall not be liable for any loss, damage, or claim arising from:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Errors or omissions in property information;</li>
                  <li>Transactions or disputes between users;</li>
                  <li>Interruption of service or technical issues;</li>
                  <li>Unauthorized access to your account or data.</li>
                  <li>Fraudulent or fake listings or transactions.</li>
                  <li>Other similar actions.</li>
                </ul>
                <p className="mt-3">In no event shall QARBA&apos;s total liability exceed the amount you paid directly to QARBA for any paid services.</p>
              </div>
            </section>

            {/* Indemnity */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Indemnity</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>You agree to indemnify and hold harmless QARBA, its affiliates, employees, and agents from any claims, damages, liabilities, or expenses arising out of your:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Violation of these Terms;</li>
                  <li>Misuse of the Platform; or</li>
                  <li>Violation of third-party rights, including intellectual property or privacy.</li>
                  <li>Carelessness or inability to duly verify listings, users, or the likes.</li>
                </ul>
              </div>
            </section>

            {/* Termination of Account */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Termination of Account</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>QARBA reserves the right to suspend or terminate your account for violations of these Terms or inappropriate behaviours.</li>
                  <li>Users may terminate their accounts at any time by written notice or through the platform&apos;s account settings.</li>
                  <li>Upon termination, your listings and associated data may be removed or retained per QARBA&apos;s data retention policy.</li>
                  <li>Termination does not affect any outstanding obligations or payments owed to QARBA or other users that you may be directly transacting with.</li>
                </ul>
              </div>
            </section>

            {/* Modification of Terms */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Modification of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                QARBA may update or modify these Terms at any time and without notice. Updates will be effective once published on our website. Continued use of the Platform after changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* Governing Law & Jurisdiction */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Governing Law & Jurisdiction</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of Nigerian courts.
              </p>
            </section>

            {/* Severability */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-600 leading-relaxed">
                If any provision of these Terms is found invalid or unenforceable by a court, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            {/* Contact Information */}
            <section className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#014d98] to-[#3ab7b1] rounded-full opacity-20"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions, complaints, or feedback regarding these Terms or our services, please contact us at: <a href="mailto:contact@qarba.com" className="text-[#014d98] hover:text-[#3ab7b1] underline">contact@qarba.com</a>, or via our website: <a href="https://www.qarba.com" target="_blank" rel="noopener noreferrer" className="text-[#014d98] hover:text-[#3ab7b1] underline">www.qarba.com</a>.
              </p>
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