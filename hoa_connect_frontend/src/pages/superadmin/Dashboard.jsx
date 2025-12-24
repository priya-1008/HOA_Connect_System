import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import HeaderNavbar from "./HeaderNavbar";

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode
        ? "bg-gradient-to-br from-gray-700 via-gray-900 to-gray-700 text-gray-700 border border-gray-300"
        : "bg-gradient-to-br from-teal-100 via-indigo-50 to-teal-900 text-violet-900 border border-violet-300"
    }`}
  >
    <p
      className={`${
        darkMode
          ? "text-xl font-medium mb-1 text-white"
          : " text-black text-xl font-medium mb-1"
      }`}
    >
      {title}
    </p>
    <h2 className={`text-4xl font-extrabold mt-2 ${color}`}>{value}</h2>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // 🧠 State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalHOAAdmins: 0,
    totalAmenities: 0,
  });

  // Data mapping for Recharts
  const chartData = [
    { name: "Communities", count: stats.totalCommunities, color: "#2563eb" },
    { name: "HOA Admins", count: stats.totalHOAAdmins, color: "#9333ea" },
    { name: "Amenities", count: stats.totalAmenities, color: "#16a34a" },
  ];

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/superadmin/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) =>
        setStats({
          totalCommunities: res.data.totalCommunities,
          totalHOAAdmins: res.data.totalHOAAdmins,
          totalAmenities: res.data.totalAmenities,
        })
      )
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <main className="flex-1 overflow-y-auto space-y-10">
        {/* Dashboard Header */}
        <h1
          className={`text-5xl font-extrabold mb-4 flext item-center pb-2
          ${
            darkMode
              ? "border-gray-700 text-white"
              : "border-gray-200 text-gray-900"
          }`}
        >
          Super Admin Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Communities"
            value={stats.totalCommunities}
            color="text-blue-600"
            darkMode={darkMode}
          />
          <StatCard
            title="HOA Admins"
            value={stats.totalHOAAdmins}
            color="text-purple-600"
            darkMode={darkMode}
          />
          <StatCard
            title="Total Amenities"
            value={stats.totalAmenities}
            color="text-green-600"
            darkMode={darkMode}
          />
        </div>

        {/* Analytics Section - UI Kept Exactly Same */}
        <section
          className={`rounded-xl shadow-xl p-8 transition-colors
          ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 border border-teal-600"
              : "bg-gradient-to-br from-gray-300 via-blue-100 to-gray-300 border border-gray-300"
          }`}
        >
          <h3
            className={`text-2xl font-semibold mb-4 border-b pb-2
          ${
            darkMode
              ? "border-gray-700 text-white"
              : "border-gray-200 text-gray-900"
          }`}
          >
            Global Analytics Overview
          </h3>

          {/* Replaced Placeholder with Recharts */}
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff44"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: darkMode ? "#fff" : "#111" }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: darkMode ? "#fff" : "#111" }}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "10px", border: "none" }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default Dashboard;
