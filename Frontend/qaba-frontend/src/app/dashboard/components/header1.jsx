"use client";

import { useState, useEffect, useRef } from "react";
import { BellDot, X, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProfile } from "../../../contexts/ProfileContext";
import { useNotifications } from "../../../contexts/NotificationContext";
import { createPortal } from "react-dom";

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Cache state - initialize from localStorage on mount
  const [cachedProfileImage, setCachedProfileImage] = useState(null);
  const [cachedUserData, setCachedUserData] = useState(null);
  const [cachedUserType, setCachedUserType] = useState(null);
  const [cachedDisplayName, setCachedDisplayName] = useState("Guest");
  const [cachedShortName, setCachedShortName] = useState("User");
  const [cachedRole, setCachedRole] = useState("User");
  const [cachedInitial, setCachedInitial] = useState("U");
  const [cachedSettingsUrl, setCachedSettingsUrl] = useState("/dashboard/settings");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use the shared profile context - but don't trigger refetch if we have cached data
  const { userData, profileImage, isLoading, userType } = useProfile();
  
  // Use the notifications context
  const { notifications = [], unreadCount = 0, markAsRead } = useNotifications() || {};

  // Initialize from localStorage on component mount
  useEffect(() => {
    setIsBrowser(true);
    
    // Load cached data from localStorage
    const savedUserData = localStorage.getItem('user_data');
    const savedUserType = localStorage.getItem('user_type');
    const savedProfileImage = localStorage.getItem('profile_photo_url');
    
    if (savedUserData) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setCachedUserData(parsedUserData);
        
        // Set user display properties from cached data
        const firstName = parsedUserData.first_name || "";
        const lastName = parsedUserData.last_name || "";
        
        // Set display name immediately
        const displayName = firstName && lastName ? 
          `${firstName} ${lastName}` : 
          firstName || 
          lastName || 
          parsedUserData.email?.split('@')[0] || 
          "User";
        
        setCachedDisplayName(displayName);
        setCachedShortName(firstName || displayName.split(' ')[0] || "User");
        setCachedInitial((firstName || displayName)[0].toUpperCase());

        // Get profile photo URL directly from the correct profile
        const profileUrl = parsedUserData.agentprofile?.profile_photo_url ||
                         parsedUserData.clientprofile?.profile_photo_url;
        if (profileUrl) {
          setCachedProfileImage(profileUrl);
          localStorage.setItem('profile_photo_url', profileUrl);
        }
      } catch (error) {
        console.error('Error parsing cached user data:', error);
      }
    }
    
    if (savedUserType) {
      setCachedUserType(savedUserType);
      const role = savedUserType === "AGENT" ? "Agent" :
                  savedUserType === "LANDLORD" ? "Landlord" :
                  savedUserType === "CLIENT" ? "Client" : "User";
      
      setCachedRole(role);
      setCachedSettingsUrl(savedUserType === "CLIENT" ? "/dashboard/settings" : "/agent-dashboard/settings/profile");
    }
    
    if (savedProfileImage) {
      setCachedProfileImage(savedProfileImage);
    }
    
    setIsInitialized(true);
  }, []);
  
  // Only update cache when new data arrives AND it's different from what we have
  useEffect(() => {
    if (!isInitialized) return;
    
    if (userData && !isLoading && JSON.stringify(userData) !== JSON.stringify(cachedUserData)) {
      setCachedUserData(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Extract and set user properties
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      
      // Set display name
      const displayName = firstName && lastName ? 
        `${firstName} ${lastName}` : 
        firstName || 
        lastName || 
        userData.email?.split('@')[0] || 
        "User";
      
      setCachedDisplayName(displayName);
      setCachedShortName(firstName || displayName.split(' ')[0] || "User");
      setCachedInitial((firstName || displayName)[0].toUpperCase());

      // Get profile photo URL directly from the correct profile
      const profileUrl = userData.agentprofile?.profile_photo_url ||
                       userData.clientprofile?.profile_photo_url;
      if (profileUrl && profileUrl !== cachedProfileImage) {
        setCachedProfileImage(profileUrl);
        localStorage.setItem('profile_photo_url', profileUrl);
      }
    }
  }, [userData, isLoading, cachedUserData, cachedProfileImage, isInitialized]);
  
  // Only update user type cache when it actually changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (userType && userType !== cachedUserType) {
      setCachedUserType(userType);
      localStorage.setItem('user_type', userType);
      
      const role = userType === "AGENT" ? "Agent" :
                  userType === "LANDLORD" ? "Landlord" :
                  userType === "CLIENT" ? "Client" : "User";
      
      setCachedRole(role);
      setCachedSettingsUrl(userType === "CLIENT" ? "/dashboard/settings" : "/agent-dashboard/settings/profile");
    }
  }, [userType, cachedUserType, isInitialized]);
  
  // Only update profile image cache when it actually changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (profileImage && profileImage !== cachedProfileImage) {
      setCachedProfileImage(profileImage);
      localStorage.setItem('profile_photo_url', profileImage);
    }
  }, [profileImage, cachedProfileImage, isInitialized]);

  // Add body class to prevent scrolling when notifications are open
  useEffect(() => {
    if (showNotifications) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Render the modal overlay and notification content with portal
  const renderNotificationContent = () => {
    if (!isBrowser) return null;

    return createPortal(
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowNotifications(false)}
        />
        
        {/* Notification Panel - Fixed positioning for mobile */}
        <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {/* X button positioned inside the container on mobile */}
            <button 
              onClick={() => setShowNotifications(false)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <p className="text-gray-800">{notification.message}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="bg-gray-100 w-full sticky top-0 z-30">
      {/* Large Screen Navigation */}
      <div className="hidden sm:flex justify-between items-center p-6 px-3 md:px-10">
        {/* Search Bar */}
        <div className="flex items-center flex-1 relative max-w-md">
          {/* Search bar removed */}
        </div>

        {/* Notification + Profile Section */}
        <div className="flex items-center gap-6 relative">
          {/* Notification Bell */}
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <BellDot className="h-7 w-7 text-gray-600 hover:text-blue-500 transition duration-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {/* User Profile */}
          <Link href={cachedSettingsUrl} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300 shadow-sm">
              {cachedProfileImage ? (
                <Image
                  src={cachedProfileImage}
                  alt={`${cachedDisplayName} Profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                  unoptimized={cachedProfileImage.startsWith('data:')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xl font-medium text-gray-500">
                    {cachedInitial}
                  </span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-gray-800">{cachedDisplayName}</span>
              <span className="text-xs text-gray-500">{cachedRole}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-between items-center p-4 px-3">
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-7 w-7 text-gray-600" />
        </button>

        {/* Search Bar (Mobile) */}
        <div className="flex items-center flex-1 relative mx-4"></div>

        {/* Right side icons container */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <BellDot className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {/* User Profile (Mobile) */}
          <Link href={cachedSettingsUrl} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-300">
              {cachedProfileImage ? (
                <Image
                  src={cachedProfileImage}
                  alt={`${cachedShortName} Profile`}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  priority
                  unoptimized={cachedProfileImage.startsWith('data:')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-sm font-medium text-gray-500">
                    {cachedInitial}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-800">{cachedShortName}</span>
          </Link>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotifications && renderNotificationContent()}

      {/* Mobile Menu Portal */}
      {mobileMenuOpen && isBrowser && createPortal(
        <div 
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* ...existing mobile menu content... */}
        </div>,
        document.body
      )}
    </div>
  );
}