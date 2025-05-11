import {
  Landmark,
  DollarSign,
  Key,
  Bookmark,
} from "lucide-react";

// Shared data
const stats = [
  { icon: Landmark, label: "Total Properties", value: 200 },
  { icon: DollarSign, label: "Bought Properties", value: 80 },
  { icon: Key, label: "Rented Properties", value: 80 },
  { icon: Bookmark, label: "Saved Properties", value: 80 },
];

// Desktop version - 4 columns
const PropertyStatsDesktop = () => (
  <div className="hidden md:grid grid-cols-4 gap-4 justify-center p-1 w-full">
    {stats.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

// Mobile version - 2 columns
const PropertyStatsMobile = () => (
  <div className="grid grid-cols-2 gap-3 justify-center px-0 w-full md:hidden">
    {stats.map((stat, index) => (
      <StatCard key={index} stat={stat} />
    ))}
  </div>
);

// Reusable StatCard component for both
const StatCard = ({ stat }) => {
  const IconComponent = stat.icon;
  return (
    <div
      className="bg-white shadow-md rounded-xl p-7 flex flex-col items-start 
                 transition-transform transform hover:scale-105 hover:shadow-lg
                 w-full max-w-[1100px] mx-auto md:max-w-none"
    >
      <div className="mb-2">
        <IconComponent className="text-cyan-500 text-xl md:text-3xl" />
      </div>
      <p className="text-gray-600 text-[10px] md:text-sm">{stat.label}</p>
      <p className="text-lg md:text-xl font-bold">{stat.value}</p>
    </div>
  );
};

// Parent component
const PropertyStats = () => (
  <div className="w-full">
    <PropertyStatsMobile />
    <PropertyStatsDesktop />
  </div>
);

export default PropertyStats;
