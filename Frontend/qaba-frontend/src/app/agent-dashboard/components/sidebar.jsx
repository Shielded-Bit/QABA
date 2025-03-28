"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Building2,
  SquarePlus,
  Heart,
  CreditCard,
  HousePlug,
  Mail,
  Settings,
  HelpCircle,
  ChevronDown,
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
        pathname.startsWith("/agent-dashboard/draft")) {
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
        <div className={`text-xl font-bold text-gradient ${isSidebarCollapsed ? "hidden" : "block"}`}>
          QABA
        </div>
        {isMobile && (
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="px-0 hover:bg-gray-100 rounded">
            <Menu />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-4">
        {renderLink("/agent-dashboard", "Dashboard", pathname, LayoutDashboard, isSidebarCollapsed)}

        {renderDropdown("Properties", Building2, isPropertiesOpen, setIsPropertiesOpen, [
          { href: "/agent-dashboard/myListings", label: "My Listings", icon: HousePlug },
          { href: "/agent-dashboard/draft", label: "My Draft", icon: SquarePlus },
        ], pathname, isSidebarCollapsed)}

        {renderDropdown("Add Property", SquarePlus, isAddPropertyOpen, setIsAddPropertyOpen, [
          { href: "/agent-dashboard/for-rent", label: "For Renting", icon: SquarePlus },
          { href: "/agent-dashboard/for-sell", label: "For Selling", icon: SquarePlus },
        ], pathname, isSidebarCollapsed)}

        {renderLink("/agent-dashboard/favourites", "Favourite", pathname, Heart, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/transactions", "Transactions", pathname, CreditCard, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/propertyOverview", "Property Overview", pathname, ChartNoAxesCombined, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/messages", "Message", pathname, Mail, isSidebarCollapsed)}
      </nav>

      <div className="p-4 space-y-2 border-t">
        {renderLink("/agent-dashboard/help-support", "Help & Support", pathname, HelpCircle, isSidebarCollapsed)}
        {renderLink("/agent-dashboard/settings", "Settings", pathname, Settings, isSidebarCollapsed)}
        <div className={getLinkClass(pathname, "/agent-dashboard/logout", isSidebarCollapsed)}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function renderDropdown(label, Icon, isOpen, setIsOpen, links, pathname, isCollapsed) {
  // Check if any sublink is active to keep dropdown open
  const isAnySubLinkActive = links.some(link => checkActiveLink(pathname, link.href));
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center ${
          isCollapsed ? "justify-center px-2" : "justify-between px-3"
        } py-2 rounded-md hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white ${
          isAnySubLinkActive ? "text-blue-600" : ""
        }`}
      >
        <div className="flex items-center">
          <Icon className={getIconClass(isCollapsed)} />
          <span className={getTextClass(isCollapsed)}>{label}</span>
        </div>
        {!isCollapsed && (
          <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-px bg-gray-300"></div>

        <div
          className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 text-gray-400 ${
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {links.map((link, index) => (
            renderSubLink(link.href, link.label, pathname, link.icon, isCollapsed, index)
          ))}
        </div>
      </div>
    </div>
  );
}

function getLinkClass(pathname, href, isCollapsed) {
  const isActive = checkActiveLink(pathname, href);
  return `flex items-center ${
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
      <Icon className={getIconClass(isCollapsed)} />
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}

function renderSubLink(href, label, pathname, Icon, isCollapsed, key) {
  return (
    <a key={key} href={href} className={getLinkClass(pathname, href, isCollapsed)}>
      <Icon className={getIconClass(isCollapsed)} />
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}