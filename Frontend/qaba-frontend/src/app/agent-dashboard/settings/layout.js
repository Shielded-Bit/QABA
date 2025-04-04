import { ProfileProvider } from "../../../contexts/ProfileContext";

export default function SettingsLayout({ children }) {
  return (
    <ProfileProvider>
      <div className="dashboard-header lg:ml-4 ml-3">
        {/* Main Content */}
        <div className="flex-1 p-3">
          {children}
        </div>
      </div>
    </ProfileProvider>
  );
}
