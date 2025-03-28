import {
  Landmark,
  CircleDollarSign,
  Key,
  HousePlus,
} from "lucide-react";

// Shared data
const stats = [
  { icon: Landmark, label: "Total Properties", value: 20 },
  { icon: CircleDollarSign, label: "Sold Properties", value: 10 },
  { icon: Key, label: "Pending Properties", value: 20 },
  { icon: HousePlus, label: "Publish Properties", value: 15 },
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
  <div className="grid grid-cols-2 gap-3 justify-center px-2 sm:px-5  w-full md:hidden">
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
