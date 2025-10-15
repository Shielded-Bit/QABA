"use client";

import { useState, useEffect } from 'react';
import Navbar from "./components/static/Navbar";
import Footer from "./components/static/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "../contexts/ProfileContext";
import { PropertiesCacheProvider } from "../contexts/PropertiesCacheContext";
import { ListingTypeCacheProvider } from "../contexts/ListingTypeCacheContext";
import { LandingPageCacheProvider } from "../contexts/LandingPageCacheContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import useTokenRefresh from "../hooks/useTokenRefresh";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // ✅ PROACTIVE TOKEN REFRESH: Automatically refreshes tokens 5 minutes before expiry
  // This prevents "Authorization error" by keeping users logged in seamlessly
  useTokenRefresh();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavAndFooter = pathname.startsWith("/dashboard") || pathname.startsWith("/agent-dashboard");

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <ProfileProvider>
        <PropertiesCacheProvider>
          <ListingTypeCacheProvider>
            <LandingPageCacheProvider>
              <div suppressHydrationWarning>
                <div className="max-w-[2000px] mx-auto">
                  {mounted && !hideNavAndFooter && <Navbar />}
                  <div className="main-content">
                    {mounted && children}
                  </div>
                  {mounted && !hideNavAndFooter && <Footer />}
                </div>

                {/* WhatsApp Widget - Available on all pages */}
                {mounted && <WhatsAppWidget />}
              </div>
            </LandingPageCacheProvider>
          </ListingTypeCacheProvider>
        </PropertiesCacheProvider>
      </ProfileProvider>
    </GoogleOAuthProvider>
  );
}
