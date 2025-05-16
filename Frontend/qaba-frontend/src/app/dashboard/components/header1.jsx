"use client";

import { useState, useEffect } from "react";
import { BellDot, Trash2, Eye, Search, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProfile } from "../../../contexts/ProfileContext";
import { createPortal } from "react-dom";

export default function TopNav() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New property listing available!", expanded: false },
    { id: 2, message: "Agent sent you a message.", expanded: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Use the shared profile context
  const { userData, profileImage, isLoading, userType } = useProfile();
  
  // Check if we're in browser environment for the portal
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // For debugging - you can remove this in production
  useEffect(() => {
    console.log("Current user data:", userData);
  }, [userData]);

  // Set profile image when component mounts or when profileImage from context changes
  useEffect(() => {
    if (profileImage) {
      setProfileImageUrl(profileImage);
    } else if (userData) {
      // Try to get from userData as backup
      const photoUrl = userData?.profile_photo_url || 
                      userData?.agent_profile?.profile_photo_url || 
                      userData?.client_profile?.profile_photo_url;
      if (photoUrl) {
        setProfileImageUrl(photoUrl);
      } else {
        // Try to get from localStorage as final backup
        const savedImage = localStorage.getItem('profile_photo_url');
        if (savedImage) {
          setProfileImageUrl(savedImage);
        } 
      }
    }
  }, [profileImage, userData]);

  // Add body class to prevent scrolling when notifications are open
  useEffect(() => {
    if (showNotifications) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showNotifications]);

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

  // Get user display name based on the structure from /api/v1/users/me/ endpoint
  const getUserDisplayName = () => {
    if (!userData) return "Guest";
    
    // Access directly from userData or from the data property
    const firstName = userData.first_name || userData.data?.first_name || "";
    const lastName = userData.last_name || userData.data?.last_name || "";
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    // Last resort: use email
    return userData.email ? userData.email.split('@')[0] : "User";
  };

  // Get short name for mobile display
  const getShortName = () => {
    const firstName = userData?.first_name || userData?.data?.first_name;
    return firstName || "User";
  };

  // Get user role based on user_type
  const getUserRole = () => {
    const type = userType || userData?.user_type || userData?.data?.user_type;
    return type === "CLIENT" ? "Client" : "Agent";
  };

  // Determine the settings page URL based on user type
  const getSettingsUrl = () => {
    const type = userType || userData?.user_type || userData?.data?.user_type;
    return type === "AGENT" ? "/dashboard/settings/profile" : "/dashboard/settings";
  };

  // Get the first initial for the avatar fallback
  const getInitial = () => {
    const firstName = userData?.first_name || userData?.data?.first_name;
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return "U"; // Default to "U" for User
  };

  // Render the modal overlay and content with portal to ensure it's on top of all content
  const renderModalContent = () => {
    if (!isBrowser || !showNotifications) return null;

    return createPortal(
      <>
        {/* Semi-transparent overlay to dim ALL content */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50" 
          onClick={() => setShowNotifications(false)}
          aria-hidden="true"
        ></div>
        
        {/* Desktop Notifications Dropdown */}
        <div 
          className="hidden sm:block fixed top-24 right-10 bg-white shadow-lg rounded-md w-80 p-4 z-50"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Notifications</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotifications(false)}
            >
              &times;
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex justify-between items-start p-3 border-b hover:bg-gray-50">
                <p className={`text-sm text-gray-800 ${notif.expanded ? "whitespace-normal" : "line-clamp-2"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 ml-2 mt-1">
                  <Eye 
                    className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMessageExpansion(notif.id);
                    }} 
                  />
                  <Trash2 
                    className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }} 
                  />
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Mobile Notifications Dropdown */}
        <div 
          className="sm:hidden fixed top-16 inset-x-0 mx-4 bg-white shadow-lg rounded-md p-4 z-50"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Notifications</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotifications(false)}
            >
              &times;
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex justify-between items-start p-3 border-b hover:bg-gray-50">
                <p className={`text-sm text-gray-800 ${notif.expanded ? "whitespace-normal" : "line-clamp-2"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 ml-2 mt-1">
                  <Eye 
                    className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMessageExpansion(notif.id);
                    }} 
                  />
                  <Trash2 
                    className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }} 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="bg-gray-100 w-full sticky px-3  md:px-10 z-40">
      {/* Large Screen Navigation */}
      <div className="hidden sm:flex justify-between items-center p-6">
        {/* Search Bar */}
        <div className="flex items-center flex-1 relative max-w-md">
       
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

          {/* User Profile */}
          <Link href={getSettingsUrl()} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300 shadow-sm">
              {!isLoading && profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={`${getUserDisplayName()} Profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xl font-medium text-gray-500">
                    {getInitial()}
                  </span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-gray-800">{getUserDisplayName()}</span>
              <span className="text-xs text-gray-500">{getUserRole()}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-between items-center p-4">
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-7 w-7 text-gray-600" />
        </button>

        {/* Search Bar (Mobile) */}
        <div className="flex items-center flex-1 relative mx-4">
         
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
          <BellDot className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </div>

        {/* User Profile (Mobile) */}
        <Link href={getSettingsUrl()} className="flex items-center gap-1 ml-4 cursor-pointer">
          <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-300">
            {!isLoading && profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${getShortName()} Profile`}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-sm font-medium text-gray-500">
                  {getInitial()}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-gray-800">{getShortName()}</span>
        </Link>
      </div>

      {/* Render modal with portal to ensure it dims ALL content */}
      {renderModalContent()}

      {/* Mobile menu overlay - separate from notifications */}
      {mobileMenuOpen && isBrowser && createPortal(
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
          {/* Mobile menu content would go here */}
        </div>,
        document.body
      )}
    </div>
  );
}