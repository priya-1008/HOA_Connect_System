import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  BellIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const hoaAdminName = "ADMIN";

const NAV_LINKS = [
  { label: "Dashboard", icon: HomeIcon, path: "/admin-dashboard" },
  { label: "Residents", icon: UsersIcon, path: "/residents" },
  { label: "Announcements", icon: MegaphoneIcon, path: "/announcements" },
  { label: "Complaints", icon: ClipboardDocumentListIcon, path: "/complaints" },
  { label: "Amenities", icon: BuildingOffice2Icon, path: "/amenities" },
  { label: "Documents", icon: FolderIcon, path: "/documents" },
  { label: "Meetings", icon: ChatBubbleBottomCenterTextIcon, path: "/meetings" },
  { label: "Payments", icon: CurrencyDollarIcon, path: "/track-payments" },
  { label: "Notifications", icon: BellIcon, path: "/notification" },
  { label: "Polls", icon:  ChartBarIcon, path: "/polls" },
];

const SidebarLink = ({ icon: Icon, label, path, isActive, collapsed, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={` text-lg flex items-center gap-3 px-4 py-2 my-1 rounded-lg w-full font-semibold transition-colors
      ${
        isActive
          ? darkMode
            ? "bg-slate-700 text-white"
            : "bg-teal-700 text-white"
          : darkMode
          ? "text-slate-200 hover:bg-slate-600 hover:text-white"
          : "text-teal-900 hover:bg-teal-700 hover:text-white"
      }
      ${collapsed ? "justify-center" : ""}
    `}
  >
    <Icon className="w-8 h-8" />
    {!collapsed && <span>{label}</span>}
  </button>
);

const HEADER_HEIGHT = 90; // px

const HOAHeaderNavbar = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarCollapsed(true);
      else setSidebarCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarWidth = sidebarCollapsed ? 100 : 350;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-teal-50 text-slate-900"}`}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between shadow-lg px-8
          ${darkMode ? "bg-slate-700" : "bg-teal-700"}
        `}
        style={{ height: HEADER_HEIGHT, color: "#fff" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl font-extrabold text-white">
            🏘️ HOA Connect System
          </span>
        </div>
        {/* Right side - Welcome and Theme Toggle */}
        <div className="flex items-center gap-6">
          <span className="font-bold text-xl text-white">
            Welcome! {hoaAdminName}
          </span>
          <button
            onClick={handleDarkModeToggle}
            className="flex items-center justify-center rounded-full p-2 hover:bg-white/20 transition"
            style={{ color: "#fff" }}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <SunIcon className="w-8 h-8 text-yellow-300" />
            ) : (
              <MoonIcon className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </header>

      <div className="flex" style={{ marginTop: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        {/* SIDEBAR */}
        <aside
          className={`flex flex-col justify-between shadow-lg transition-all duration-300
            ${darkMode ? "bg-slate-800 border-r border-slate-700" : "bg-teal-10 border-r border-teal-700"}
          `}
          style={{
            width: sidebarWidth,
            height: '100%',
            minHeight: '100%',
          }}
        >
          <div>
            <div className="flex flex-col items-center py-2">
              <button
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className={`mb-1 p-2 rounded-full ${
                  darkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-500 text-teal-900 hover:bg-teal-700 text-white" 
                } shadow-lg transition-colors`}
                aria-label="Toggle Sidebar"
              >
                {sidebarCollapsed ? <Bars3Icon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
              </button>
            </div>
            <nav className="px-4 py-4">
              {NAV_LINKS.map(({ label, icon: Icon, path }) => (
                <SidebarLink
                  key={path}
                  icon={Icon}
                  label={label}
                  path={path}
                  isActive={location.pathname === path}
                  collapsed={sidebarCollapsed}
                  onClick={() => navigate(path)}
                  darkMode={darkMode}
                />
              ))}
            </nav>
          </div>
          <div className="px-2 pb-4">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow justify-center w-full 
                ${darkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-700 text-white hover:bg-teal-800"}`}
            >
              <ArrowRightOnRectangleIcon className="w-8 h-8" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>
        {/* MAIN: only this scrolls */}
        <main style={{
          marginLeft: 0,
          width: "100%",
          height: '100%',
          overflowY: "auto"
        }}>
          <div className="min-h-[calc(100vh-4rem)] w-full transition-colors duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HOAHeaderNavbar;
