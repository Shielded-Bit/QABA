"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white text-sm px-2 py-1 rounded-md">
        ₦ {Number(payload[0].value).toLocaleString()}
      </div>
    );
  }
  return null;
};

const monthOrder = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const getMonthShort = (month) => month.slice(0, 3);

// Skeleton Component
const RevenueSkeleton = () => (
  <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
    <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
    <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
    <div className="w-full h-[300px] bg-gray-100 rounded" />
  </div>
);

// Monthly Revenue Component
const MonthlyRevenue = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch(
          `${API_BASE_URL}/api/v1/analytics/agent/?period_type=monthly&year=${new Date().getFullYear()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'accept': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const resData = await response.json();
        const months = resData.data?.filter((d) => monthOrder.includes(d.period));
        const total = resData.data?.find((d) => d.period === "Total");
        setTotalRevenue(total ? Number(total.total_revenue) : 0);
        setData(
          months.map((m) => ({
            name: getMonthShort(m.period),
            sales: Number(m.total_revenue),
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const filteredData = isMobile ? data.slice(-4) : data; // Show only last 4 bars on mobile
  const barSize = isMobile ? 40 : 50;

  if (loading) return <RevenueSkeleton />;
  if (error) return <div className="w-full text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-gray-600">
      <h2 className="text-sm font-medium text-gray-400 mb-1">Monthly Revenue</h2>
      <h3 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">
        ₦ <span className="text-xl sm:text-3xl">{Number(totalRevenue).toLocaleString()}</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData} barCategoryGap={isMobile ? 20 : 10}>
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="sales"
            barSize={barSize}
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
                  rx="4"
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
