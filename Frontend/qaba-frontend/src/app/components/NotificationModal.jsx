import React from "react";

const NotificationModal = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Today</span>
                    <button className="text-xs text-blue-600 hover:underline">Mark as read</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No notifications to display</p>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Close
          </button>
          {notifications && notifications.length > 0 && (
            <button className="px-4 py-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded hover:opacity-90 transition">
              Mark all as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;