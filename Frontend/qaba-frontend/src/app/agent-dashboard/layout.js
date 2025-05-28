"use client";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar";
import Header1 from "./components/header1"; // Import Header1
import { NotificationProvider } from "../../contexts/NotificationContext";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["AGENT"]}>
      <NotificationProvider>
        <div className="flex h-screen">
          {/* Sidebar - Static and Persistent */}
          <aside className="lg:w-60 shadow-md">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - Global */}
            <header className="shadow-md">
              <Header1 />
            </header>

            {/* Main Content - Dynamic */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
