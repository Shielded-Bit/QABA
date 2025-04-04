"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNotifications, NotificationProvider } from "../../../contexts/NotificationContext";

// Sales data
const data = [
  { name: "Feb", sales: 30 },
  { name: "Mar", sales: 20 },
  { name: "Apr", sales: 40 },
  { name: "May", sales: 15 },
  { name: "Jun", sales: 70 }, // Active bar
  { name: "Jul", sales: 50 },
  { name: "Aug", sales: 35 },
  { name: "Sep", sales: 45 },
];

// Wrapper component that ensures the NotificationProvider is available
const DashboardWithProvider = () => (
  <NotificationProvider>
    <Dashboard />
  </NotificationProvider>
);

const Dashboard = () => (
  <div className="px-2 py-1">
    <div className="hidden md:grid md:grid-cols-2 gap-4">
      <MonthlyRevenue />
      <NotificationsSection />
    </div>

    {/* Mobile Swiper */}
    <div className="flex flex-col space-y-4 md:hidden">
      <MobileSwiper items={[
        { id: 'sales', content: <MonthlyRevenue /> },
        { id: 'notifications', content: <NotificationsList /> }
      ]} />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white text-sm px-2 py-1 rounded-md">
        ₦ {payload[0].value},000,000
      </div>
    );
  }
  return null;
};

const MonthlyRevenue = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile if screen width is <= 768px
    };
    handleResize(); // Run on component mount
    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize); // Clean up listener
  }, []);

  const filteredData = isMobile ? data.slice(0, 4) : data; // Show only 4 bars on mobile

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-gray-600">
      <h2 className="text-sm font-medium text-gray-400 mb-1">Monthly Revenue</h2>
      <h3 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">
        ₦ <span className="text-xl sm:text-3xl">70,000,000</span>
      </h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="sales"
            barSize={50}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              const isMax = payload.sales === Math.max(...data.map((d) => d.sales));
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={isMax ? "url(#gradient)" : "rgba(209, 213, 219, 0.5)"}
                  rx="4" // Border radius
                  ry="4"
                />
              );
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#014d98" />
              <stop offset="100%" stopColor="#3ab7b1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component that safely uses the context
const NotificationsSection = () => {
  const notificationsContext = useNotifications();
  
  // Check if context is undefined and provide fallback values
  const { 
    notifications = [], 
    loading = true, 
    error = null, 
    markAsRead = () => {} 
  } = notificationsContext || {};

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          Error loading notifications: {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No notifications at this time
        </div>
      ) : (
        <div className="space-y-3 mt-7">
          {notifications.map((notification) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component that safely uses the context
const NotificationsList = () => {
  const notificationsContext = useNotifications();
  
  // Check if context is undefined and provide fallback values
  const { 
    notifications = [], 
    loading = true, 
    error = null, 
    markAsRead = () => {} 
  } = notificationsContext || {};

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-600">Notifications</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          Error loading notifications: {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No notifications at this time
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard 
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      )}
      
      {!loading && !error && notifications.length > 0 && (
        <a href="/notifications" className="mt-4 text-center block text-blue-600 hover:underline">
          View All
        </a>
      )}
    </div>
  );
};

const NotificationCard = ({ notification, onMarkAsRead }) => {
  const { id, message, is_read, created_at } = notification;
  
  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className={`border-b pb-3 last:border-b-0 w-full cursor-pointer hover:bg-gray-50 transition ${!is_read ? 'bg-blue-50' : ''}`}
      onClick={() => !is_read && onMarkAsRead()}
    >
      <div className="flex justify-between items-start">
        <p className="text-xs sm:text-sm text-gray-500">{message}</p>
        {!is_read && (
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
    </div>
  );
};

const MobileSwiper = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev)),
    onSwipedRight: () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="relative w-full overflow-hidden" {...handlers}>
      <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardWithProvider;