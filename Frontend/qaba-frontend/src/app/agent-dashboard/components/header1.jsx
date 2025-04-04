"use client";

import { useState } from "react";
import { BellDot, Trash2, Eye, Search, Menu } from "lucide-react";
import Image from "next/image";

export default function TopNav() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New property listing available!", expanded: false },
    { id: 2, message: "Agent John Doe sent you a message.", expanded: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const toggleMessageExpansion = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, expanded: !notif.expanded } : notif
      )
    );
  };

  return (
    <div className="bg-gray-100  w-full sticky">
      {/* Large Screen Navigation */}
      <div className="hidden sm:flex justify-between items-center p-6 ">
        {/* Search Bar */}
        <div className="flex items-center flex-1 relative max-w-md">
          <Search className="absolute left-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for properties, agents"
            className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Notification + Profile Section */}
        <div className="flex items-center gap-6 relative">
          {/* Notification Bell */}
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <BellDot className="h-7 w-7 text-gray-600 hover:text-blue-500 transition duration-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-3 w-3 bg-red-500 rounded-full"></span>
            )}
          </div>
{/* Dim Overlay */}
{showNotifications && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50"
    onClick={() => setShowNotifications(false)}
  ></div>
)}


{/* Notification Dropdown */}
{showNotifications && (
  <div
    className="absolute top-10 right-0 bg-white shadow-lg rounded-md w-64 p-3 z-50"
  >
    {notifications.length === 0 ? (
      <p className="text-sm text-gray-500">No new notifications</p>
    ) : (
      notifications.map((notif) => (
        <div
          key={notif.id}
          className="flex justify-between items-center p-2 border-b bg-white"
        >
          <p
            className={`text-sm text-gray-800 ${
              notif.expanded ? "whitespace-normal" : "truncate"
            }`}
          >
            {notif.message}
          </p>
          <div className="flex items-center gap-2">
            <Eye
              className="h-4 w-4 text-blue-500 cursor-pointer"
              onClick={() => toggleMessageExpansion(notif.id)}
            />
            <Trash2
              className="h-4 w-4 text-red-500 cursor-pointer"
              onClick={() => handleDelete(notif.id)}
            />
          </div>
        </div>
      ))
    )}
  </div>
)}


          {/* User Profile */}
          <div className="flex items-center gap-2">
          <Image
  src="https://i.pravatar.cc/150"
  alt="User Avatar"
  width={40} // Adjust based on h-10 (40px)
  height={40}
  className="rounded-full object-cover"
/>

            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-gray-800">Ekene Moses</span>
              <span className="text-xs text-gray-500">Client</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-between  items-center p-4 ">
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-7 w-7 text-gray-600" />
        </button>

        {/* Search Bar (Reduced for Mobile) */}
        <div className="flex items-center flex-1 relative mx-4 ">
          <Search className="absolute left-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 p-2 border border-gray-300 rounded-md text-xs focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
          <BellDot className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </div>

        {/* User Profile (Reduced for Mobile) */}
        <div className="flex items-center gap-1 ml-4">
        <Image
  src="https://i.pravatar.cc/150"
  alt="User Avatar"
  width={32} // Adjust based on h-8 (32px)
  height={32}
  className="rounded-full object-cover"
/>


          {/* Show User Name on Mobile */}
          <span className="text-sm font-medium text-gray-800">Ekene</span>
        </div>
      </div>

      {/* Mobile Notifications Dropdown */}
      {showNotifications && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowNotifications(false)}>
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md w-64 p-3 z-50" onClick={(e) => e.stopPropagation()}>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="flex justify-between items-center p-2 border-b">
                  <p className={`text-sm text-gray-800 ${notif.expanded ? "whitespace-normal" : "truncate"}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Eye
                      className="h-4 w-4 text-blue-500 cursor-pointer"
                      onClick={() => toggleMessageExpansion(notif.id)}
                    />
                    <Trash2
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      onClick={() => handleDelete(notif.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}