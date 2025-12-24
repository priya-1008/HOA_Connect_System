import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

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

// 🧩 NavLink for sidebar (if needed elsewhere)
const NavLink = ({ icon: Icon, children, isActive, onClick }) => {
  const baseClasses =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const activeClasses = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactiveClasses =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

const PaymentsReport = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios 
      .get("http://localhost:5000/superadmin/payments/global", config)
      .then((res) => setPayments(res.data?.data || []))
      .catch(() => setError("Failed to load payments"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <main className="flex-1 overflow-y-auto p-8">
        <section
          className={`rounded-xl shadow-lg px-6 py-9 transition-colors duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
                : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
            }`}
        >
          <h2
            className={`text-4xl font-bold mb-6 text-center ${
              darkMode ? "text-teal-900" : "text-gray-900"
            }`}
          >
            Payments & Reports
          </h2>

          {error && (
            <div className="mb-4 text-red-500 font-medium text-center">
              {error}
            </div>
          )}

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className={`p-6 rounded-xl shadow text-center font-semibold ${
                darkMode
                  ? "bg-teal-950 text-green-300 border border-teal-800"
                  : "bg-teal-100 text-green-700 border border-teal-300"
              }`}
            >
              Total Payments <br /> <span className="text-3xl font-bold">₹{total.toLocaleString()}</span>
            </div>
            <div
              className={`p-6 rounded-xl shadow text-center font-semibold ${
                darkMode
                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                  : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
            >
              Transactions <br /> <span className="text-3xl font-bold">{payments.length}</span>
            </div>
            <div
              className={`p-6 rounded-xl shadow text-center font-semibold ${
                darkMode
                  ? "bg-purple-950 text-purple-300 border border-purple-800"
                  : "bg-purple-100 text-purple-700 border border-purple-300"
              }`}
            >
              Recent Payment <br /> <span className="text-xl font-bold">
                {payments.length > 0 ? `₹${payments[0].amount}` : "No records"}
              </span>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead
                className={`${
                  darkMode
                    ? "bg-teal-800 text-teal-100"
                    : "bg-teal-100 text-teal-900"
                }`}
              >
                <tr>
                  <th className="px-4 py-2 border-b-2">Resident</th>
                  <th className="px-4 py-2 border-b-2">Community</th>
                  <th className="px-4 py-2 border-b-2">Amount</th>
                  <th className="px-4 py-2 border-b-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">No payment records found.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr
                      key={p._id}
                      className={`transition ${
                        darkMode ? "hover:bg-slate-800" : "hover:bg-teal-50"
                      }`}
                    >
                      <td className="px-4 py-2 border-b">{p.resident?.name || "N/A"}</td>
                      <td className="px-4 py-2 border-b">{p.community?.name || "N/A"}</td>
                      <td className="px-4 py-2 border-b font-semibold text-green-600 dark:text-green-400">
                        ₹{p.amount}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default PaymentsReport;
