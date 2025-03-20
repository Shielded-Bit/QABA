"use client";

import ProtectedRoute from "../agent-dashboard/components/ProtectedRoute";
import Sidebar from "./components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <div className="flex">
        {/* Sidebar - Static and Persistent */}
        <aside className="lg:w-60 shadow-md">
          <Sidebar />
        </aside>

        {/* Main Content - Dynamic Content Changes Here */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
