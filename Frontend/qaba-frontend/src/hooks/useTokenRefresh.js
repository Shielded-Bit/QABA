"use client";

import { useEffect, useRef } from 'react';
import { getTokenExpiryTime, isTokenExpired, isTokenExpiringSoon } from '../utils/jwt';
import { refreshAccessToken, handleSessionExpiration } from '../utils/authHandler';

/**
 * Proactive Token Refresh Hook
 * Automatically refreshes access tokens BEFORE they expire
 *
 * Features:
 * - Schedules refresh 5 minutes before token expiry
 * - Handles tab visibility changes (refreshes when tab becomes visible)
 * - Prevents duplicate refreshes
 * - Logs out user if refresh fails
 */
export function useTokenRefresh() {
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);

  /**
   * Schedule token refresh based on token expiry time
   */
  const scheduleTokenRefresh = () => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');

    // No token, no refresh needed
    if (!token) {
      console.log('No access token found - skipping refresh schedule');
      return;
    }

    try {
      // Get token expiry time
      const expiryTime = getTokenExpiryTime(token);

      if (expiryTime === 0) {
        console.warn('Could not determine token expiry time');
        return;
      }

      // Calculate when to refresh (5 minutes before expiry)
      const refreshBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
      const timeUntilExpiry = expiryTime - Date.now();
      const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

      console.log(`Token expires in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`);

      // If token is already expired or expiring very soon
      if (timeUntilRefresh <= 0) {
        console.log('Token expired or expiring soon - refreshing immediately');
        performTokenRefresh();
        return;
      }

      // Schedule refresh for the calculated time
      console.log(`Scheduling token refresh in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);

      refreshTimeoutRef.current = setTimeout(() => {
        performTokenRefresh();
      }, timeUntilRefresh);

    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  };

  /**
   * Perform the actual token refresh
   */
  const performTokenRefresh = async () => {
    // Prevent duplicate refresh attempts
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress - skipping');
      return;
    }

    isRefreshingRef.current = true;

    try {
      console.log('Refreshing access token...');

      const newToken = await refreshAccessToken();

      if (newToken) {
        console.log('✅ Token refreshed successfully');

        // Schedule the next refresh based on new token
        scheduleTokenRefresh();
      } else {
        console.error('❌ Token refresh failed - logging out user');
        handleSessionExpiration('Your session has expired. Please log in again.');
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      handleSessionExpiration('Your session has expired. Please log in again.');
    } finally {
      isRefreshingRef.current = false;
    }
  };

  /**
   * Check token status when tab becomes visible
   */
  const handleVisibilityChange = () => {
    // Only check when tab becomes visible
    if (document.hidden) return;

    console.log('Tab became visible - checking token status');

    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');

    if (!token) {
      console.log('No token found on visibility change');
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('Token expired while tab was hidden - refreshing immediately');
      performTokenRefresh();
    }
    // Check if token is expiring soon (within 5 minutes)
    else if (isTokenExpiringSoon(token, 5)) {
      console.log('Token expiring soon - refreshing proactively');
      performTokenRefresh();
    }
    else {
      console.log('Token still valid - rescheduling refresh');
      scheduleTokenRefresh();
    }
  };

  /**
   * Initialize token refresh on mount
   */
  useEffect(() => {
    console.log('Initializing proactive token refresh');

    // Schedule initial refresh
    scheduleTokenRefresh();

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log('Cleaning up token refresh hook');

      // Clear timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Remove event listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array - only run once on mount

  /**
   * Re-schedule if user logs in during session
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      // If access token changed, reschedule
      if (e.key === 'access_token' && e.newValue) {
        console.log('Access token changed - rescheduling refresh');
        scheduleTokenRefresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // This hook doesn't return anything - it just runs in the background
}

export default useTokenRefresh;
