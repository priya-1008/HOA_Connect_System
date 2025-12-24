// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home, Users, DollarSign, Bell, Settings } from "lucide-react";

// const Sidebar = () => {
//   const location = useLocation();

//   const links = [
//     { name: "Dashboard", path: "/superadmin/dashboard", icon: <Home size={18} /> },
//     { name: "Communities", path: "/superadmin/communities", icon: <Users size={18} /> },
//     { name: "Admins", path: "/superadmin/admins", icon: <Settings size={18} /> },
//     { name: "Payments", path: "/superadmin/payments", icon: <DollarSign size={18} /> },
//     { name: "Notifications", path: "/superadmin/notifications", icon: <Bell size={18} /> },
//   ];

//   return (
//     // <aside className="w-64 bg-white shadow-md h-screen hidden md:flex flex-col">
//     //   <div className="p-6 text-xl font-bold text-blue-600">HOA Connect</div>
//     //   <nav className="flex-1 p-2">
//     //     {links.map((link) => (
//     //       <Link
//     //         key={link.name}
//     //         to={link.path}
//     //         className={`flex items-center gap-2 px-4 py-2 rounded-md mb-1 hover:bg-blue-50 ${
//     //           location.pathname === link.path ? "bg-blue-100 text-blue-700" : "text-gray-700"
//     //         }`}
//     //       >
//     //         {link.icon}
//     //         {link.name}
//     //       </Link>
//     //     ))}
//     //   </nav>
//     // </aside>
//     <aside className="w-64 bg-white shadow-md flex flex-col">
//         <div className="p-6 text-blue-700 text-2xl font-bold border-b border-gray-100">
//           HOA Connect
//         </div>
//     </aside>
//   );
// };

// export default Sidebar;

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 font-bold text-xl border-b border-gray-700">HOA Connect</div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Communities</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Admins</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Payments</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Reports</a>
      </nav>
    </aside>
  )
}