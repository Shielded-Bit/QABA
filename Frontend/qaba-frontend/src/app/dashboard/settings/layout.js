// settings/layout.js


export default function SettingsLayout({ children }) {
  return (
    <div className="dashboard-header lg:ml-4 ml-3">     
      {/* Main Content */}
      <div className="flex-1 p-3">
        {children}
      </div>
    </div>
  );
}