import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Meetings = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    agenda: "",
    location: "",
    meetingDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH MEETINGS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getmeetings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeetings(res.data || []))
      .catch(() => setError("Could not load meetings."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/hoaadmin/addmeeting", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Meeting created successfully.");
      setForm({
        title: "",
        agenda: "",
        location: "",
        meetingDate: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create meeting.");
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
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            {/* HEADER */}
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Meetings
            </h2>

            {/* ERROR / SUCCESS */}
            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mb-8 w-full gap-4"
            >
              {/* Title + Agenda */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Meeting Title"
                  maxLength={80}
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />

                <input
                  type="text"
                  name="agenda"
                  placeholder="Agenda"
                  maxLength={300}
                  required
                  value={form.agenda}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />
              </div>

              {/* Location + Date */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="location"
                  placeholder="Meeting Location"
                  maxLength={300}
                  required
                  value={form.location}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />

                <input
                  type="datetime-local"
                  name="meetingDate"
                  required
                  value={form.meetingDate}
                  onChange={handleChange}
                  className="flex-1 text-black rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />
              </div>

              {/* SUBMIT */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-xl bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold disabled:opacity-70"
                >
                  {loading ? "Saving..." : "SUBMIT"}
                </button>
              </div>
            </form>

            {/* MEETINGS TABLE */}
            <div className="w-full">
              <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70 mt-4">

                <table className="min-w-full table-fixed text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                      <th className="p-4 text-left font-bold w-3/12">Title</th>
                      <th className="p-4 text-left font-bold w-4/12">Agenda</th>
                      <th className="p-4 text-left font-bold w-3/12">Location</th>
                      <th className="p-4 text-left font-bold w-2/12">Date & Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && meetings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : meetings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-black font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                        >
                          No meetings found.
                        </td>
                      </tr>
                    ) : (
                      meetings.map((meeting, index) => (
                        <tr
                          key={meeting._id}
                          className={`transition-colors ${
                            index % 2 === 0
                              ? "bg-white/100 dark:bg-emerald-900/40"
                              : "bg-emerald-100/50 dark:bg-emerald-900/60"
                          } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                        >
                          <td className="px-4 py-3 text-black font-medium">
                            {meeting.title}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {meeting.agenda || meeting.description}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {meeting.location}
                          </td>
                          <td className="px-4 py-3 text-black whitespace-nowrap">
                            {meeting.meetingDate
                              ? new Date(meeting.meetingDate).toLocaleString()
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

export default Meetings;
