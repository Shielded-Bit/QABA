"use client";

import ProtectedRoute from "../agent-dashboard/components/ProtectedRoute";
import Sidebar from "./components/sidebar";
import Header1 from "./components/header1";
import { NotificationProvider } from "../../contexts/NotificationContext";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <NotificationProvider>
        <div className="min-h-screen bg-slate-50/30 font-manrope flex flex-col">
          {/* Header - Global */}
          <header className="sticky top-0 z-40">
            <Header1 />
          </header>

          {/* Main Content Area */}
          <div className="flex flex-1">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Main Content - Adjust margin based on sidebar state */}
            <main 
              className="flex-1 min-w-0 transition-all duration-300 ease-in-out overflow-y-auto bg-slate-50/30 p-0 lg:p-2"
              style={{ 
                marginLeft: isDesktop ? 'var(--sidebar-width, 64px)' : '0px' 
              }}
            >
              <div className="bg-white font-manrope w-full h-full mx-auto rounded-none lg:rounded-2xl shadow-sm p-0.5 lg:p-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
