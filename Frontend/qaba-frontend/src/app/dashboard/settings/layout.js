// settings/layout.js
import Link from 'next/link';
import Header1 from '../components/header1';

export default function SettingsLayout({ children }) {
  return (
    <div className="dashboard-header lg:ml-4 ml-3">     
        <Header1 />
      {/* Main Content */}
      <div className="flex-1 p-3">
        {children}
      </div>
    </div>
  );
}