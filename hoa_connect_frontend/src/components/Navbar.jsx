import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Bell,
  Users,
  FileText,
  DollarSign,
  Home,
  BarChart2,
  Settings,
} from "lucide-react";

const Navbar = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    // <header className="bg-white shadow-sm flex items-center justify-between px-6 py-3">
    //   <h2 className="text-lg font-semibold">{title}</h2>
    //   <div className="flex items-center gap-4">
    //     <span className="text-gray-600 text-sm">{user?.name || "Super Admin"}</span>
    //     <button
    //       onClick={logout}
    //       className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </header>
    // <nav className="flex items-center justify-between bg-white shadow px-6 py-4">
    //   <h1 className="text-xl font-semibold">{title}</h1>
    //   <div className="flex items-center space-x-4">
    //     <span className="font-medium">Super Admin</span>
    //     <button className="bg-black text-white px-3 py-1 rounded-md">Logout</button>
    //   </div>
    // </nav>
    // <nav className="bg-blue-600 text-white p-4 flex justify-between">
    //   <h1 className="font-bold text-lg">My Dashboard</h1>
    //   <div>User Menu</div>
    // </nav>
    <nav className="flex-1 p-4 space-y-2">
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
                <Bell size={18} /> Announcements
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <Users size={18} /> Residents
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <FileText size={18} /> Complaints
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <DollarSign size={18} /> Payments
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <Home size={18} /> Amenities
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <BarChart2 size={18} /> Analytics
              </button>
    
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                <Settings size={18} /> Settings
              </button>
            </nav>
  );
};

export default Navbar;