"use client";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar";
import Header1 from "./components/header1"; // Import Header1
import { NotificationProvider } from "../../contexts/NotificationContext";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["AGENT", "LANDLORD"]}>
      <NotificationProvider>
        <div className="flex h-screen">
          {/* Sidebar - Fixed positioning for all screen sizes */}
          <Sidebar />

          {/* Main Content - Adjust margin based on sidebar state */}
          <div className="flex-1 flex flex-col overflow-hidden ml-16 lg:ml-64">
            {/* Header - Global */}
            <header className="shadow-md">
              <Header1 />
            </header>

            {/* Main Content - Dynamic - Remove padding to allow precise alignment */}
            <main className="flex-1 overflow-y-auto bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
