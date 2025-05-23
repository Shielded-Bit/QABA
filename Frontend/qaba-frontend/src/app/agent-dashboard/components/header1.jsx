"use client";

import { useState, useEffect, useRef } from "react";
import { BellDot, Trash2, Eye, Menu } from "lucide-react";
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
  const [isBrowser, setIsBrowser] = useState(false);
  const [cachedProfileImage, setCachedProfileImage] = useState(null);
  
  // Add a flag to force a single fetch only on first mount
  const hasFetchedProfile = useRef(false);
  
  // Store user data locally
  const [cachedUserData, setCachedUserData] = useState(null);
  const [cachedUserType, setCachedUserType] = useState(null);
  const [cachedDisplayName, setCachedDisplayName] = useState("Guest");
  const [cachedShortName, setCachedShortName] = useState("User");
  const [cachedRole, setCachedRole] = useState("User");
  const [cachedInitial, setCachedInitial] = useState("U");
  const [cachedSettingsUrl, setCachedSettingsUrl] = useState("/dashboard/settings");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  // Use the shared profile context with conditional fetch prevention
  const { userData, profileImage, isLoading, userType } = useProfile();
  
  // Check if we're in browser environment and load cached data
  useEffect(() => {
    setIsBrowser(true);
    
    // Try to load from localStorage first for immediate display
    const savedImage = localStorage.getItem('profile_photo_url');
    if (savedImage) {
      setCachedProfileImage(savedImage);
    }
    
    // Try to load cached user data
    const savedUserData = localStorage.getItem('user_data');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setCachedUserData(parsedData);
        
        // Extract and set user properties
        const firstName = parsedData.first_name || parsedData.data?.first_name || "";
        const lastName = parsedData.last_name || parsedData.data?.last_name || "";
        
        if (firstName && lastName) {
          setCachedDisplayName(`${firstName} ${lastName}`);
        } else if (firstName) {
          setCachedDisplayName(firstName);
        } else if (lastName) {
          setCachedDisplayName(lastName);
        } else if (parsedData.email) {
          setCachedDisplayName(parsedData.email.split('@')[0]);
        }
        
        setCachedShortName(firstName || "User");
        setCachedInitial(firstName ? firstName.charAt(0).toUpperCase() : "U");
        
        setIsProfileLoading(false);
      } catch (e) {
        console.error("Failed to parse cached user data");
      }
    }
    
    const savedUserType = localStorage.getItem('user_type');
    if (savedUserType) {
      setCachedUserType(savedUserType);
      const type = savedUserType;
      setCachedRole(type === "AGENT" ? "Agent" : "Client");
      setCachedSettingsUrl(type === "AGENT" ? "/agent-dashboard/settings/profile" : "/dashboard/settings");
    }
    
    // Only fetch on first component mount ever
    if (!hasFetchedProfile.current) {
      // This is intentionally empty - we're using the useProfile hook
      // but preventing re-fetches on subsequent renders
      hasFetchedProfile.current = true;
    }
  }, []);
  
  // Update cache only when actual new data arrives
  useEffect(() => {
    if (userData && !isLoading) {
      setCachedUserData(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Extract and set user properties
      const firstName = userData.first_name || userData.data?.first_name || "";
      const lastName = userData.last_name || userData.data?.last_name || "";
      
      if (firstName && lastName) {
        setCachedDisplayName(`${firstName} ${lastName}`);
      } else if (firstName) {
        setCachedDisplayName(firstName);
      } else if (lastName) {
        setCachedDisplayName(lastName);
      } else if (userData.email) {
        setCachedDisplayName(userData.email.split('@')[0]);
      }
      
      setCachedShortName(firstName || "User");
      setCachedInitial(firstName ? firstName.charAt(0).toUpperCase() : "U");
      
      setIsProfileLoading(false);
    }
    
    if (userType) {
      setCachedUserType(userType);
      localStorage.setItem('user_type', userType);
      
      const type = userType;
      setCachedRole(type === "AGENT" ? "Agent" : "Client");
      setCachedSettingsUrl(type === "AGENT" ? "/agent-dashboard/settings/profile" : "/dashboard/settings");
    }
  }, [userData, isLoading, userType]);
  
  // Cache the profile image only when it actually changes
  useEffect(() => {
    if (profileImage && profileImage !== cachedProfileImage) {
      setCachedProfileImage(profileImage);
      localStorage.setItem('profile_photo_url', profileImage);
    }
  }, [profileImage, cachedProfileImage]);

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

  // Get the profile image URL with priority on cached version
  const getProfileImageUrl = () => {
    // First check our cached state value
    if (cachedProfileImage) {
      return cachedProfileImage;
    }
    
    // Then check the context value
    if (profileImage) {
      return profileImage;
    } 
    
    // Then try to get from userData or cachedUserData as backup
    const userDataToUse = cachedUserData || userData;
    if (userDataToUse) {
      const photoUrl = userDataToUse?.profile_photo_url || 
                      userDataToUse?.agent_profile?.profile_photo_url || 
                      userDataToUse?.client_profile?.profile_photo_url;
      if (photoUrl) {
        return photoUrl;
      }
    }
    
    // Last resort - check localStorage directly
    const savedImage = localStorage.getItem('profile_photo_url');
    if (savedImage) {
      return savedImage;
    }
    
    // Default placeholder if no image is found
    return "https://i.pravatar.cc/150";
  };

  // Use memoized data and loading state
  const profileImageUrl = getProfileImageUrl();
  const effectiveIsLoading = isProfileLoading && isLoading;

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
          className="hidden sm:block fixed top-24 right-10 bg-white shadow-lg rounded-md w-64 p-3 z-50"
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
              <div key={notif.id} className="flex justify-between items-start p-2 border-b hover:bg-gray-50">
                <p className={`text-sm text-gray-800 ${notif.expanded ? "whitespace-normal" : "truncate"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 ml-2">
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
              <div key={notif.id} className="flex justify-between items-start p-2 border-b hover:bg-gray-50">
                <p className={`text-sm text-gray-800 ${notif.expanded ? "whitespace-normal" : "truncate"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 ml-2">
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
    <div className="bg-gray-100 w-full sticky px-3 md:px-10">
      {/* Large Screen Navigation */}
      <div className="hidden sm:flex justify-between items-center p-6">
        {/* Search Bar */}
        <div className="flex items-center flex-1 relative max-w-md">
          {/* Search bar removed */}
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
          <Link href={cachedSettingsUrl} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300 shadow-sm">
              {profileImageUrl && !effectiveIsLoading ? (
                <Image
                  src={profileImageUrl}
                  alt={`${cachedDisplayName} Profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                  unoptimized={profileImageUrl.startsWith('data:')}
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
      <div className="sm:hidden flex justify-between items-center p-4">
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-7 w-7 text-gray-600" />
        </button>

        {/* Search Bar (Mobile) - removed */}
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
        <Link href={cachedSettingsUrl} className="flex items-center gap-1 ml-4 cursor-pointer">
          <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-300">
            {profileImageUrl && !effectiveIsLoading ? (
              <Image
                src={profileImageUrl}
                alt={`${cachedShortName} Profile`}
                width={32}
                height={32}
                className="rounded-full object-cover"
                priority
                unoptimized={profileImageUrl.startsWith('data:')}
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