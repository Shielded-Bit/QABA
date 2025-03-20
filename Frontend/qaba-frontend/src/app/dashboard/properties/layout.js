"use client";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar - Static and Persistent */}
     

      {/* Main Content - Dynamic Content Changes Here */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}