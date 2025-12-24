import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getnotification", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotifications(res.data?.notifications || []);
      })
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
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        {/* MAIN CONTENT */}
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            {/* HEADER */}
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Notifications
            </h2>

            {/* ERROR / SUCCESS */}
            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* NOTIFICATIONS TABLE */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full table-fixed text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 text-left font-bold w-3/12">Title</th>
                    <th className="p-4 text-left font-bold w-4/12">Message</th>
                    <th className="p-4 text-left font-bold w-3/12">
                      Created By
                    </th>
                    <th className="p-4 text-left font-bold w-2/12">
                      Date & Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No notifications found.
                      </td>
                    </tr>
                  ) : (
                    notifications.map((n, index) => (
                      <tr
                        key={n._id}
                        className={`transition-colors ${
                          index % 2 === 0
                            ? "bg-white dark:bg-emerald-900/40"
                            : "bg-emerald-100/50 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 text-black font-medium">{n.title}</td>
                        <td className="px-4 py-3 text-black font-medium">{n.message}</td>
                        <td className="px-4 py-3 text-black font-medium">
                          {n.createdBy?.name || n.createdBy?.email || "-"}
                        </td>
                        <td className="px-4 py-3 text-black font-medium">
                          {n.createdAt
                            ? new Date(n.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
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
