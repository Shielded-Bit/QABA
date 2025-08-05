"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SOLD_COLOR = "rgba(7, 86, 155, 1)";
const RENTED_COLOR = "rgba(54, 174, 175, 1)";

const PropertyStatsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-64 bg-gray-100 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      {/* Left bars */}
      <div className="flex gap-4 items-end">
        <div className="flex flex-col items-center">
          <div className="h-4 w-10 bg-gray-200 rounded mb-2" />
          <div className="w-14 h-24 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 w-10 bg-gray-200 rounded mb-2" />
          <div className="w-14 h-16 bg-gray-100 rounded-lg" />
        </div>
      </div>
      {/* Donut chart */}
      <div className="flex justify-center">
        <div className="w-[220px] h-[220px] bg-gray-100 rounded-full" />
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default function PropertyStats() {
  const [sold, setSold] = useState(0);
  const [rented, setRented] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const total = resData.data?.find((d) => d.period === "Total");
        setSold(Number(total?.sold_properties ?? 0));
        setRented(Number(total?.rented_properties ?? 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const total = sold + rented;
  const soldPercent = total > 0 ? Math.round((sold / total) * 100) : 0;
  const rentedPercent = total > 0 ? Math.round((rented / total) * 100) : 0;
  const chartData = [
    { name: "Sold", value: sold, color: SOLD_COLOR },
    { name: "Rented", value: rented, color: RENTED_COLOR },
  ];

  if (loading) return <PropertyStatsSkeleton />;
  if (error) return <div className="w-full text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">Property Overview</h2>
        <p className="text-gray-500 text-xs md:text-base">
          This chart provides a clear breakdown of the listing type that gets a lot of engagement
        </p>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Section (Bars for Sold & Rented) */}
        <div className="flex gap-4 items-end">
          {/* Sold Bar */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {sold} <span className="text-[rgba(7,86,155,1)]">Sold</span>
            </p>
            <div className="w-14" style={{ height: sold === 0 && rented === 0 ? 0 : `${80 + (soldPercent * 1.2)}px`, background: SOLD_COLOR, borderRadius: '0.5rem' }}></div>
          </div>
          {/* Rented Bar */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {rented} <span className="text-[rgba(54,174,175,1)]">Rented</span>
            </p>
            <div className="w-14" style={{ height: sold === 0 && rented === 0 ? 0 : `${80 + (rentedPercent * 1.2)}px`, background: RENTED_COLOR, borderRadius: '0.5rem' }}></div>
          </div>
        </div>
        {/* Middle Section (Thicker Donut Chart) */}
        <div className="flex justify-center">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Right Section (Legend and % Display) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ background: SOLD_COLOR, borderRadius: '0.25rem' }}></div>
            <p className="text-gray-900">
              Sold Homes <span className="text-[rgba(7,86,155,1)] font-semibold">{soldPercent}%</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ background: RENTED_COLOR, borderRadius: '0.25rem' }}></div>
            <p className="text-gray-900">
              Rented Homes <span className="text-[rgba(54,174,175,1)] font-semibold">{rentedPercent}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
