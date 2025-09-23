import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 pt-20 px-2 sm:px-14 font-light">
      {/* Logo */}
      <div className="mx-auto md:justify-start mb-8">
        <h2 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">BUY</span>
          <span className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent"> HOMES</span>
        </h2>
      </div>

      {/* Main Footer Content */}
      <div
        className="footer-content mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] md:justify-between gap-8 md:gap-x-[20rem]"
      >
        {/* Links */}
        <div className="links grid grid-cols-2 md:grid-cols-4 gap-16 text-sm text-gray-700 justify-start">
          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about-us" className="hover:text-[#014d98]">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#014d98]">Contact Us</Link></li>
              <li><Link href="/buy" className="hover:text-[#014d98]">Buy Properties</Link></li>
              <li><Link href="/rent" className="hover:text-[#014d98]">Rent Properties</Link></li>
              <li><Link href="/blog" className="hover:text-[#014d98]">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-[#014d98]">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-[#014d98]">Home</Link>
              </li>
              <li>
                <Link href="/add-listing" className="hover:text-[#014d98]">Add Listing</Link>
              </li>
              <li>
                <Link href="/create-account" className="hover:text-[#014d98]">Become an Agent</Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-[#014d98]">Login</Link>
              </li>
              <li>
                <Link href="/create-account" className="hover:text-[#014d98]">Sign Up</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/help-support" className="hover:text-[#014d98]">Support</Link>
              </li>
              <li>
                <Link href="/dashboard/help-support" className="hover:text-[#014d98]">FAQs</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#014d98]">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#014d98]">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="font-bold mb-3">Connect with Us</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#014d98]">Social Media</a></li>
              <li><a href="#" className="hover:text-[#014d98]">Newsletter</a></li>
              <li><a href="#" className="hover:text-[#014d98]">Events</a></li>
              <li><a href="#" className="hover:text-[#014d98]">Webinars</a></li>
            </ul>
          </div> */}
        </div>

        {/* Subscription Section */}
        <div className="subscription flex flex-col">
          <h3 className="font-bold mb-3">Subscribe to Updates</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Stay informed about the latest listings and offers.
          </p>
          <div className="flex items-center mb-2">
            <input
              type="email"
              placeholder="Your Email Here"
              className="border rounded-lg px-4 py-2 text-sm focus:ring focus:ring-[#014d98]/30 focus:outline-none mr-2"
            />
            <button className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500">
            We respect your privacy.{" "}
            <Link href="/privacy-policy" className="underline text-[#014d98] hover:text-[#3ab7b1]">
              Read our Privacy Policy.
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mx-auto mt-16 mb-8 border-t pt-4 px-0 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        <p>© 2024 All Rights Reserved</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border border-[#014d98]/20 hover:border-[#014d98] transition-colors">
            <FaFacebookF className="text-[#014d98]" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border border-[#014d98]/20 hover:border-[#014d98] transition-colors">
            <FaInstagram className="text-[#014d98]" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border border-[#014d98]/20 hover:border-[#014d98] transition-colors">
            <FaTwitter className="text-[#014d98]" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border border-[#014d98]/20 hover:border-[#014d98] transition-colors">
            <FaLinkedin className="text-[#014d98]" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

