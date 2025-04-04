"use client";

import "./globals.css";
import Navbar from "./components/static/Navbar";
import Footer from "./components/static/Footer";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "../contexts/ProfileContext"; // 👈 Import ProfileProvider

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname.startsWith("/dashboard") || pathname.startsWith("/agent-dashboard");

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
