// layout.js

export default function MessagesLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="px-4 lg:px-6 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Messages
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Communicate with property seekers and manage your conversations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        {children}
      </div>
    </div>
  );
}