"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
const data = [
  { name: "Sold", value: 143, color: "rgba(7, 86, 155, 1)" },
  { name: "Rented", value: 34, color: "rgba(54, 174, 175, 1)" },
];

export default function PropertyStats() {
  const [startDate, setStartDate] = useState(new Date("2024-12-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
{/* Section Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
  {/* Left Side (Text) */}
  <div className="md:max-w-[60%]">
    <h2 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#1d86a9] to-[#3ab7b1]">Property Overview</h2>
    <p className="text-gray-500 text-xs md:text-base">
      This chart provides a clear breakdown of the listing type that gets a lot of engagement
    </p>
  </div>

  {/* Right Side (Date Selector) */}
  <div className="mt-4 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer w-full md:w-auto">
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd MMM"
      selectsStart
      startDate={startDate}
      endDate={endDate}
      className="outline-none w-20 md:w-24 bg-transparent text-gray-600 text-sm md:text-base"
    />
    <span className="text-gray-500">-</span>
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      dateFormat="dd MMM yyyy"
      selectsEnd
      startDate={startDate}
      endDate={endDate}
      className="outline-none w-24 md:w-28 bg-transparent text-gray-600 text-sm md:text-base"
    />
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </div>
</div>


      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Section (Bars for Sold & Rented) */}
        <div className="flex gap-4 items-end">
          {/* Sold Bar */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              143 <span className="text-[rgba(7,86,155,1)]">Sold</span>
            </p>
            <div className="w-14 h-28 bg-[rgba(7,86,155,1)] rounded-lg"></div>
          </div>

          {/* Rented Bar */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              34 <span className="text-[rgba(54,174,175,1)]">Rented</span>
            </p>
            <div className="w-14 h-20 bg-[rgba(54,174,175,1)] rounded-lg"></div>
          </div>
        </div>

        {/* Middle Section (Thicker Donut Chart) */}
        <div className="flex justify-center">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Section (Legend and % Display) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[rgba(7,86,155,1)] rounded"></div>
            <p className="text-gray-900">
              Sold Homes <span className="text-[rgba(7,86,155,1)] font-semibold">87%</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[rgba(54,174,175,1)] rounded"></div>
            <p className="text-gray-900">
              Rented Homes <span className="text-[rgba(54,174,175,1)] font-semibold">13%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
