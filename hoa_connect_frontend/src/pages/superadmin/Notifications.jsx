import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import useFetch from "../../hooks/useFetch";
import HeaderNavbar from "./HeaderNavbar";

const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode
        ? "bg-gradient-to-br from-teal-100 via-blue-100 to-teal-900 text-gray-700 border border-violet-800"
        : "bg-gradient-to-br from-teal-100 via-indigo-50 to-teal-900 text-violet-900 border border-violet-300"
    }`}
  >
    <p className="text-sm font-medium mb-1 text-teal-900">{title}</p>
    <h2 className={`text-4xl font-extrabold mt-2 ${color}`}>{value}</h2>
  </div>
);

const SystemNotification = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [search, setSearch] = useState("");

  const { data: announcements } = useFetch(
    "http://localhost:5000/superadmin/getnotifications"
  );

  const token = localStorage.getItem("token");

  // 🔥 FIXED: FETCH COMMUNITIES PROPERLY
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get(
          "http://localhost:5000/superadmin/getcommunities",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // FIX: use correct field name (name)
        setCommunities(res.data.communities || []);
      } catch (err) {
        console.error("Error fetching communities", err);
      }
    };
    fetchCommunities();
  }, [token]);

  // Dark Mode toggle
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Role protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
    }
  }, [navigate]);

  // Send Notification
  const sendNotification = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter title & message.");
      return;
    }

    try {
      const body = {
        title,
        message,
        communityId: selectedCommunity || null,
      };

      await api.post(
        "http://localhost:5000/superadmin/addnotifications",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setMessage("");
      setSelectedCommunity("");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    }
  };

  const list = Array.isArray(announcements)
    ? announcements
    : announcements?.notifications || [];

  const filteredNotifications = list.filter((n) => {
    const matchCommunity =
      !selectedCommunity || n.community === selectedCommunity;

    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    return matchCommunity && matchSearch;
  });

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <main className="flex-1 overflow-y-auto space-y-10 p-4 md:p-6">
        <section
          className={`rounded-xl shadow-xl p-6 md:p-8 transition-colors ${
            darkMode
              ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
              : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
          }`}
        >
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">
            System Notifications
          </h2>

          <form
            onSubmit={sendNotification}
            className="flex flex-col gap-3 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Notification title"
                className={`border p-3 rounded flex-1 ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-800"
                    : "bg-white border-gray-300"
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Notification message"
                className={`border p-3 rounded flex-1 ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-800"
                    : "bg-white border-gray-300"
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* 🔥 FIXED: COMMUNITY DROPDOWN */}
            <select
              className={`p-3 rounded border ${
                darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-800"
                  : "bg-white border-gray-300"
              }`}
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
            >
              <option value="">All Communities</option>

              {communities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {/* FIXED LINE */}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full md:w-auto bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 shadow font-semibold"
            >
              Send
            </button>
          </form>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search notifications..."
              className={`w-full p-3 rounded border ${
                darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-800"
                  : "bg-white border-gray-300"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div
            className={`p-4 rounded-lg shadow ${
              darkMode
                ? "bg-gray-700 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-2xl font-semibold mb-3 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              All Notifications
            </h3>

            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <li
                    key={n._id}
                    className="border-b border-teal-100 pb-2 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📢</span>
                      <span className="font-semibold">
                        {n.title}{" "}
                        {/* FIXED COMMUNITY NAME DISPLAY */}
                        {n.community?.name && (
                          <span className="text-xs text-teal-600">
                            ({n.community.name})
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm pl-7">{n.message}</span>
                  </li>
                ))
              ) : (
                <p className="text-lg text-gray-500">
                  No notifications found.
                </p>
              )}
            </ul>
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default SystemNotification;
