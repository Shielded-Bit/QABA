"use client";

import { useState, useEffect } from 'react';
import Navbar from "./components/static/Navbar";
import Footer from "./components/static/Footer";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "../contexts/ProfileContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavAndFooter = pathname.startsWith("/dashboard") || pathname.startsWith("/agent-dashboard");

  return (
    <ProfileProvider>
      <div suppressHydrationWarning style={!mounted ? { visibility: 'hidden' } : undefined}>
        {mounted && !hideNavAndFooter && <Navbar />}
        <div className="main-content">
          {mounted && children}
        </div>
        {mounted && !hideNavAndFooter && <Footer />}
      </div>
    </ProfileProvider>
  );
}
