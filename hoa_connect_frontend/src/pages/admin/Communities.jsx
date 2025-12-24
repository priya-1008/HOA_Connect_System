import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  BellIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
  
const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white/50 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-lg p-6 flex flex-col items-start justify-center hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
    </div>
    <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    communities: 0,
    residents: 0,
    hoaAdmins: 0,
    complaints: 0,
    announcements: 0,
    amenities: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get("http://localhost:5000/communities/getCommunity", config),
      axios.get("http://localhost:5000/residents", config),
      axios.get("http://localhost:5000/auth/register", config),
      axios.get("http://localhost:5000/complaints", config),
      axios.get("http://localhost:5000/announcements", config),
      axios.get("http://localhost:5000/amenities", config),
      axios.get("http://localhost:5000/dashboard/total-payments", config),
    ])
      .then(([comm, resi, users, comp, ann, ame, pay]) => {
        const hoaAdmins = users.data.filter((u) => u.role === "admin").length;
        setData({
          communities: comm.data.length,
          residents: resi.data.length,
          hoaAdmins,
          complaints: comp.data.length,
          announcements: ann.data.length,
          amenities: ame.data.length,
          totalPayments: pay.data.total || 0,
        });
      })
      .catch(() => console.log("Error fetching dashboard data"));
  }, [navigate]);

  return (
    <HOAHeaderNavbar>
      <div
        className="relative flex flex-col min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')", // Image from public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/0 dark:bg-gray-700/85 pointer-events-none" />
        <main className="relative z-10">
          <div className="h-56 flex items-center text-white relative">
            <h1 className="px-8 grid text-5xl font-extrabold z-10 drop-shadow-xl text-slate-700 dark:text-teal-100">
              HOA Admin Dashboard
            </h1>
          </div>
          <section className="p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 -mt-10 z-20 relative">
            <StatCard
              title="Total Communities"
              value={data.communities}
              color="text-blue-600"
              icon={BuildingOffice2Icon}
            />
            <StatCard
              title="Total Residents"
              value={data.residents}
              color="text-green-600"
              icon={UsersIcon}
            />
            <StatCard
              title="Complaints"
              value={data.complaints}
              color="text-red-600"
              icon={ClipboardDocumentListIcon}
            />
            <StatCard
              title="Announcements"
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
              title="Total Payments"
              value={`₹${data.totalPayments.toLocaleString()}`}
              color="text-emerald-600"
              icon={CurrencyDollarIcon}
            />
          </section>
          <section className="px-8 pb-12">
            <div className="bg-white/60 border border-gray-200 shadow-md rounded-2xl p-5">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
                Global Analytics Overview
              </h2>
              <div className="h-40 border-2 font-semibold border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-900 italic">
                [Chart.js / Recharts Placeholder]
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Dashboard;
