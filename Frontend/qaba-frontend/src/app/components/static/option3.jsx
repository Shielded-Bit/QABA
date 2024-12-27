import Link from 'next/link';

{/* Mobile Dropdown Menu */}
<div
  className={`md:hidden pl-3 bg-gradient-to-b from-[rgb(246,246,246)] to-[rgb(203,228,221)] h-auto overflow-hidden transform transition-all duration-500 ${
    menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-5"
  }`}
>
  <ul
    className={`grid grid-cols-2 gap-4 p-4 text-gray-800 text-left transform transition-all duration-500 ${
      menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
    }`}
  >
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/buy"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        Buy
      </Link>
    </li>
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/rent"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        Rent
      </Link>
    </li>
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/add-listing"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        Add Listing
      </Link>
    </li>
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/landlord-agent"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        Landlord / Agent
      </Link>
    </li>
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/about-us"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        About Us
      </Link>
    </li>
    <li className="transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href="/blog"
        className="hover:text-teal-700"
        onClick={() => setMenuOpen(false)}
      >
        Blog
      </Link>
    </li>
  </ul>

  <div className="flex flex-col items-center space-y-2 p-4">
    <Link
      href="/sign-in"
      className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98]"
      onClick={() => setMenuOpen(false)}
    >
      Sign In
    </Link>
  </div>
</div>
