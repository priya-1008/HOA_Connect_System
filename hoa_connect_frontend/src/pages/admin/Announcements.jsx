/* --- SAME IMPORTS & LOGIC --- */
import React, { useEffect, useState, useCallback } from "react";
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
  const [initialLoading, setInitialLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchAnnouncements = useCallback(async () => {
    if (!token) return;
    setInitialLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/hoaadmin/getannouncements",
        authConfig
      );
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.announcements || [];
      setAnnouncements(list);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Could not load announcements."
      );
      setAnnouncements([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAnnouncements();
  }, [token, navigate, fetchAnnouncements]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/hoaadmin/postannounce",
        form,
        authConfig
      );
      setSuccess(res.data.message || "Announcement created");
      setForm({ title: "", description: "" });
      await fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to create announcement."
      );
    } finally {
      setLoading(false);
    }
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
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Announcements
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full gap-4">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="title"
                  maxLength={50}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  placeholder="Title"
                  onChange={handleChange}
                  value={form.title}
                />
                <textarea
                  name="description"
                  maxLength={500}
                  required
                  rows={1}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  placeholder="Description"
                  onChange={handleChange}
                  value={form.description}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-emerald-900 text-white rounded-lg font-bold transition"
                >
                  {loading ? "Posting..." : "POST"}
                </button>
              </div>
            </form>

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

            {/* ⭐ UPDATED TABLE (MATCHING RESIDENTS PAGE CSS) ⭐ */}
            <div className="w-full overflow-x-auto">
              <div className="rounded-xl shadow-md border border-gray-300/60 dark:border-gray-700/70 overflow-hidden">
                <table className="min-w-full table-auto bg-white/70 dark:bg-emerald-950/40">
                  <thead>
                    <tr className="bg-gray-800 text-white text-lg">
                      <th className="p-4 font-semibold text-left">Title</th>
                      <th className="p-4 font-semibold text-left">Description</th>
                      <th className="p-4 font-semibold text-left">Posted By</th>
                      <th className="p-4 font-semibold text-left">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {initialLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-emerald-900 dark:text-emerald-100 italic text-lg">
                          Loading...
                        </td>
                      </tr>
                    ) : announcements.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-emerald-900 dark:text-emerald-100 italic text-lg">
                          No announcements found.
                        </td>
                      </tr>
                    ) : (
                      announcements.map((a, idx) => (
                        <tr
                          key={a._id}
                          className={`text-sm md:text-base transition-colors ${
                            idx % 2 === 0
                              ? "bg-white/70 dark:bg-emerald-900/40"
                              : "bg-emerald-100/60 dark:bg-emerald-900/60"
                          } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                        >
                          <td className="px-4 py-3 text-black font-medium">{a.title}</td>
                          <td className="px-4 py-3 text-black font-medium">{a.description}</td>
                          <td className="px-4 py-3 text-black font-medium">
                            {a.createdBy
                              ? `${a.createdBy.name} (${a.createdBy.email})`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {a.createdAt
                              ? new Date(a.createdAt).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Announcement;
