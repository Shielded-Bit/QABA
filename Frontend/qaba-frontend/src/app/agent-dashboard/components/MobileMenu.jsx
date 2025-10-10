"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Building2, 
  SquarePlus, 
  Heart, 
  CreditCard, 
  HousePlug, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  ChartNoAxesCombined,
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
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const pathname = usePathname();

  // Effect to set dropdown states based on current path
  useEffect(() => {
    // Check if current path matches any properties routes
    if (pathname.startsWith("/agent-dashboard/myListings") || 
        pathname.startsWith("/agent-dashboard/draft") ||
        pathname.startsWith("/agent-dashboard/for-rent") || 
        pathname.startsWith("/agent-dashboard/for-sell")) {
      setIsPropertiesOpen(true);
    }
    
    // Check if current path matches any add property routes
    if (pathname.startsWith("/agent-dashboard/for-rent") || 
        pathname.startsWith("/agent-dashboard/for-sell")) {
      setIsAddPropertyOpen(true);
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
  const isAnyPropertyLinkActive = checkActiveLink(pathname, "/agent-dashboard/myListings") ||
                                 checkActiveLink(pathname, "/agent-dashboard/draft") ||
                                 checkActiveLink(pathname, "/agent-dashboard/for-rent") ||
                                 checkActiveLink(pathname, "/agent-dashboard/for-sell");
  
  const isAnyAddPropertyActive = checkActiveLink(pathname, "/agent-dashboard/for-rent") ||
                                checkActiveLink(pathname, "/agent-dashboard/for-sell");

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
              href="/agent-dashboard" 
              className={getMobileLinkClass(pathname, "/agent-dashboard")}
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
                {/* My Listings */}
                <Link 
                  href="/agent-dashboard/myListings" 
                  className={getMobileLinkClass(pathname, "/agent-dashboard/myListings")}
                  onClick={onClose}
                >
                  <HousePlug className="h-4 w-4" />
                  <span>My Listings</span>
                </Link>
                
                {/* My Draft */}
                <Link 
                  href="/agent-dashboard/draft" 
                  className={getMobileLinkClass(pathname, "/agent-dashboard/draft")}
                  onClick={onClose}
                >
                  <SquarePlus className="h-4 w-4" />
                  <span>My Draft</span>
                </Link>
                
                {/* Add Property Nested Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsAddPropertyOpen(!isAddPropertyOpen)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isAnyAddPropertyActive
                        ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SquarePlus className="h-4 w-4" />
                      <span>Add Property</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isAddPropertyOpen ? "rotate-90" : ""}`} />
                  </button>

                  {/* Add Property Submenu */}
                  <div className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                    isAddPropertyOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <Link 
                      href="/agent-dashboard/for-rent" 
                      className={getMobileLinkClass(pathname, "/agent-dashboard/for-rent")}
                      onClick={onClose}
                    >
                      <SquarePlus className="h-4 w-4" />
                      <span>For Renting</span>
                    </Link>
                    <Link 
                      href="/agent-dashboard/for-sell" 
                      className={getMobileLinkClass(pathname, "/agent-dashboard/for-sell")}
                      onClick={onClose}
                    >
                      <SquarePlus className="h-4 w-4" />
                      <span>For Selling</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Navigation Links */}
            <Link 
              href="/agent-dashboard/favourites" 
              className={getMobileLinkClass(pathname, "/agent-dashboard/favourites")}
              onClick={onClose}
            >
              <Heart className="h-5 w-5" />
              <span>Favourite</span>
            </Link>
            
            <Link 
              href="/agent-dashboard/transactions" 
              className={getMobileLinkClass(pathname, "/agent-dashboard/transactions")}
              onClick={onClose}
            >
              <CreditCard className="h-5 w-5" />
              <span>Transactions</span>
            </Link>
            
            <Link 
              href="/agent-dashboard/propertyOverview" 
              className={getMobileLinkClass(pathname, "/agent-dashboard/propertyOverview")}
              onClick={onClose}
            >
              <ChartNoAxesCombined className="h-5 w-5" />
              <span>Property Overview</span>
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-4 border-t border-gray-200 space-y-2">
            <Link 
              href="/agent-dashboard/help-support" 
              className={getMobileLinkClass(pathname, "/agent-dashboard/help-support")}
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
