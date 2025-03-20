"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Custom Tooltip
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

// Monthly Revenue Component
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

  // Data for all months
  const data = [
    { name: "Feb", sales: 30 },
    { name: "Mar", sales: 20 },
    { name: "Apr", sales: 40 },
    { name: "May", sales: 15 },
    { name: "Jun", sales: 70 },
    { name: "Jul", sales: 50 },
    { name: "Aug", sales: 35 },
    { name: "Sep", sales: 45 },
    { name: "Oct", sales: 55 },
    { name: "Nov", sales: 25 },
    { name: "Dec", sales: 35 },
    { name: "Jan", sales: 15 },
  ];

  const filteredData = isMobile ? data.slice(0, 4) : data; // Show only 4 bars on mobile
  const barSize = isMobile ? 40 : 50; // Adjust bar size for mobile screens

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-gray-600">
      <h2 className="text-sm font-medium text-gray-400 mb-1">Monthly Revenue</h2>
      <h3 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">
        ₦ <span className="text-xl sm:text-3xl">70,000,000</span>
      </h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData} barCategoryGap={isMobile ? 20 : 10}> {/* Add barCategoryGap for spacing */}
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="sales"
            barSize={barSize} // Dynamic bar size
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

export default MonthlyRevenue;
