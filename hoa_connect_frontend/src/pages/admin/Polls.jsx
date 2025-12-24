import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Polls = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch polls
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);

    axios
      .get("http://localhost:5000/hoaadmin/getpolls", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPolls(res.data || []))
      .catch(() => setError("Could not load polls."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { question, option1, option2, option3, option4 } = form;

    const options = [option1, option2, option3, option4].filter(
      (o) => o && o.trim() !== ""
    );

    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    if (options.length < 2) {
      setError("Please provide at least two options.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/hoaadmin/addpoll",
        { question, options },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Poll created successfully.");
      setForm({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create poll.");
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
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        {/* MAIN CONTENT */}
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            {/* HEADER */}
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Polls
            </h2>

            {/* ERROR / SUCCESS */}
            {(error || success) && (
              <div
                className={`text-center pb-3 text-black font-semibold text-lg ${
                  error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* POLL FORM */}
            <form onSubmit={handleSubmit} className="mb-8 w-full">

              {/* QUESTION */}
              <input
                type="text"
                name="question"
                required
                maxLength={100}
                placeholder="Poll Question"
                value={form.question}
                onChange={handleChange}
                className="w-full mb-4 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/40 dark:text-emerald-100 shadow"
              />

              {/* OPTIONS ROW 1 */}
              <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                <input
                  type="text"
                  name="option1"
                  required
                  placeholder="Option 1"
                  value={form.option1}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/40 dark:text-emerald-100 shadow"
                />

                <input
                  type="text"
                  name="option2"
                  required
                  placeholder="Option 2"
                  value={form.option2}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/40 dark:text-emerald-100 shadow"
                />
              </div>

              {/* OPTIONS ROW 2 (optional) */}
              <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                <input
                  type="text"
                  name="option3"
                  placeholder="Option 3 (optional)"
                  value={form.option3}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/40 dark:text-emerald-100 shadow"
                />

                <input
                  type="text"
                  name="option4"
                  placeholder="Option 4 (optional)"
                  value={form.option4}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/40 dark:text-emerald-100 shadow"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold transition disabled:opacity-70"
                >
                  {loading ? "Saving..." : "CREATE POLL"}
                </button>
              </div>
            </form>

            {/* POLLS TABLE */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full table-fixed text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 text-left font-bold w-4/12">Question</th>
                    <th className="p-4 text-left font-bold w-5/12">Options</th>
                    <th className="p-4 text-left font-bold w-3/12">Created At</th>
                  </tr>
                </thead>

                <tbody>
                  {polls.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No polls found.
                      </td>
                    </tr>
                  ) : (
                    polls.map((poll, index) => (
                      <tr
                        key={poll._id}
                        className={`transition-colors ${
                          index % 2 === 0
                            ? "bg-white dark:bg-emerald-900/40"
                            : "bg-emerald-100/50 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 text-black font-semibold">
                          {poll.question}
                        </td>

                        <td className="px-4 py-3 text-black">
                          <ul className="list-disc list-inside space-y-1">
                            {poll.options?.map((opt) => (
                              <li key={opt._id}>
                                {opt.text}{" "}
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  ({opt.votes} votes)
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>

                        <td className="px-4 py-3 text-black">
                          {poll.createdAt
                            ? new Date(poll.createdAt).toLocaleString()
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

export default Polls;
