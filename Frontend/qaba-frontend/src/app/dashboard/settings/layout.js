// app/settings/layout.jsx
"use client";

import { useState } from 'react';
import { User, Lock, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ProfileProvider } from "../../../contexts/ProfileContext";

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active tab based on the current path
  const isProfileActive = pathname === '/dashboard/settings' || pathname === '/dashboard/settings/profile';
  const isPasswordActive = pathname === '/dashboard/settings/password';
  
  // Navigation handler
  const navigateTo = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50 w-full pl-12 md:pl-4 sm:pl-12 rounded-md">
        {/* Header with Navigation */}
        <header className="">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16"> 
              {/* Title */}
              <div className="flex-shrink-0">
  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800  to-[#3ab7b1]">Settings</h1>
</div>

              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigateTo('/dashboard/settings/profile')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isProfileActive 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </button>
                <button
                  onClick={() => navigateTo('/dashboard/settings/password')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isPasswordActive 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </button>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => navigateTo('/agent-dashboard/settings/profile')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isProfileActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    Account
                  </div>
                </button>
                <button
                  onClick={() => navigateTo('/dashboard/settings/password')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isPasswordActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-3" />
                    Password
                  </div>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
}