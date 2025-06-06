"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import PropertyModal from "../components/propertyModal";
import { useNotifications } from "../../../contexts/NotificationContext";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  const openPropertyModal = () => {
    setIsPropertyModalOpen(true);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch properties');

        const data = await res.json();

        const latest = data.data
          .sort((a, b) => new Date(b.listed_date) - new Date(a.listed_date))
          .slice(0, 3)
          .map((item) => ({
            id: item.id,
            name: item.property_name,
            address: item.location,
            price: item.listing_type === 'RENT'
              ? `₦${Number(item.rent_price).toLocaleString()} / ${item.rent_frequency?.toLowerCase()}`
              : `₦${Number(item.sale_price).toLocaleString()}`,
            status: item.listing_type === 'RENT' ? 'Available for Rent' : 'Listed for Sale',
            image: item.thumbnail || 'https://via.placeholder.com/150',
          }));

        setProperties(latest);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="px-2 py-1">
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <PropertiesSection properties={properties} onViewAll={openPropertyModal} />
        <NotificationsSection />
      </div>

      <div className="flex flex-col space-y-4 md:hidden">
        <MobileSwiper items={[
          { 
            id: 'properties', 
            content: <PropertiesList properties={properties} onViewAll={openPropertyModal} /> 
          },
          { 
            id: 'notifications', 
            content: <NotificationsList /> 
          }
        ]} />
      </div>

      {/* Property Modal */}
      <PropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)}
      />
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

const PropertiesSection = ({ properties, onViewAll }) => (
  <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
    <Header title="Recent Added Properties" onViewAll={onViewAll} />
    <div className="space-y-3 mt-7">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  </div>
);

const NotificationsSection = () => {
  const { notifications = [], loading = true, error = null, markAsRead } = useNotifications() || {};

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-3 mt-7 max-h-[400px] overflow-y-auto">
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
          notifications.map((notification) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PropertiesList = ({ properties, onViewAll }) => (
  <div className="bg-white shadow-md rounded-lg p-4 w-full">
    <h2 className="text-lg font-semibold mb-4 text-gray-600">Recent Added Properties</h2>
    <div className="space-y-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
    <button 
      onClick={onViewAll}
      className="mt-4 text-center block w-full text-blue-600 hover:underline"
    >
      View All
    </button>
  </div>
);

const NotificationsList = () => {
  const { notifications = [], loading = true, error = null, markAsRead } = useNotifications() || {};

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-600">Notifications</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
          notifications.map((notification) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Updated PropertyCard with Next.js Link component instead of useRouter
const PropertyCard = ({ id, image, name, address, status, price }) => (
  <Link href={`/details/${id}`} passHref>
    <div className="flex items-start gap-2 border-b pb-3 last:border-b-0 w-full cursor-pointer hover:bg-gray-50 transition">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
        <Image src={image} alt={name} width={80} height={80} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{name}</h3>
          <p className="text-sm sm:text-base font-semibold text-[#014d98] whitespace-nowrap">{price}</p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{address}</p>
        <p className="text-xs text-green-600">{status}</p>
      </div>
    </div>
  </Link>
);

const NotificationCard = ({ notification, onMarkAsRead }) => (
  <div className={`border-b pb-3 last:border-b-0 w-full transition ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}>
    <div className="p-3">
      <p className="text-sm text-gray-800">{notification.message}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {new Date(notification.created_at).toLocaleDateString()}
        </span>
        {!notification.is_read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  </div>
);

const Header = ({ title, onViewAll }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    <button 
      onClick={onViewAll}
      className="text-sm bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg px-5 py-2 transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
    >
      View All
    </button>
  </div>
);

export default Dashboard;