import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const channelOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    channels: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/resident/getnotification", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data?.notifications || []))
      .catch(() => setError("Could not load notifications."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none transition-all duration-300" />
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section
            className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Notifications
            </h2>
            {/* {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )} */}
            {/* Notifications List */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 font-semibold text-left">Title</th>
                    <th className="p-4 font-semibold text-left">Message</th>
                    <th className="p-4 font-semibold text-left">Created By</th>
                    <th className="p-4 font-semibold text-left">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No notifications found.
                      </td>
                    </tr>
                  )}
                  {notifications.map((n,index) => (
                    <tr
                      key={n._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/70 dark:bg-emerald-900/60"
                      } hover:bg-emerald-200/60`}
                    >
                      <td className="px-4 py-3 font-medium text-black text-left">{n.title}</td>
                      <td className="px-4 py-3 font-medium text-black text-left">{n.message}</td>
                      <td className="px-4 py-3 font-medium text-black text-left">
                        {n.createdBy?.name || n.createdBy?.email || n.createdBy}
                      </td>
                      <td className="px-4 py-3 font-medium text-black text-left">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Notifications;
