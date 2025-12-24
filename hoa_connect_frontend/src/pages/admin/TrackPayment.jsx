import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Search States
  const [searchName, setSearchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch payments
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getpayments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPayments(res.data || []);
        setFilteredPayments(res.data || []);
      })
      .catch(() => setError("Could not load payments."))
      .finally(() => setLoading(false));
  }, [navigate]);

  // Combined Search Filter Logic (Name + Date Range)
  useEffect(() => {
    let filtered = payments;

    // 1. Filter by Resident Name
    if (searchName) {
      filtered = filtered.filter((p) =>
        p.user?.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // 2. Filter by Date Range
    if (fromDate || toDate) {
      filtered = filtered.filter((p) => {
        const pDate = new Date(p.transactionDate).setHours(0, 0, 0, 0);
        const start = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const end = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

        if (start && end) return pDate >= start && pDate <= end;
        if (start) return pDate >= start;
        if (end) return pDate <= end;
        return true;
      });
    }

    setFilteredPayments(filtered);
  }, [searchName, fromDate, toDate, payments]);

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
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Payments
            </h2>

            {error && (
              <div className="text-center pb-3 font-semibold text-lg text-red-600">
                {error}
              </div>
            )}

            {/* 🔍 SEARCH SECTION */}
            <div className="w-full mb-8 flex flex-wrap justify-center gap-4">
              {/* Resident Name */}
              <div className="flex flex-col">
                <label className="text-emerald-900 dark:text-emerald-100 text-xl text-black font-bold mb-1 ml-1">Resident Name</label>
                <input
                  type="text"
                  placeholder="Search Name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full md:w-64 py-3 px-4 rounded-lg border border-gray-300 shadow bg-white dark:bg-emerald-950/40 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* From Date */}
              <div className="flex flex-col">
                <label className="text-emerald-900 dark:text-emerald-100 text-xl font-bold mb-1 ml-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full md:w-48 text-black py-3 px-4 rounded-lg border border-gray-300 shadow bg-white dark:bg-emerald-950/40 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col">
                <label className="text-emerald-900 dark:text-emerald-100 text-xl font-bold mb-1 ml-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full md:w-48 py-3 px-4 text-black rounded-lg border border-gray-300 shadow bg-white dark:bg-emerald-950/40 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Reset Button */}
              <button 
                onClick={() => { setSearchName(""); setFromDate(""); setToDate(""); }}
                className="mt-6 px-4 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold shadow-md self-center transition-all"
              >
                Reset
              </button>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full table-fixed text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 text-left font-bold w-3/12">Resident</th>
                    <th className="p-4 text-left font-bold w-3/12">Email</th>
                    <th className="p-4 text-left font-bold w-2/12">Bill Type</th>
                    <th className="p-4 text-left font-bold w-2/12">Amount</th>
                    <th className="p-4 text-center font-bold w-2/12">Payment Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-emerald-900 dark:text-emerald-100 text-xl font-bold italic">Loading...</td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-black text-xl">
                        No payments found for this selection.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className={`transition-colors ${
                          index % 2 === 0
                            ? "bg-white/100 dark:bg-emerald-900/40"
                            : "bg-emerald-100/50 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 text-black font-medium">{payment.user?.name}</td>
                        <td className="px-4 py-3 text-black">{payment.user?.email}</td>
                        <td className="px-4 py-3 text-black">{payment.billType}</td>
                        <td className="px-4 py-3 text-black font-semibold text-emerald-700 dark:text-emerald-300">₹{payment.amount}</td>
                        <td className="px-4 py-3 font-semibold text-black text-center">{formatDate(payment.transactionDate)}</td>
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

export default Payments;