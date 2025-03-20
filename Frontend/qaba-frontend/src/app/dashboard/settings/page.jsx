'use client';

import { useState } from 'react';
import ProfilePage from './profile/page';
import PasswordPage from './password/page';
import { User, Lock, Menu } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(''); // Initialize to empty string or null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to control mobile menu visibility

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <h1 className="text-3xl font-bold p-6 ml-5 lg:ml-0 bg-white border-b border-gray-200 text-gray-800">
        Settings
      </h1>

      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 border-b border-gray-200 ml-10">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Primary Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Account</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'password'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Password</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu - Visible on mobile, hidden on desktop */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 p-4 bg-white">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full p-3 ml-7 lg:ml-0 rounded-lg transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Account</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('password');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full ml-7 lg:ml-0 p-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'password'
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Password</span>
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-8 ml-5 lg:ml-0">
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'password' && <PasswordPage />}
          {/* Show a message or placeholder when no tab is selected */}
          {!activeTab && (
            <div className="text-center text-gray-500 py-20">
              <p className="text-lg">Please select a tab to view settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}