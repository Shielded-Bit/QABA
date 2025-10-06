import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { handle401Error, getAuthToken } from '../utils/authHandler';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create the context
const NotificationContext = createContext();

// Authentication and API Helpers
const getToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }
  return null;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        // No token - user not logged in, skip silently
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle 401 errors (session expired)
      if (response.status === 401) {
        console.warn('Session expired while fetching notifications');
        handle401Error(response, new Error('Session expired'));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setNotifications(data);
      
      // Calculate unread count
      const unread = data.filter(notification => !notification.is_read).length;
      setUnreadCount(unread);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Use PATCH for marking as read
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle 401 errors (session expired)
      if (response.status === 401) {
        handle401Error(response, new Error('Session expired'));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update the local state to reflect the change
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? {...notification, is_read: true} 
            : notification
        )
      );
      
      // Decrease unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      throw err;
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling if needed
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        loading, 
        error, 
        fetchNotifications, 
        markAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);