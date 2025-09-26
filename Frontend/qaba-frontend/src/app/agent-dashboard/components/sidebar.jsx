"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import {
  Menu,
  X,
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
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout";

export default function Sidebar() {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
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
      const width = window.innerWidth;
      const isMobileSize = width < 768; // Mobile: < 768px
      const isTabletSize = width >= 768 && width < 1024; // Tablet: 768px - 1023px
      const isDesktopSize = width >= 1024; // Desktop: >= 1024px
      
      setIsMobile(isMobileSize);
      setIsTablet(isTabletSize);

      // Auto-collapse logic:
      // - Mobile: Always collapsed by default, can be toggled
      // - Tablet: Collapsed by default, can be toggled  
      // - Desktop: Always expanded
      if (isMobileSize || isTabletSize) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update CSS custom property for main content margin
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isSidebarCollapsed ? '64px' : '326px'
    );
  }, [isSidebarCollapsed]);

  return (
    <div
      className={`fixed z-30 top-[70px] h-[calc(100vh-70px)] flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-[64px]" : "w-[326px]"
      }`}
    >
      <div className="bg-white font-manrope w-full h-full mx-auto rounded-2xl shadow-sm flex flex-col">
      <div className="flex items-center justify-center px-2 py-2">
        {/* Show expand button when collapsed */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Expand sidebar"
          >
            <div className="flex flex-col items-center">
              <GoSidebarCollapse className="w-5 h-5 text-gray-500" />
              <span className="text-[8px] font-bold text-gray-500 mt-1">Open</span>
            </div>
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-2 pt-2 space-y-4 relative">
        {renderDashboardLink("/agent-dashboard", "Dashboard", pathname, LayoutDashboard, isSidebarCollapsed, setIsSidebarCollapsed)}

        {renderPropertiesDropdown(isPropertiesOpen, setIsPropertiesOpen, isAddPropertyOpen, setIsAddPropertyOpen, pathname, isSidebarCollapsed)}

        {renderLink("/agent-dashboard/favourites", "Favourite", pathname, Heart, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/transactions", isSidebarCollapsed ? "Txns" : "Transactions", pathname, CreditCard, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/propertyOverview", "Property Overview", pathname, ChartNoAxesCombined, isSidebarCollapsed)}
      </nav>

      <div className="p-2 space-y-2 border-t border-gray-200">
        {renderLink("/agent-dashboard/help-support", "Help & Support", pathname, HelpCircle, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/settings/profile", "Settings", pathname, Settings, isSidebarCollapsed)}
        <div className={getLinkClass(pathname, "/agent-dashboard/logout", isSidebarCollapsed)}>
          <LogoutButton collapsed={isSidebarCollapsed} />
        </div>
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
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isPropertiesOpen ? "rotate-180" : ""}`} />
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
                <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${isAddPropertyOpen ? "rotate-90" : ""}`} />
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
  return isCollapsed ? "w-5 h-5" : "mr-2 w-5 h-5";
}

function getTextClass(isCollapsed) {
  return isCollapsed ? "hidden" : "inline";
}

function renderDashboardLink(href, label, pathname, Icon, isCollapsed, setIsSidebarCollapsed) {
  // Check if actually active (on dashboard page)
  const isActuallyActive = checkActiveLink(pathname, href);
  // Always show some active state for Dashboard link so collapse icon is always visible
  const isActive = true; // Always active for Dashboard
  return (
    <div className={`group flex items-center ${
      isCollapsed ? "justify-center px-2" : "px-3"
    } py-2 rounded-md ${
      isActive
        ? isActuallyActive 
          ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white" // Full bright when actually active
          : "bg-gradient-to-r from-[#014d98]/80 to-[#3ab7b1]/80 text-white" // Dimmed when not active
        : "hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white"
    }`}>
      <a href={href} className={`flex items-center ${isCollapsed ? "justify-center" : "flex-1"}`}>
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
      {!isCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
          aria-label="Collapse sidebar"
        >
          <TbLayoutSidebarLeftCollapseFilled className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}

function renderLink(href, label, pathname, Icon, isCollapsed) {
  return (
    <a href={href} className={getLinkClass(pathname, href, isCollapsed)}>
      <div className="relative flex flex-col items-center">
        <Icon className={getIconClass(isCollapsed)} />
        {isCollapsed && (
          <span className="text-[8px] font-bold text-gray-500 mt-1">{label}</span>
        )}
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