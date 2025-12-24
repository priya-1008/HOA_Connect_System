import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]); // State for filtered results
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Search States
  const [searchStatus, setSearchStatus] = useState("");
  const [searchName, setSearchName] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchComplaints = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://localhost:5000/hoaadmin/getcomplaints",
        authConfig
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setComplaints(data);
      setFilteredComplaints(data); // Initialize filtered data
    } catch (err) {
      console.error(err);
      setError("Could not load complaints.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, navigate, fetchComplaints]);

  // 🔍 Real-time Search Logic
  useEffect(() => {
    let results = complaints;

    if (searchStatus) {
      results = results.filter((c) => c.status === searchStatus);
    }

    if (searchName) {
      results = results.filter((c) =>
        c.user?.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredComplaints(results);
  }, [searchStatus, searchName, complaints]);

  const handleStatusChange = async (complaintId, newStatus) => {
    if (!token) return navigate("/login");

    setError("");
    setSuccess("");
    setUpdatingId(complaintId);

    try {
      const res = await axios.put(
        `http://localhost:5000/hoaadmin/updatecomplaint/${complaintId}`,
        { status: newStatus },
        authConfig
      );

      const updated = res.data?.complaint || null;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, ...updated } : c))
      );
      setSuccess(res.data?.message || "Complaint status updated");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to update complaint status."
      );
    } finally {
      setUpdatingId(null);
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
          <section
            className="
              w-full mx-auto
              bg-emerald-100/50 dark:bg-emerald-900/70
              dark:border-emerald-800
              backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
            "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Complaints
            </h2>

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

            {/* 🔍 SEARCH INPUTS */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
              <input
                type="text"
                placeholder="Search by Resident Name..."
                className="w-full md:w-80 bg-white dark:bg-emerald-950/40 px-4 py-3 font-medium border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-emerald-900 dark:text-emerald-100"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <select
                className="w-full md:w-64 bg-white dark:bg-emerald-950/40 px-4 py-3 font-medium border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-emerald-900 dark:text-emerald-100 cursor-pointer"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full text-sm md:text-base table-fixed">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 font-bold text-left w-2/12">Subject</th>
                    <th className="p-4 font-bold text-left w-4/12">Description</th>
                    <th className="p-4 font-bold text-left w-2/12">Raised By</th>
                    <th className="p-4 font-bold text-center w-2/12">Status</th>
                    <th className="p-4 font-bold text-center w-2/12">Date</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c, index) => (
                      <tr
                        key={c._id}
                        className={`text-sm md:text-base transition-colors ${
                          index % 2 === 0
                            ? "bg-white/100 dark:bg-emerald-900/40"
                            : "bg-emerald-100/50 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 font-medium text-black  text-left">{c.subject}</td>
                        <td className="px-4 py-3 font-medium text-black break-words">{c.description}</td>
                        <td className="px-4 py-3 font-medium text-black text-left">{c.user?.name}</td>
                        <td className="px-4 py-3 font-mediumtext-black text-center">
                          <select
                            value={c.status || "Pending"}
                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                            disabled={updatingId === c._id}
                            className="w-full bg-white dark:bg-emerald-950/40 text-black border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="p-4 py-3 text-black font-medium text-center">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
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

export default Complaints;