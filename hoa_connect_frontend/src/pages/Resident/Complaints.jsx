import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // DD/MM/YYYY, hh:mm:ss AM/PM
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

  // Fetch my complaints
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/resident/getmycomplaint", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // backend: { success, complaint: [ ... ] }
        setComplaints(res.data.complaint || []);
      })
      .catch(() => setError("Could not load complaints."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Submit new complaint (status will be "Pending" by default in model)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/resident/submitcomplaint",
        {
          subject: form.subject,
          description: form.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message || "Complaint submitted successfully.");
      setForm({ subject: "", description: "" });

      // Add newly created complaint at top
      if (res.data.complaint) {
        setComplaints((prev) => [res.data.complaint, ...prev]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit complaint.");
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
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Complaints
            </h2>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mb-8 w-full gap-4"
            >
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="subject"
                  maxLength={100}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Subject"
                  onChange={handleChange}
                  value={form.subject}
                />
                <textarea
                  name="description"
                  maxLength={500}
                  required
                  rows={1}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000", resize: "vertical" }}
                  placeholder="Description"
                  onChange={handleChange}
                  value={form.description}
                />
                <style>{`
                  input::placeholder, textarea::placeholder {
                    color: #94a09bff;
                    opacity: 1;
                  }
                  .dark input::placeholder, .dark textarea::placeholder {
                    color: #94a09bff;
                    opacity: 1;
                  }
                `}</style>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold transition w-auto"
                >
                  {loading ? "Submitting..." : "SUBMIT"}
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

            {/* COMPLAINTS TABLE */}
            <div className="w-full overflow-x-auto mt-4">
              <div className="rounded-xl shadow-md border border-gray-300/60 dark:border-gray-700/70 overflow-hidden">
                <table className="min-w-full table-auto bg-white/70 dark:bg-emerald-950/40">
                  <thead>
                    <tr className="bg-gray-800 text-white text-lg">
                      <th className="p-4 font-semibold text-left">Subject</th>
                      <th className="p-4 font-semibold text-left">
                        Description
                      </th>
                      <th className="p-4 font-semibold text-left">Status</th>
                      <th className="p-4 font-semibold text-left">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {complaints.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                        >
                          No complaints found.
                        </td>
                      </tr>
                    )}

                    {complaints.map((c, index) => (
                      <tr
                        key={c._id}
                        className={`text-sm md:text-base transition-colors ${
                          index % 2 === 0
                            ? "bg-white/70 dark:bg-emerald-900/40"
                            : "bg-emerald-100/60 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 text-black font-medium">{c.subject}</td>
                        <td className="px-4 py-3 text-black font-medium">
                          {c.description}
                        </td>
                        <td className="px-4 py-3 text-black font-medium">
                          {c.status || "Pending"}
                        </td>
                        <td className="px-4 py-3 text-black font-medium">
                          {formatDateTime(c.createdAt)}
                        </td>
                      </tr>
                    ))}
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

export default Complaints;
