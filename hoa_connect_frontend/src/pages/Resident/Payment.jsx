import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const ResidentPayment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    amount: "",
    billType: "",
    method: "UPI",
  });

  const [showGateway, setShowGateway] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [payments, setPayments] = useState([]);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:5000/resident/getmyprofile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.profile);
        setCommunity(res.data.profile.community);
        fetchPayments();
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const fetchPayments = () => {
    axios
      .get("http://localhost:5000/resident/getpaymenthistory", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayments(res.data.payments))
      .catch(() => console.log("Error loading payments"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const initiatePayment = async () => {
    if (!form.amount || !form.billType) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/resident/payment/initiate",
        {
          ...form,
          userId: user._id,
          communityId: user?.community?._id || community,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransaction(res.data);
      setShowGateway(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to initiate payment. Try again."
      );
    }
  };

  const completePayment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/resident/payment/${transaction.paymentId}/success`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Payment Successful!");
      setShowGateway(false);
      fetchPayments();
    } catch {
      setError("Payment failed");
    }
  };

  const downloadReceipt = async (transactionId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/resident/payment/receipt/${transactionId}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${transactionId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download receipt");
    }
  };

  if (loading) return <h2 className="text-center mt-20">Loading...</h2>;

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
        <div className="absolute inset-0 bg-black/40" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          {/* PAYMENT FORM — Bigger Width */}
          <div
            className="w-full max-w-3xl bg-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800
                    backdrop-blur-lg p-10 rounded-2xl shadow-xl mb-10"
          >
            <h2 className="text-4xl font-extrabold text-center mb-7 text-emerald-900 dark:text-white">
              Payments
            </h2>

            {!showGateway && (
              <div className="flex flex-col gap-4 mb-8">
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full py-4 px-4 text-black rounded-lg border bg-white shadow"
                />

                <select
                  name="billType"
                  value={form.billType}
                  onChange={handleChange}
                  className="w-full py-4 px-4 text-black rounded-lg border bg-white shadow"
                >
                  <option value="">Select Bill Type</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="amenity">Amenity</option>
                  <option value="penalty">Penalty</option>
                  <option value="event">Event Charges</option>
                  <option value="other">Other Charges</option>
                </select>

                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full py-4 px-4 text-black rounded-lg border bg-white shadow"
                >
                  <option value="UPI">UPI</option>
              </select>
                <button
                  onClick={initiatePayment}
                  className="w-full py-3 text-xl bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg"
                >
                  Proceed to Pay
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT SUMMARY + PAYMENT HISTORY */}
          <section
            className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800
                    backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8"
          >
            {showGateway && transaction && (
              <div className="max-w-lg mx-auto bg-white dark:bg-emerald-800 rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-3xl font-bold text-center text-emerald-900 dark:text-emerald-100 mb-6">
                  Payment Summary
                </h3>

                <p>
                  <strong>Amount:</strong> ₹{form.amount}
                </p>
                <p>
                  <strong>Bill Type:</strong> {form.billType}
                </p>
                <p>
                  <strong>Payment Method:</strong> {form.method}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {transaction.transactionId}
                </p>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={completePayment}
                    className="py-3 bg-green-800 hover:bg-green-900 text-white rounded-lg font-bold"
                  >
                    Pay Now
                  </button>

                  <button
                    onClick={() => setShowGateway(false)}
                    className="py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {(error || success) && (
              <p
                className={`text-center text-lg font-semibold mb-4 ${
                  error ? "text-red-600" : "text-green-700"
                }`}
              >
                {error || success}
              </p>
            )}

            {/* FULL WIDTH PAYMENT HISTORY TABLE */}
            <div className="w-full mb-8">
              <h2 className="text-3xl font-extrabold text-center mb-6 text-emerald-900 dark:text-white">
                Payments History
              </h2>

              <table className="w-full border border-gray-300 rounded-xl overflow-hidden bg-white/50 shadow-md">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 y-3 font-medium text-left">
                      Transaction ID
                    </th>
                    <th className="p-4 y-3 font-medium text-left">Amount</th>
                    <th className="p-4 y-3 font-medium text-left">Bill Type</th>
                    <th className="p-4 y-3 font-medium text-left">Status</th>
                    <th className="p-4 y-3 font-medium text-left">Date</th>
                    <th className="p-4 y-3 font-medium text-center">Receipt</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-black text-center italic">
                        No payments found.
                      </td>
                    </tr>
                  )}

                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="odd:bg-white even:bg-emerald-100/40"
                    >
                      <td className="px-4 text-black py-3">{p.transactionId}</td>
                      <td className="px-4 text-black py-3">₹{p.amount}</td>
                      <td className="px-4 text-black py-3">{p.billType}</td>
                      <td className="px-4 text-black py-3">{p.status}</td>
                      <td className="px-4 text-black py-3">
                        {formatDateTime(p.transactionDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.status === "completed" ? (
                          <button
                            onClick={() => downloadReceipt(p.transactionId)}
                            className="bg-green-800 hover:bg-green-900 text-white px-3 py-1 rounded"
                          >
                            Download
                          </button>
                        ) : (
                          "Not Available"
                        )}
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

export default ResidentPayment;
