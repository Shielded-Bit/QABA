// // app/dashboard/layout.js

// import Sidebar from './components/sidebar';

// export default function DashboardLayout({ children }) {
//     return (
//         <div className="flex min-h-screen">
//             <aside className="w-64 bg-white shadow-md">
//                 <Sidebar />
//             </aside>

//             <main className="flex-1 overflow-y-auto bg-gray-100">
//                 {children}
//             </main>
//         </div>
//     );
// }

// app/dashboard/layout.js
import Sidebar from '../dashboard/components/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex ">
      {/* Sidebar - Static and Persistent */}
      <aside className="lg:w-60  shadow-md">
        <Sidebar />
      </aside>

      {/* Main Content - Dynamic Content Changes Here */}
      <main className="flex-1 overflow-y-auto bg-gray-100 ">
        {children}
      </main>
    </div>
  );
}
