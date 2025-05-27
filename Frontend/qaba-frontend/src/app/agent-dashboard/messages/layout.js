// layout.js

export default function SettingsLayout({ children }) {
  return (
    <div className="dashboard-header lg:ml-4 ml-3">
      <div className="mb-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent text-gradient py-4">
          Messages
        </h1>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-3">{children}</div>
    </div>
  );
}