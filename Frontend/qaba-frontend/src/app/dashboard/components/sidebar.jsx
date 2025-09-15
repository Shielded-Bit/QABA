"use client";

import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Building2,
  Key,
  Home,
  Heart,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '../logout';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname.startsWith('/dashboard');

  useEffect(() => {
    if (pathname.startsWith('/dashboard/properties')) {
      setIsPropertiesOpen(true);
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

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the toggle function - works on mobile and tablet screens
  const toggleSidebar = () => {
    if (isMobile || isTablet) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
    // On desktop, do nothing (sidebar should always be expanded)
  };
  
  // Hide sidebar completely if we're not on a dashboard page
  if (!isDashboardPage) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b px-3 py-6">
        {/* Logo - always shown on desktop, only shown when expanded on mobile/tablet */}
        {(!isMobile && !isTablet) || ((isMobile || isTablet) && !isSidebarCollapsed) ? (
          <div className="flex items-center justify-start">
            <Link 
              href="/" 
              className="flex items-center transition-all duration-300 hover:opacity-80"
            >
              <Image 
                 src="/qarbaLogo.png" 
                 alt="QARBA Logo" 
                 width={130} 
                 height={42} 
                 className="h-10 w-auto"
               />
            </Link>
          </div>
        ) : null}
        
        {/* Show toggle button on mobile and tablet screens */}
        {(isMobile || isTablet) && (
          <button 
            onClick={toggleSidebar} 
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              isSidebarCollapsed ? 'mx-auto' : ''
            }`}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <Menu size={20} className="text-gray-600" />
            ) : (
              <X size={20} className="text-gray-600" />
            )}
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {renderLink('/dashboard', 'Dashboard', pathname, LayoutDashboard, isSidebarCollapsed)}

        <div className="relative group">
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
            } py-2 rounded-md hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white transition-all duration-200`}
          >
            <div className="flex items-center relative">
              <div className="relative">
                <Building2 className={getIconClass(isSidebarCollapsed)} />
                {isSidebarCollapsed && (
                  <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    Properties
                  </div>
                )}
              </div>
              <span className={getTextClass(isSidebarCollapsed)}>Properties</span>
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown
                className={`transition-transform duration-200 ${isPropertiesOpen ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          <div
            className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 text-gray-400 ${
              isPropertiesOpen && !isSidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {renderSubLink('/dashboard/all-listed-properties', 'All Listed Properties', pathname, Building2, isSidebarCollapsed)}
            {renderSubLink('/rent', 'Rent Properties', pathname, Key, isSidebarCollapsed)}
            {renderSubLink('/buy', 'Buy Properties', pathname, Home, isSidebarCollapsed)}
          </div>
        </div>

        {renderLink('/dashboard/favourites', 'Favourite', pathname, Heart, isSidebarCollapsed)}
        {renderLink('/dashboard/transactions', 'Transactions', pathname, CreditCard, isSidebarCollapsed)}
      </nav>

      <div className="p-4 space-y-2 border-t">
        {renderLink('/dashboard/help-support', 'Help & Support', pathname, HelpCircle, isSidebarCollapsed)}
        {renderLink('/dashboard/settings', 'Settings', pathname, Settings, isSidebarCollapsed)}

        {/* Logout button with consistent styling */}
        <div className={getLinkClass(pathname, '/dashboard/logout', isSidebarCollapsed)}>
          <LogoutButton collapsed={isSidebarCollapsed} />
        </div>
      </div>
    </div>
  );
}

function getLinkClass(pathname, href, isCollapsed) {
  const isActive = checkActiveLink(pathname, href);
  return `group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md transition-all duration-200 ${
    isActive
      ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white'
      : 'hover:bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:text-white'
  }`;
}

function checkActiveLink(pathname, href) {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
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
    <Link 
      href={href} 
      className={getLinkClass(pathname, href, isCollapsed)}
    >
      <div className="relative">
        <Icon className={getIconClass(isCollapsed)} size={isCollapsed ? 20 : 18} />
        {isCollapsed && (
          <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {label}
          </div>
        )}
      </div>
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </Link>
  );
}

function renderSubLink(href, label, pathname, Icon, isCollapsed) {
  // Render only when not collapsed, with tooltip support
  if (isCollapsed) return null;
  
  return (
    <Link 
      href={href} 
      className={getLinkClass(pathname, href, isCollapsed)}
    >
      <div className="relative">
        <Icon className={getIconClass(isCollapsed)} size={16} />
        {isCollapsed && (
          <div className="absolute left-full z-50 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {label}
          </div>
        )}
      </div>
      <span className={getTextClass(isCollapsed)}>{label}</span>
    </Link>
  );
}