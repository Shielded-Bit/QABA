"use client"; // Ensures the component is a client component

import './globals.css'; // Import Tailwind's global styles
import Navbar from './components/static/Navbar';
import Footer from './components/static/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Detect current path

  // Hide Navbar and Footer for all '/dashboard' routes and subpaths
  const hideNavAndFooter = pathname.startsWith('/dashboard') || pathname.startsWith('/agent-dashboard');


  return (
    <html lang="en"> {/* Include the <html> tag */}
      <head>
        {/* Metadata-related tags can go here */}
      </head>
      <body className="bg-background text-foreground"> {/* Include the <body> tag */}
        {!hideNavAndFooter && <Navbar />}
        <main>{children}</main>
        {!hideNavAndFooter && <Footer />}
      </body>
    </html>
  );
}
