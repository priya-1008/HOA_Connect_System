import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Polls = () => {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);

    axios
      .get("http://localhost:5000/resident/getpolls", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPolls(res.data || []);
      })
      .catch(() => setError("Failed to load polls"))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  const handleOptionSelect = (pollId, index) => {
    setSelectedOption((prev) => ({ ...prev, [pollId]: index }));
    setError("");
    setSuccess("");
  };

  const submitVote = async (pollId) => {
    const token = localStorage.getItem("token");
    const optionIndex = selectedOption[pollId];

    if (optionIndex === undefined) {
      setError("Please select an option before voting.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/resident/votepoll/${pollId}`,
        { optionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message);
      setVotedPolls((prev) => [...prev, pollId]);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting vote");
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

        <main className="relative z-10 p-6 min-h-screen w-full flex flex-col items-center">
          <section
            className="
          w-full mx-auto
          bg-emerald-100/50 dark:bg-emerald-900/70
          dark:border-emerald-800
          backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
        "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center">
              Society Polls
            </h2>

            {(error || success) && (
              <p
                className={`text-center font-semibold text-lg mb-4 ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {error || success}
              </p>
            )}

            {loading && (
              <p className="text-center text-emerald-900 dark:text-emerald-100 font-medium mb-4">
                Loading polls...
              </p>
            )}

            {/* ROW FORMAT POLLS DISPLAY */}
            <div className="space-y-6 w-full mt-4">
              {polls.length === 0 && !loading && (
                <p className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg">
                  No polls found.
                </p>
              )}

              {polls.map((poll) => {
                const isVoted = votedPolls.includes(poll._id);

                return (
                  <div
                    key={poll._id}
                    className="bg-white/70 dark:bg-emerald-900/40 shadow-lg rounded-xl p-6 border border-gray-300 dark:border-gray-700"
                  >
                    {/* Question */}
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mb-4">
                      {poll.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {poll.options.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center text-lg cursor-pointer"
                        >
                          <input
                            type="radio"
                            disabled={isVoted}
                            checked={selectedOption[poll._id] === i}
                            onChange={() => handleOptionSelect(poll._id, i)}
                            className="mr-3 h-5 w-5"
                          />
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {opt.text}
                            <span className="ml-2 text-gray-600 text-sm">
                              ({opt.votes} votes)
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-5">
                      {!isVoted ? (
                        <button
                          onClick={() => submitVote(poll._id)}
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition"
                        >
                          Submit Vote
                        </button>
                      ) : (
                        <span className="text-emerald-900 dark:text-emerald-300 font-semibold">
                          ✔ You already voted
                        </span>
                      )}
                    </div>

                    {/* Created Date */}
                    <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                      Created: {new Date(poll.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Polls;
