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
import useLogout from "../../hooks/useLogout"; // Import the logout hook
import { 
  Search, 
  Home, 
  PlusCircle, 
  InfoIcon, // Changed from Info to InfoIcon
  Newspaper,
  Settings, // Changed from Cog to Settings
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const pathname = usePathname();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  
  // Get user data from context
  const { userData, profileImage, isLoading, userType } = useProfile() || {};
  
  // Import the logout hook
  const { logout } = useLogout();
  
  // Determine if user is signed in
  const isSignedIn = userData && Object.keys(userData).length > 0;
  
  // Get profile image when component mounts or when profile context changes
  useEffect(() => {
    if (profileImage) {
      setProfileImageUrl(profileImage);
    } else if (userData) {
      // Try to get from userData as backup
      const photoUrl = userData?.profile_photo_url || 
                      userData?.agent_profile?.profile_photo_url || 
                      userData?.client_profile?.profile_photo_url ||
                      userData?.data?.profile_photo_url;
      if (photoUrl) {
        setProfileImageUrl(photoUrl);
      } else {
        // Try to get from localStorage as final backup
        const savedImage = localStorage.getItem('profile_photo_url');
        if (savedImage) {
          setProfileImageUrl(savedImage);
        }
      }
      // Default placeholder if no image is found will be handled in the UI
    }
  }, [profileImage, userData]);

  const isActive = (path) => pathname === path;
  
  // Get user's first initial for avatar fallback (same as in TopNav)
  const getInitial = () => {
    const firstName = userData?.first_name || userData?.data?.first_name;
    return firstName ? firstName.charAt(0).toUpperCase() : "U"; // Default to "U" for User
  };
  
  // Get user display name based on the structure from /api/v1/users/me/ endpoint (same as in TopNav)
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

  // Get short name for mobile display (same as in TopNav)
  const getShortName = () => {
    const firstName = userData?.first_name || userData?.data?.first_name;
    return firstName || "User";
  };

  // Get user role based on user_type (same as in TopNav)
  const getUserRole = () => {
    const type = userType || userData?.user_type || userData?.data?.user_type;
    return type === "AGENT" ? "Agent" : "Client";
  };
  
  // Determine dashboard URL based on user type
  const getDashboardUrl = () => {
    const type = userType || userData?.user_type || userData?.data?.user_type;
    return type === "AGENT" ? "/agent-dashboard" : "/dashboard";
  };

  // Handle sign out confirmation
  const handleSignOutClick = () => {
    setProfileMenuOpen(false); // Close the profile menu first
    setShowSignOutModal(true); // Show confirmation modal
  };
  
  // Handle actual sign out - now uses the logout hook
  const handleConfirmSignOut = () => {
    logout();
    setShowSignOutModal(false);
  };

  return (
    <nav className="sticky top-0 left-0 right-0 w-full z-50 bg-[rgb(246,246,246)]">
      <div className="max-w-[95%] mx-auto flex justify-between items-center py-4 px-2 sm:px-6">
        {/* Logo */}
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
          <Link href="/">QARBA</Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-gray-800">
          {[
            { name: "Buy", path: "/buy" },
            { name: "Rent", path: "/rent" },
            { name: "Add Listing", path: "/add-listing" },
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
                } transition-all duration-300`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            // Profile image and dropdown for signed-in users
            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  {!isLoading && profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      key={profileImageUrl}
                      onError={(e) => {
                        setProfileImageUrl("https://i.pravatar.cc/150");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-xl font-medium text-gray-500">
                        {getInitial()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Display user name and role just like in TopNav */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{getUserDisplayName()}</span>
                  <span className="text-xs text-gray-500">{getUserRole()}</span>
                </div>
              </div>
              
              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href={getDashboardUrl()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link href={`${getDashboardUrl()}/settings`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOutClick}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
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
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <AiOutlineClose className="text-2xl text-gray-800" />
            ) : (
              <TbMenu4 className="text-2xl text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
  className={`md:hidden bg-gradient-to-b from-[rgb(246,246,246)] to-[rgb(203,228,221)] transform transition-all duration-500 ${
    menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
  } overflow-hidden`}
>
  {/* Navigation Links in Two-Column Grid */}
  <div className="grid grid-cols-2 gap-3 p-4 text-gray-800">
    {[
      { name: "Buy", path: "/buy", icon: Search },
      { name: "Rent", path: "/rent", icon: Home },
      { name: "Add Listing", path: "/add-listing", icon: PlusCircle },
      { name: "About Us", path: "/about-us", icon: InfoIcon }, // Fixed icon name
      { name: "Blog", path: "/blog", icon: Newspaper },
      { name: "Contact Us", path: "/contact", icon: Settings }, // Fixed icon name
    ].map(({ name, path, icon: Icon }) => (
      <Link
        key={path}
        href={path}
        className={`
          flex items-center justify-center
          px-3 py-3 rounded-xl 
          group 
          transition-all duration-300 
          hover:shadow-md 
          hover:scale-[1.02] 
          active:scale-95
          ${
            isActive(path)
              ? "bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-[#014d98]/30"
          }
        `}
        onClick={() => setMenuOpen(false)}
      >
        <Icon 
          className={`
            mr-2 
            ${
              isActive(path)
                ? "text-white" 
                : "text-[#014d98] group-hover:text-[#3ab7b1] transition-colors"
            }
          `} 
          size={20} 
        />
        <span className="text-xs font-medium">{name}</span>
      </Link>
    ))}
  </div>

  <div className="border-t border-gray-300 p-4">
    {isSignedIn ? (
      <div className="space-y-4">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300">
            {!isLoading && profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
                onError={() => setProfileImageUrl("https://i.pravatar.cc/150")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-sm font-medium text-gray-500">
                  {getInitial()}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{getShortName()}</p>
            <p className="text-xs text-gray-500">{getUserRole()}</p>
          </div>
        </div>

        {/* Dashboard, Settings, Logout in a Single Row */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={getDashboardUrl()}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all"
            onClick={() => setMenuOpen(false)}
          >
            <Home size={20} className="mb-1 text-[#014d98]" />
            Dashboard
          </Link>
          <Link
            href={`${getDashboardUrl()}/settings`}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all"
            onClick={() => setMenuOpen(false)}
          >
            <Settings size={20} className="mb-1 text-[#014d98]" /> {/* Fixed icon name */}
            Settings
          </Link>
          <button
            className="flex flex-col items-center justify-center bg-white border border-red-200 text-red-600 rounded-xl p-2 text-xs hover:bg-red-50 hover:shadow-sm transition-all"
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
        className="w-full block text-center bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-3 rounded-lg hover:opacity-90"
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSignOutModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4 relative z-10">
            {/* Close Button */}
            <button
              onClick={() => setShowSignOutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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