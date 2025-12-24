import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch announcements
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/resident/getannouncements", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnnouncements(res.data.announcements || []))
      .catch(() => setError("Could not load announcements."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Format date in DD/MM/YYYY, hh:mm:ss AM/PM (12‑hour)
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const time = d.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${day}/${month}/${year}, ${time}`;
  };

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
            className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70
                       dark:border-emerald-800 backdrop-blur-lg rounded-2xl
                       shadow-xl p-8 my-8"
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Announcements
            </h2>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-xl shadow-md overflow-hidden bg-white/70 dark:bg-emerald-900/60">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 font-semibold text-left w-1/5">Title</th>
                    <th className="p-4 font-semibold text-left w-2/5">
                      Description
                    </th>
                    <th className="p-4 font-semibold text-left w-1/5">
                      Posted By
                    </th>
                    <th className="p-4 font-semibold text-left w-1/5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No announcements found.
                      </td>
                    </tr>
                  )}

                  {announcements.map((a, index) => (
                    <tr
                      key={a._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/70 dark:bg-emerald-900/60"
                      } hover:bg-emerald-200/60`}
                    >
                      <td className="px-4 py-3 text-black font-medium">{a.title}</td>
                      <td className="px-4 py-3 text-black font-medium">{a.description}</td>
                      <td className="px-4 py-3  text-black font-medium">
                        {a.createdBy ? a.createdBy.name : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-black font-medium">
                        {formatDateTime(a.createdAt)}
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

export default Announcement;
