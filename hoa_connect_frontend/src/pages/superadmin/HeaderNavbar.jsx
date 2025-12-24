import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

// 🧭 Reusable Sidebar Link
const NavLink = ({ icon: Icon, label, onClick, isActive }) => {
  const base =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold";
  const active =
    "bg-teal-600 text-white shadow-md hover:bg-teal-700 dark:bg-gradient-to-r dark:from-teal-600 dark:to-teal-500";
  const inactive =
    "text-slate-700 hover:bg-teal-100 dark:text-teal-200 dark:hover:bg-slate-800";
  return (
    <button onClick={onClick} className={`${base} ${isActive ? active : inactive}`}>
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
};

const HeaderNavbar = ({ children }) => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-teal-100" : "bg-blue-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-2xl transition-colors duration-300 ${
          darkMode
            ? "bg-teal-700 border-b border-teal-900 text-teal-100"
            : "bg-teal-700 border-b border-teal-400 text-white"
        }`}
      >
        <h1 className="text-4xl font-extrabold flex items-center gap-2">
          🏘️ HOA Connect System
        </h1>
        <button
          onClick={handleDarkModeToggle}
          className="flex items-center justify-center p-3 rounded-full bg-white dark:bg-teal-900 hover:bg-teal-100 dark:hover:bg-teal-800 shadow-lg transition-all"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-teal-700" />
          )}
        </button>
      </header>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-xl transition-colors duration-300 ${
            darkMode
              ? "bg-slate-900 text-teal-100 border-r border-slate-800"
              : "bg-slate-100 text-slate-900 border-r border-slate-200"
          }`}
        >
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLink
              icon={HomeIcon}
              label="Dashboard"
              isActive={window.location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
            />
            <NavLink
              icon={BuildingOffice2Icon}
              label="Communities"
              isActive={window.location.pathname === "/manage-communities"}
              onClick={() => navigate("/manage-communities")}
            />
            <NavLink
              icon={UsersIcon}
              label="Amenities"
              isActive={window.location.pathname === "/manage-amenities"}
              onClick={() => navigate("/manage-amenities")}
            />
            <NavLink
              icon={BellIcon}
              label="Notifications"
              isActive={window.location.pathname === "/notifications"}
              onClick={() => navigate("/notifications")}
            />
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-800 transition-all font-semibold shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>
        {/* Content Area */}
        <div
          className={`flex-1 overflow-y-auto min-h-screen transition-colors duration-300 p-8
            ${darkMode ? "bg-slate-950 text-teal-100" : "bg-blue-50 text-slate-900"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderNavbar;
