// file: components/Dashboard.js

import React, { useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

const properties = [
  { id: 1, name: "Dream Family Home", address: "555 W Madison St, Abakiliki, Ebonyi State.", price: "₦1,250,000", status: "Available for rent", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1740503241/house3_nrrvak.png" },
  { id: 2, name: "Luxury Villa", address: "No 23, Lekki Phase 1, Lagos.", price: "₦11,000,000", status: "Listed for Sale", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1740503241/house1_drcxcq.png" },
  { id: 3, name: "Modern Duplex", address: "100 Unity Estate, Enugu.", price: "₦1,250,000", status: "Available for rent", image: "https://res.cloudinary.com/ddzaww11y/image/upload/v1740503241/house2_x3rfh6.png" },
];

const notifications = [
  { id: 1, title: "Price Drop Alert", message: "Good news! The price of Luxury Villa has dropped by 10%. Check it out now" },
  { id: 2, title: "New Message from Agent", message: "You have a new message from Ekene regarding Modern Duplex." },
  { id: 3, title: "New Message from Agent", message: "You have a new message from Ekene regarding Modern Duplex." },
  { id: 4, title: "New Message from Agent", message: "You have a new message from Ekene regarding Modern Duplex." },
];

const Dashboard = () => (
  <div className="px-2 py-1">
    <div className="hidden md:grid md:grid-cols-2 gap-4">
      <PropertiesSection />
      <NotificationsSection />
    </div>

    {/* Mobile Swiper */}
    <div className="flex flex-col space-y-4 md:hidden">
      <MobileSwiper items={[
        { id: 'properties', content: <PropertiesList /> },
        { id: 'notifications', content: <NotificationsList /> }
      ]} />
    </div>
  </div>
);

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

const PropertiesSection = () => (
  <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
    <Header title="Recent Added Properties  " />
    <div className="space-y-3 mt-7">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  </div>
);

const NotificationsSection = () => (
  <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
    <Header title="Notifications" />
    <div className="space-y-3 mt-7">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
    </div>
  </div>
);

const PropertiesList = () => (
  <div className="bg-white shadow-md rounded-lg p-4 w-full">
    <h2 className="text-lg font-semibold mb-4  text-gray-600">Recent Added Properties</h2>
    <div className="space-y-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
    <a href="#" className="mt-4 text-center block text-blue-600 hover:underline">View All</a>
  </div>
);

const NotificationsList = () => (
  <div className="bg-white shadow-md rounded-lg p-4 w-full">
    <h2 className="text-lg font-semibold mb-4 text-gray-600">Notifications</h2>
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
    </div>
    <a href="#" className="mt-4 text-center block text-blue-600 hover:underline">View All</a>
  </div>
);

const PropertyCard = ({ image, name, address, status, price }) => (
  <div className="flex items-start gap-2 border-b pb-3 last:border-b-0 w-full cursor-pointer hover:bg-gray-50 transition">
    {/* Image */}
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
      <Image src={image} alt={name} width={80} height={80} className="object-cover w-full h-full" />
    </div>

    {/* Text Block - Reduced Gap */}
    <div className="flex-1 min-w-0 space-y-1">
      {/* Top Row: Name and Price */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{name}</h3>
        <p className="text-sm sm:text-base font-semibold text-[#014d98] whitespace-nowrap">{price}</p>
      </div>

      {/* Address and Status directly underneath */}
      <p className="text-xs sm:text-sm text-gray-500 truncate">{address}</p>
      <p className="text-xs text-green-600">{status}</p>
    </div>
  </div>
);

const NotificationCard = ({ title, message }) => (
  <div className="border-b pb-3 last:border-b-0 w-full cursor-pointer hover:bg-gray-50 transition">
    <h3 className="font-semibold text-sm sm:text-base text-gray-800">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-500">{message}</p>
  </div>
);

const Header = ({ title }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    <a href="#" className="text-sm bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg px-5 py-2 transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]">
      View All
    </a>
  </div>
);

export default Dashboard;
