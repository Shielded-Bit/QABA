// pages/help-and-support.js
import Head from 'next/head';

export default function HelpAndSupport() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Help & Support - Estate Software</title>
        <meta name="description" content="Get help and support for your estate software. Find FAQs, contact support, and access resources." />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* FAQs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">How do I create a new property listing?</h3>
              <p className="mt-2 text-gray-600">To create a new property listing, go to the "Listings" section in your dashboard and click on "Add New Listing." Fill in the required details and submit.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">How can I edit my profile information?</h3>
              <p className="mt-2 text-gray-600">Navigate to the "Profile" section in your account settings. You can update your information and save the changes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">What payment methods are supported?</h3>
              <p className="mt-2 text-gray-600">We support credit/debit cards, PayPal, and bank transfers. You can manage your payment methods in the "Billing" section.</p>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">If you need further assistance, our support team is here to help.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Email Support</h3>
                <p className="text-gray-600">Email us at <a href="mailto:support@estatesoftware.com" className="text-blue-600 hover:underline">support@estatesoftware.com</a>.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Live Chat</h3>
                <p className="text-gray-600">Click the chat icon in the bottom right corner to start a live chat with our support team.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Phone Support</h3>
                <p className="text-gray-600">Call us at <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">User Guides</h3>
              <p className="mt-2 text-gray-600">Access our comprehensive user guides to learn how to use all features of the software.</p>
              <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Read More</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Video Tutorials</h3>
              <p className="mt-2 text-gray-600">Watch step-by-step video tutorials to get the most out of your estate software.</p>
              <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Watch Now</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Community Forum</h3>
              <p className="mt-2 text-gray-600">Join our community forum to connect with other users and share tips.</p>
              <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Join Now</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">&copy; {new Date().getFullYear()} Qaba. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}