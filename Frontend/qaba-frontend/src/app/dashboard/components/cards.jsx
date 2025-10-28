"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { useNotifications } from "../../../contexts/NotificationContext";
import { PropertyCardSkeleton } from "../components/LoadingSkeletons";
import { createPropertySlug } from "@/utils/slugHelper";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      {/* Desktop view with grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <PropertiesSection properties={properties} isLoading={isLoading} />
        <NotificationsSection />
      </div>

      {/* Mobile view - only show properties */}
      <div className="block md:hidden">
        <PropertiesList properties={properties} isLoading={isLoading} />
      </div>
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

const PropertiesSection = ({ properties, isLoading }) => (
  <div className="bg-white shadow-md rounded-lg p-4 text-gray-600">
    <Header title="Recent Added Properties" />
    <div className="space-y-3 mt-7">
      {isLoading
        ? [...Array(3)].map((_, idx) => <PropertyCardSkeleton key={idx} />)
        : properties.map((property) => (
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
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-start gap-2 border-b pb-3 last:border-b-0 w-full animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))
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

const NotificationsList = () => {
  const { notifications = [], loading = true, error = null, markAsRead } = useNotifications() || {};

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-600">Notifications</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-start gap-2 border-b pb-3 last:border-b-0 w-full animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))
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

const PropertiesList = ({ properties, isLoading }) => (
  <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 w-full">
    <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-600">Recent Added Properties</h2>
    <div className="space-y-3">
      {isLoading
        ? [...Array(3)].map((_, idx) => <PropertyCardSkeleton key={idx} />)
        : properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
    </div>
    <Link 
      href="/dashboard/all-listed-properties"
      className="mt-3 sm:mt-4 text-center block w-full text-blue-600 hover:underline"
    >
      View All
    </Link>
  </div>
);

// Updated PropertyCard with Next.js Link component instead of useRouter
const PropertyCard = ({ id, image, name, address, status, price }) => (
  <Link href={`/details/${createPropertySlug(name, id)}`} passHref>
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
  <div className={`border-b pb-3 last:border-b-0 w-full transition ${notification.is_read ? 'bg-white' : 'bg-blue-50 rounded-lg'}`}>
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

const Header = ({ title }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    <a 
      href="/dashboard/all-listed-properties"
      className="text-sm bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-lg px-5 py-2 transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
    >
      View All
    </a>
  </div>
);

export default Dashboard;