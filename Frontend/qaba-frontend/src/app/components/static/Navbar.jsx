"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { TbMenu4 } from "react-icons/tb";
import { XCircle, AlertCircle, LogOut } from "lucide-react";
import Button from "../shared/Button";
import { useProfile } from "../../../contexts/ProfileContext";
import useLogout from "../../hooks/useLogout";
import { 
  Search, 
  Home, 
  PlusCircle, 
  InfoIcon,
  Newspaper,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const pathname = usePathname();
  
  // State for cached user data
  const [cachedProfileImage, setCachedProfileImage] = useState("");
  const [cachedUserData, setCachedUserData] = useState(null);
  const [cachedUserType, setCachedUserType] = useState(null);
  const [cachedDisplayName, setCachedDisplayName] = useState("Guest");
  const [cachedShortName, setCachedShortName] = useState("User");
  const [cachedRole, setCachedRole] = useState("User");
  const [cachedInitial, setCachedInitial] = useState("U");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get user data from context
  const { userData, profileImage, isLoading, userType } = useProfile() || {};
  const { logout } = useLogout();
  
  // Initialize from localStorage on component mount
  useEffect(() => {
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

        // Get profile photo URL from the new structure (from /me endpoint)
        const profileUrl = parsedUserData.profile?.profile_photo_url;
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
    }
    
    if (savedProfileImage) {
      setCachedProfileImage(savedProfileImage);
    }
    
    setIsInitialized(true);
  }, []);

  // Update cache when new data arrives
  useEffect(() => {
    if (!isInitialized) return;
    
    if (userData && !isLoading) {
      setCachedUserData(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      
      const displayName = firstName && lastName ? 
        `${firstName} ${lastName}` : 
        firstName || 
        lastName || 
        userData.email?.split('@')[0] || 
        "User";
      
      setCachedDisplayName(displayName);
      setCachedShortName(firstName || displayName.split(' ')[0] || "User");
      setCachedInitial((firstName || displayName)[0].toUpperCase());
    }
  }, [userData, isLoading, isInitialized]);

  // Update user type cache when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (userType && userType !== cachedUserType) {
      setCachedUserType(userType);
      localStorage.setItem('user_type', userType);
      const role = userType === "AGENT" ? "Agent" :
                  userType === "LANDLORD" ? "Landlord" :
                  userType === "CLIENT" ? "Client" : "User";
      setCachedRole(role);
    }
  }, [userType, cachedUserType, isInitialized]);

  // Update profile image cache when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (profileImage && profileImage !== cachedProfileImage) {
      setCachedProfileImage(profileImage);
      localStorage.setItem('profile_photo_url', profileImage);
    }
  }, [profileImage, cachedProfileImage, isInitialized]);

  const isActive = (path) => pathname === path;
  
  // Determine if user is signed in
  const isSignedIn = cachedUserData || (userData && Object.keys(userData).length > 0);
  
  // Get dashboard URL based on user type
  const getDashboardUrl = () => {
    const type = cachedUserType || userType || cachedUserData?.user_type;
    return (type === "AGENT" || type === "LANDLORD") ? "/agent-dashboard" : "/dashboard";
  };

  const handleSignOutClick = () => {
    setProfileMenuOpen(false);
    setShowSignOutModal(true);
  };
  
  const handleConfirmSignOut = () => {
    logout();
    setShowSignOutModal(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.mobile-menu-container')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 left-0 right-0 w-full z-50 bg-[rgb(246,246,246)] shadow-sm">
      <div className="w-full flex justify-between items-center py-3 px-4 sm:px-6 lg:px-14">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/qarbaLogo.png" 
              alt="QARBA Logo" 
              width={150} 
              height={50} 
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Tablet Navigation Links - Visible on md screens (768px+) but hidden on lg+ */}
        <ul className="hidden md:flex lg:hidden space-x-6 text-gray-800">
          {[
            { name: "All Properties", path: "/properties" },
            { name: "Buy", path: "/buy" },
            { name: "Rent", path: "/rent" },
            { name: "Add Listing", path: "/add-listing" },
            { name: "Blog", path: "/blog" },
            { name: "Contact Us", path: "/contact" },
          ].map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className={`${
                  isActive(path)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]"
                    : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
                } transition-all duration-300 text-sm font-medium`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-8 text-gray-800">
          {[
            { name: "All Properties", path: "/properties" },
            { name: "Buy", path: "/buy" },
            { name: "Rent", path: "/rent" },
            { name: "Add Listing", path: "/add-listing" },
            { name: "Manage", path: "/manage" },
            { name: "About Us", path: "/about-us" },
            { name: "Blog", path: "/blog" },
            { name: "Contact Us", path: "/contact" },
          ].map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className={`${
                  isActive(path)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]"
                    : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#014d98] hover:to-[#3ab7b1]"
                } transition-all duration-300 text-sm font-medium`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
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
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{cachedDisplayName}</span>
                  <span className="text-xs text-gray-500">{cachedRole}</span>
                </div>
              </div>
              
              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                  <Link href={getDashboardUrl()} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Home size={16} className="mr-3 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link href={`${getDashboardUrl()}/settings`} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={16} className="mr-3 text-gray-400" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleSignOutClick}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Sign In button for guests
            <Button label="Sign In" variant="primary" href="/signin" />
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? (
              <AiOutlineClose className="text-2xl text-gray-800" />
            ) : (
              <TbMenu4 className="text-2xl text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden mobile-menu-container bg-white border-t border-gray-200 transform transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}>
        {/* Navigation Links in Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 text-gray-800">
          {[
            { name: "All Properties", path: "/properties", icon: Home },
            { name: "Buy", path: "/buy", icon: Search },
            { name: "Rent", path: "/rent", icon: Home },
            { name: "Add Listing", path: "/add-listing", icon: PlusCircle },
            { name: "Manage", path: "/manage", icon: Settings },
            { name: "About Us", path: "/about-us", icon: InfoIcon },
            { name: "Blog", path: "/blog", icon: Newspaper },
            { name: "Contact Us", path: "/contact", icon: Settings },
          ].map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={`
                flex flex-col items-center justify-center
                px-3 py-4 rounded-xl 
                group 
                transition-all duration-300 
                hover:shadow-md 
                hover:scale-[1.02] 
                active:scale-95
                ${
                  isActive(path)
                    ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white shadow-lg"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-[#014d98]/30 hover:bg-white"
                }
              `}
              onClick={() => setMenuOpen(false)}
            >
              <Icon 
                className={`
                  mb-2
                  ${
                    isActive(path)
                      ? "text-white" 
                      : "text-[#014d98] group-hover:text-[#3ab7b1] transition-colors"
                  }
                `} 
                size={24} 
              />
              <span className="text-xs font-medium text-center leading-tight">{name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Profile Section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {isSignedIn ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md">
                  {cachedProfileImage ? (
                    <Image
                      src={cachedProfileImage}
                      alt={`${cachedDisplayName} Profile`}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      priority
                      unoptimized={cachedProfileImage.startsWith('data:')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-lg font-medium text-gray-500">
                        {cachedInitial}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{cachedDisplayName}</p>
                  <p className="text-xs text-gray-500">{cachedRole}</p>
                </div>
              </div>

              {/* Dashboard, Settings, Logout buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href={getDashboardUrl()}
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all hover:border-[#014d98]/30"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home size={20} className="mb-1 text-[#014d98]" />
                  Dashboard
                </Link>
                <Link
                  href={`${getDashboardUrl()}/settings`}
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all hover:border-[#014d98]/30"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={20} className="mb-1 text-[#014d98]" />
                  Settings
                </Link>
                <button
                  className="flex flex-col items-center justify-center bg-white border border-red-200 text-red-600 rounded-xl p-3 text-xs hover:bg-red-50 hover:shadow-sm transition-all hover:border-red-300"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowSignOutModal(true);
                  }}
                >
                  <LogOut size={20} className="mb-1 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/signin"
              className="w-full block text-center bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-4 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Click outside to close profile dropdown */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setProfileMenuOpen(false)}
        />
      )}

      {/* Improved Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSignOutModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm mx-4 relative z-10 w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowSignOutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <XCircle size={24} />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Are you sure you want to log out?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">You can log back in anytime to continue.</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;