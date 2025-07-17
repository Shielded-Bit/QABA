"use client";

import "./globals.css";
import Navbar from "./components/static/Navbar";
import Footer from "./components/static/Footer";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "../contexts/ProfileContext";
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavAndFooter = pathname.startsWith("/dashboard") || pathname.startsWith("/agent-dashboard");

  // Prevent hydration issues by not rendering until client-side
  if (!mounted) {
    return (
      <html lang="en">
        <head>
          {/* Metadata-related tags can go here */}
        </head>
        <body className="bg-background text-foreground">
          <div style={{ visibility: 'hidden' }}>{children}</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        {/* Metadata-related tags can go here */}
      </head>
      <body className="bg-background text-foreground">
        <ProfileProvider> {/* 👈 Wrap the entire app */}
          {!hideNavAndFooter && <Navbar />}
          <main>{children}</main>
          {!hideNavAndFooter && <Footer />}
        </ProfileProvider>
      </body>
    </html>
  );
}
