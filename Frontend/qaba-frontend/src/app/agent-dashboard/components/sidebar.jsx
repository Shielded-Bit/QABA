"use client";

import { useState, useEffect } from 'react';
import {
  Menu,
  Building2,
  HousePlus,
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '../logout';

export default function Sidebar() {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/dashboard/properties')) {
      setIsPropertiesOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);

      // Automatically collapse the sidebar on mobile
      if (isMobileSize) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`fixed z-50 h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="px-6  sm:px-6 py-3 sm:py-7 flex items-center justify-between border-b">
        <div className={`text-xl font-bold text-gradient ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
          QABA
        </div>
        {isMobile && (
          <button onClick={toggleSidebar} className="px-0 hover:bg-gray-100 rounded">
            <Menu />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {renderLink('/agent-dashboard', 'Dashboard', pathname, LayoutDashboard, isSidebarCollapsed)}

        <div>
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
            } py-2 rounded-md hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white`}
          >
            <div className="flex items-center">
              <Building2 className={getIconClass(isSidebarCollapsed)} />
              <span className={getTextClass(isSidebarCollapsed)}>Properties</span>
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown
                className={`transition-transform duration-200 ${isPropertiesOpen ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          <div className="relative">
  {/* Vertical Line */}
  <div className="absolute left-2 top-0 h-full w-px bg-gray-300"></div>

  <div
    className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 text-gray-400 ${
      isPropertiesOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
      {renderSubLink(
      "/agent-dashboard/myListings",
      "My Listings",
      pathname,
      HousePlug,
      isSidebarCollapsed
    )}
    {renderSubLink(
      "/agent-dashboard/properties/rent",
      "My Draft",
      pathname,
      HousePlus,
      isSidebarCollapsed
    )}
    {renderSubLink(
      "/agent-dashboard/properties/buy",
      "Add Property",
      pathname,
      SquarePlus,
      isSidebarCollapsed
    )}
  </div>
</div>

        </div>

        {renderLink('/agent-dashboard/favourites', 'Favourite', pathname, Heart, isSidebarCollapsed)}
        {renderLink('/agent-dashboard/transactions', 'Transactions', pathname, CreditCard, isSidebarCollapsed)}
        {renderLink('/agent-dashboard/propertyOverview', 'Property Overview', pathname, ChartNoAxesCombined, isSidebarCollapsed)}
        {renderLink('/agent-dashboard/messages', 'Message', pathname, Mail, isSidebarCollapsed)}
      </nav>

      <div className="p-4 space-y-2 border-t">
        {renderLink('/agent-dashboard/help-support', 'Help & Support', pathname, HelpCircle, isSidebarCollapsed)}
        {renderLink('/agent-dashboard/settings', 'Settings', pathname, Settings, isSidebarCollapsed)}

        {/* Replace the logout link with the LogoutButton */}
        <div className={getLinkClass(pathname, '/agent-dashboard/logout', isSidebarCollapsed)}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function getLinkClass(pathname, href, isCollapsed) {
  const isActive = checkActiveLink(pathname, href);
  return `flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${
    isActive
      ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white'
      : 'hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white'
  }`;
}

function checkActiveLink(pathname, href) {
  if (href === '/agent-dashboard') {
    return pathname === '/agent-dashboard';
  }
  return pathname === href || pathname.startsWith(href + '/');
}

function getIconClass(isCollapsed) {
  return isCollapsed ? 'mx-auto' : 'mr-2';
}

function getTextClass(isCollapsed) {
  return isCollapsed ? 'hidden' : 'inline';
}

function renderLink(href, label, pathname, Icon, isCollapsed) {
  return (
    <a href={href} className={getLinkClass(pathname, href, isCollapsed)}>
      <Icon className={getIconClass(isCollapsed)} />
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}

function renderSubLink(href, label, pathname, Icon, isCollapsed) {
  return (
    <a href={href} className={getLinkClass(pathname, href, isCollapsed)}>
      <Icon className={getIconClass(isCollapsed)} />
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </a>
  );
}