import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Meetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/resident/getmeetingbyresident", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sortedMeetings = (res.data || []).sort(
          (a, b) => new Date(b.meetingDate) - new Date(a.meetingDate)
        );
        setMeetings(sortedMeetings);
        setError("");
      })
      .catch(() => setError("Could not load meetings."))
      .finally(() => setLoading(false));
  }, [navigate]);

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
              Meetings
            </h2>

            {error && (
              <p className="text-center text-red-600 font-semibold pb-4 text-lg">
                {error}
              </p>
            )}

            {loading && meetings.length === 0 && (
              <p className="text-center text-emerald-900 dark:text-emerald-100 font-medium mb-4">
                Loading meetings...
              </p>
            )}

            {/* ----- TABLE ----- */}
            <div className="w-full overflow-x-auto mt-2">
              <div className="rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70 overflow-hidden">
                <table className="min-w-full table-auto bg-white/70 dark:bg-emerald-950/40">
                  <thead>
                    <tr className="bg-gray-800 text-white text-lg">
                      <th className="p-4 text-left font-semibold">Title</th>
                      <th className="p-4 text-left font-semibold">Agenda</th>
                      <th className="p-4 text-left font-semibold">Location</th>
                      <th className="p-4 text-left font-semibold">Date & Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {meetings.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                        >
                          No meetings found.
                        </td>
                      </tr>
                    )}

                    {meetings.map((meeting, index) => (
                      <tr
                        key={meeting._id}
                        className={`text-sm md:text-base ${
                          index % 2 === 0
                            ? "bg-white/70 dark:bg-emerald-900/40"
                            : "bg-emerald-100/70 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70 transition-colors`}
                      >
                        <td className="px-4 py-3 text-black font-medium">
                          {meeting.title}
                        </td>

                        <td className="px-4 py-3 text-black font-medium">
                          {meeting.agenda || meeting.description}
                        </td>

                        <td className="px-4 py-3 text-black font-medium">
                          {meeting.location}
                        </td>

                        <td className="px-4 py-3 text-black font-medium">
                          {meeting.meetingDate
                            ? new Date(meeting.meetingDate).toLocaleString()
                            : ""}
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

export default Meetings;
