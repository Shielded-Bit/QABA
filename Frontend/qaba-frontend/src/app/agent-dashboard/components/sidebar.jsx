"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import {
  Menu,
  Building2,
  SquarePlus,
  Heart,
  CreditCard,
  HousePlug,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ChartNoAxesCombined,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout";

export default function Sidebar() {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth < 1023;
      setIsMobile(isMobileSize);
      if (isMobileSize) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`fixed z-50 h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="px-6 sm:px-6 py-3 sm:py-7 flex items-center justify-between border-b">
        <div className={`text-xl font-bold ${isSidebarCollapsed ? "hidden" : "block"}`}>
          <Link href="/" className="text-gradient hover:opacity-80 transition-opacity">
            QARBA
          </Link>
        </div>
        {isMobile && (
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="px-0 hover:bg-gray-100 rounded">
            <Menu />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-4 relative">
        {renderLink("/agent-dashboard", "Dashboard", pathname, LayoutDashboard, isSidebarCollapsed)}

        {renderPropertiesDropdown(isPropertiesOpen, setIsPropertiesOpen, isAddPropertyOpen, setIsAddPropertyOpen, pathname, isSidebarCollapsed)}

        {renderLink("/agent-dashboard/favourites", "Favourite", pathname, Heart, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/transactions", "Transactions", pathname, CreditCard, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/propertyOverview", "Property Overview", pathname, ChartNoAxesCombined, isSidebarCollapsed)}
      </nav>

      <div className="p-4 space-y-2 border-t">
        {renderLink("/agent-dashboard/help-support", "Help & Support", pathname, HelpCircle, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/settings/profile", "Settings", pathname, Settings, isSidebarCollapsed)}
        <div className={getLinkClass(pathname, "/agent-dashboard/logout", isSidebarCollapsed)}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function renderPropertiesDropdown(isPropertiesOpen, setIsPropertiesOpen, isAddPropertyOpen, setIsAddPropertyOpen, pathname, isCollapsed) {
  // Check if any property-related link is active
  const isAnyPropertyLinkActive = checkActiveLink(pathname, "/agent-dashboard/myListings") ||
                                   checkActiveLink(pathname, "/agent-dashboard/draft") ||
                                   checkActiveLink(pathname, "/agent-dashboard/for-rent") ||
                                   checkActiveLink(pathname, "/agent-dashboard/for-sell");
  
  const isAnyAddPropertyActive = checkActiveLink(pathname, "/agent-dashboard/for-rent") ||
                                checkActiveLink(pathname, "/agent-dashboard/for-sell");

  return (
    <div className="relative">
      <button
        onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
        className={`w-full flex items-center ${
          isCollapsed ? "justify-center px-2" : "justify-between px-3"
        } py-2 rounded-md hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white ${
          isAnyPropertyLinkActive ? "text-blue-600" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="relative">
            <Building2 className={getIconClass(isCollapsed)} />
            {isCollapsed && (
              <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Properties
              </div>
            )}
          </div>
          <span className={getTextClass(isCollapsed)}>Properties</span>
        </div>
        {!isCollapsed && (
          <ChevronDown className={`transition-transform duration-200 ${isPropertiesOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-px bg-gray-300"></div>

        <div
          className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 text-gray-400 ${
            isPropertiesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* My Listings */}
          {renderSubLink("/agent-dashboard/myListings", "My Listings", pathname, HousePlug, isCollapsed, "myListings")}
          
          {/* My Draft */}
          {renderSubLink("/agent-dashboard/draft", "My Draft", pathname, SquarePlus, isCollapsed, "draft")}
          
          {/* Add Property Nested Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAddPropertyOpen(!isAddPropertyOpen)}
              className={`w-full group flex items-center ${
                isCollapsed ? "justify-center px-2" : "justify-between px-3"
              } py-2 rounded-md hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white ${
                isAnyAddPropertyActive ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <SquarePlus className={getIconClass(isCollapsed)} />
                  {isCollapsed && (
                    <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      Add Property
                    </div>
                  )}
                </div>
                <span className={getTextClass(isCollapsed)}>Add Property</span>
              </div>
              {!isCollapsed && (
                <ChevronRight className={`transition-transform duration-200 ${isAddPropertyOpen ? "rotate-90" : ""}`} />
              )}
            </button>

            {/* Nested Add Property Items */}
            <div className="relative">
              <div className="absolute left-2 top-0 h-full w-px bg-gray-300"></div>
              
              <div
                className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 text-gray-400 ${
                  isAddPropertyOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {renderSubLink("/agent-dashboard/for-rent", "For Renting", pathname, SquarePlus, isCollapsed, "forRent")}
                {renderSubLink("/agent-dashboard/for-sell", "For Selling", pathname, SquarePlus, isCollapsed, "forSell")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLinkClass(pathname, href, isCollapsed) {
  const isActive = checkActiveLink(pathname, href);
  return `group flex items-center ${
    isCollapsed ? "justify-center px-2" : "px-3"
  } py-2 rounded-md ${
    isActive
      ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white"
      : "hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white"
  }`;
}

function checkActiveLink(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

function getIconClass(isCollapsed) {
  return isCollapsed ? "mx-auto" : "mr-2";
}

function getTextClass(isCollapsed) {
  return isCollapsed ? "hidden" : "inline";
}

function renderLink(href, label, pathname, Icon, isCollapsed) {
  return (
    <a href={href} className={getLinkClass(pathname, href, isCollapsed)}>
      <div className="relative">
        <Icon className={getIconClass(isCollapsed)} />
        {isCollapsed && (
          <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {label}
          </div>
        )}
      </div>
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}

function renderSubLink(href, label, pathname, Icon, isCollapsed, key) {
  return (
    <a 
      key={key} 
      href={href} 
      className={`group ${getLinkClass(pathname, href, isCollapsed)}`}
    >
      <div className="relative">
        <Icon className={getIconClass(isCollapsed)} />
        {isCollapsed && (
          <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {label}
          </div>
        )}
      </div>
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}