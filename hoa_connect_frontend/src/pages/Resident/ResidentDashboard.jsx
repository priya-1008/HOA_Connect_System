import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";
import {
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  BellIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white/60 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-lg p-6 flex flex-col items-start justify-center hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h3>
    </div>
    <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    notifications: 0,
    complaints: 0,
    announcements: 0,
    amenities: 0,
    polls: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    axios
      .get("http://localhost:5000/resident/dashboard/counts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => console.log("Error fetching dashboard data"));
  }, [navigate]);

  return (
    <HOAHeaderNavbar>
      <div
        className="relative flex flex-col min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-gray-800/70 pointer-events-none" />

        {/* MAIN CONTENT */}
        <main className="relative z-10">

          {/* ------------------------ HERO TITLE SECTION ------------------------ */}
          <div className="h-[300px] flex items-center justify-center text-center relative">
            <h1 className="text-5xl font-bold text-white drop-shadow-xl dark:text-teal-100">
              Resident Dashboard
            </h1>
          </div>

          {/* Proper spacing between hero section & cards */}
          <section className="p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 z-20 relative -mt-10">

            <StatCard
              title="New Notifications"
              value={data.notifications}
              color="text-purple-700"
              icon={BellIcon}
            />

            <StatCard
              title="Total Complaints"
              value={data.complaints}
              color="text-red-600"
              icon={ClipboardDocumentListIcon}
            />

            <StatCard
              title="New Announcements"
              value={data.announcements}
              color="text-orange-500"
              icon={MegaphoneIcon}
            />

            <StatCard
              title="Amenities"
              value={data.amenities}
              color="text-teal-600"
              icon={CalendarDaysIcon}
            />

            <StatCard
              title="New Polls"
              value={data.polls}
              color="text-blue-600"
              icon={ChartPieIcon}
            />

          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Dashboard;
