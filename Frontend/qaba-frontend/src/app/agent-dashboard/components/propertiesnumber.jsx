import React, { useEffect, useState } from "react";
import {
  Landmark,
  CircleDollarSign,
  Key,
  HousePlus,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ICONS = {
  total: Landmark,
  sold: CircleDollarSign,
  pending: Key,
  published: HousePlus,
};

const getStatsFromTotal = (total) => [
  { icon: ICONS.total, label: "Total Properties", value: total?.total_properties ?? 0 },
  { icon: ICONS.sold, label: "Sold Properties", value: total?.sold_properties ?? 0 },
  { icon: ICONS.pending, label: "Pending Properties", value: total?.pending_properties ?? 0 },
  { icon: ICONS.published, label: "Published Properties", value: total?.published_properties ?? 0 },
];

const PropertyStatsDesktop = ({ stats }) => (
  <div className="hidden md:grid grid-cols-4 gap-4 justify-center p-1 w-full">
    {stats.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

const PropertyStatsMobile = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-6 justify-center px-1 sm:px-4 w-full md:hidden">
    {stats.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

const StatCard = ({ stat }) => {
  const IconComponent = stat.icon;
  return (
    <div
      className="bg-white shadow-md rounded-xl p-7 flex flex-col items-start transition-transform transform hover:scale-105 hover:shadow-lg w-full max-w-[1100px] mx-auto md:max-w-none relative z-0"
    >
      <div className="mb-2">
        <IconComponent className="text-cyan-500 text-xl md:text-3xl" />
      </div>
      <p className="text-gray-600 text-[10px] md:text-sm">{stat.label}</p>
      <p className="text-lg md:text-xl font-bold">{stat.value}</p>
    </div>
  );
};

const StatsSkeleton = () => (
  <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-gray-100 shadow-md rounded-xl p-7 flex flex-col items-start w-full max-w-[1100px] mx-auto md:max-w-none relative z-0">
        <div className="mb-2 w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-1/3 bg-gray-300 rounded" />
      </div>
    ))}
  </div>
);

const PropertyStats = () => {
  const [stats, setStats] = useState(getStatsFromTotal({}));
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
        const data = await response.json();
        const total = data.data?.find((d) => d.period === "Total");
        setStats(getStatsFromTotal(total));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <StatsSkeleton />;
  if (error) return <div className="w-full text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="w-full">
      <PropertyStatsMobile stats={stats} />
      <PropertyStatsDesktop stats={stats} />
    </div>
  );
};

export default PropertyStats;