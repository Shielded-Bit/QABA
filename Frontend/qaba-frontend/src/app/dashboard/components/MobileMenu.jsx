"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Building2, 
  Key, 
  Heart, 
  CreditCard, 
  HelpCircle, 
  ChevronDown, 
  LayoutDashboard, 
  Home,
  Settings,
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout";
import { createPortal } from "react-dom";

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  profileImageUrl, 
  cachedDisplayName, 
  cachedRole, 
  cachedInitial, 
  cachedSettingsUrl, 
  shouldShowLoading 
}) {
  // Get profile image URL with localStorage priority
  const getProfileImageUrl = () => {
    // Always prioritize localStorage first for immediate display
    if (typeof window !== 'undefined') {
      const savedProfileImage = localStorage.getItem('profile_photo_url');
      if (savedProfileImage && savedProfileImage.trim() !== '') {
        return savedProfileImage;
      }
    }
    
    // Fallback to passed prop
    return profileImageUrl;
  };

  const finalProfileImageUrl = getProfileImageUrl();
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const pathname = usePathname();

  // Effect to set dropdown states based on current path
  useEffect(() => {
    // Check if current path matches any properties routes
    if (pathname.startsWith("/dashboard/all-listed-properties") || 
        pathname.startsWith("/rent") || 
        pathname.startsWith("/buy")) {
      setIsPropertiesOpen(true);
    }
  }, [pathname]);

  // Initialize browser state
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Helper functions
  const checkActiveLink = (pathname, href) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getMobileLinkClass = (pathname, href) => {
    const isActive = checkActiveLink(pathname, href);
    return `flex items-center gap-3 p-3 rounded-lg transition-colors ${
      isActive
        ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white"
        : "hover:bg-gray-100 text-gray-700"
    }`;
  };

  // Check if any property-related link is active
  const isAnyPropertyLinkActive = checkActiveLink(pathname, "/dashboard/all-listed-properties") ||
                                 checkActiveLink(pathname, "/rent") ||
                                 checkActiveLink(pathname, "/buy");

  if (!isBrowser || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Mobile Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-sm bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Image 
              src="/qarbaLogo.png" 
              alt="QARBA Logo" 
              width={140} 
              height={40} 
              className="h-10 w-auto"
            />
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {/* User Info Section */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-300">
              {finalProfileImageUrl && !shouldShowLoading ? (
                <img
                  src={finalProfileImageUrl}
                  alt={`${cachedDisplayName} Profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xl font-medium text-gray-500">
                    {cachedInitial}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{cachedDisplayName}</p>
              <p className="text-sm text-gray-500">{cachedRole}</p>
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="space-y-2">
            {/* Dashboard */}
            <Link 
              href="/dashboard" 
              className={getMobileLinkClass(pathname, "/dashboard")}
              onClick={onClose}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            {/* Properties Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isAnyPropertyLinkActive
                    ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <span>Properties</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPropertiesOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Properties Submenu */}
              <div className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                isPropertiesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                {/* All Listed Properties */}
                <Link 
                  href="/dashboard/all-listed-properties" 
                  className={getMobileLinkClass(pathname, "/dashboard/all-listed-properties")}
                  onClick={onClose}
                >
                  <Building2 className="h-4 w-4" />
                  <span>All Listed Properties</span>
                </Link>
                
                {/* Rent Properties */}
                <Link 
                  href="/dashboard/all-listed-properties?filter=RENT" 
                  className={getMobileLinkClass(pathname, "/dashboard/all-listed-properties")}
                  onClick={onClose}
                >
                  <Key className="h-4 w-4" />
                  <span>Rent Properties</span>
                </Link>
                
                {/* Buy Properties */}
                <Link 
                  href="/dashboard/all-listed-properties?filter=SALE" 
                  className={getMobileLinkClass(pathname, "/dashboard/all-listed-properties")}
                  onClick={onClose}
                >
                  <Home className="h-4 w-4" />
                  <span>Buy Properties</span>
                </Link>
              </div>
            </div>

            {/* Other Navigation Links */}
            <Link 
              href="/dashboard/favourites" 
              className={getMobileLinkClass(pathname, "/dashboard/favourites")}
              onClick={onClose}
            >
              <Heart className="h-5 w-5" />
              <span>Favourite</span>
            </Link>
            
            <Link 
              href="/dashboard/transactions" 
              className={getMobileLinkClass(pathname, "/dashboard/transactions")}
              onClick={onClose}
            >
              <CreditCard className="h-5 w-5" />
              <span>Transactions</span>
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-4 border-t border-gray-200 space-y-2">
            <Link 
              href="/dashboard/help-support" 
              className={getMobileLinkClass(pathname, "/dashboard/help-support")}
              onClick={onClose}
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </Link>
            
            <Link 
              href={cachedSettingsUrl} 
              className={getMobileLinkClass(pathname, cachedSettingsUrl)}
              onClick={onClose}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            
            {/* Logout Button */}
            <div className="p-3">
              <LogoutButton collapsed={false} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
