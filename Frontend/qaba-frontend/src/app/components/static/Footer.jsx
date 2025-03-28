import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 pt-20 px-2 sm:px-14 font-light">
      {/* Logo */}
      <div className="mx-auto md:justify-start mb-8">
        <h2 className="text-2xl font-bold text-blue-600">
          BUY<span className="text-teal-500">HOMES</span>
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
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Properties</a></li>
              <li><a href="#" className="hover:text-blue-500">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-500">Home</a></li>
              <li><a href="#" className="hover:text-blue-500">Properties</a></li>
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500">Terms of Condition</a></li>
              <li><a href="#" className="hover:text-blue-500">Support</a></li>
              <li><a href="#" className="hover:text-blue-500">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Connect with Us</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-500">Social Media</a></li>
              <li><a href="#" className="hover:text-blue-500">Newsletter</a></li>
              <li><a href="#" className="hover:text-blue-500">Events</a></li>
              <li><a href="#" className="hover:text-blue-500">Webinars</a></li>
            </ul>
          </div>
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
              className="border rounded-lg px-4 py-2 text-sm focus:ring focus:ring-blue-300 focus:outline-none mr-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500">
            We respect your privacy.{" "}
            <a href="#" className="underline text-blue-600">
              Read our Privacy Policy.
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mx-auto mt-16 mb-8 border-t pt-4 px-0 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        <p>© 2024 All Rights Reserved</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border">
            <FaFacebookF className="text-blue-600" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border">
            <FaInstagram className="text-pink-500" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border">
            <FaTwitter className="text-blue-400" />
          </a>
          <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full border">
            <FaLinkedin className="text-blue-700" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

