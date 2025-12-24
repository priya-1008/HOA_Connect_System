import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Amenities = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [myBookings, setMyBookings] = useState([]); // <-- ADDED
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);

    axios
      .get("http://localhost:5000/resident/getamenitiesbyresident", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAmenities(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setError("Failed to load amenities"))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // 🔥 NEW USE EFFECT TO LOAD USER BOOKINGS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/resident/getmybookamenity", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMyBookings(res.data.booking || []);
      })
      .catch(() => console.log("Failed to load my bookings"));
  }, [success]);

  const handleBookAmenity = async () => {
    if (!selectedAmenity) return;

    if (!bookingDate) {
      setError("Please select a booking date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setBookingLoading(true);

      const res = await axios.post(
        "http://localhost:5000/resident/bookamenity",
        {
          amenityId: selectedAmenity._id,
          bookingDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message || "Amenity booked successfully");
      setError("");
      setSelectedAmenity(null);
      setBookingDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
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
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-center text-emerald-900 dark:text-emerald-100">
              Amenities
            </h2>

            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error ? "text-red-600" : "text-emerald-700"
                }`}
              >
                {error || success}
              </div>
            )}

            {loading && (
              <p className="text-center text-emerald-900 dark:text-emerald-100">
                Loading amenities...
              </p>
            )}

            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md bg-white/60 dark:bg-emerald-950/40">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 font-semibold text-left">Name</th>
                    <th className="p-4 font-semibold text-left">Description</th>
                    <th className="p-4 font-semibold text-left">Maintenance</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && amenities.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 italic font-bold"
                      >
                        No amenities found.
                      </td>
                    </tr>
                  )}

                  {amenities.map((a, index) => (
                    <tr
                      key={a._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/70 dark:bg-emerald-900/60"
                      } hover:bg-emerald-200/60`}
                    >
                      <td className="px-4 py-3 text-black font-medium">{a.name}</td>
                      <td className="px-4 py-3 text-black font-medium">{a.description}</td>
                      <td className="px-4 py-3 text-black font-medium capitalize">
                        {a.maintenanceStatus || "available"}
                      </td>

                      <td className="px-4 py-3 text-black text-center">
                        <button
                          onClick={() => {
                            setSelectedAmenity(a);
                            setError("");
                            setSuccess("");
                          }}
                          disabled={a.maintenanceStatus !== "available"}
                          className={`px-4 py-2 rounded text-white font-semibold ${
                            a.maintenanceStatus === "available"
                              ? "bg-green-800 hover:bg-green-900"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {a.maintenanceStatus === "available"
                            ? "Book"
                            : "Unavailable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ★★★★★ NEW SECTION: SHOW MY BOOKINGS TABLE ★★★★★ */}
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-10">
            <h3 className="text-3xl font-extrabold text-center text-emerald-900 dark:text-emerald-100 mb-7">
              My Booked Amenities
            </h3>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full bg-white/60 dark:bg-emerald-950/40 rounded-xl shadow-md">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 text-left">Amenity</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Booking Date</th>
                  </tr>
                </thead>

                <tbody>
                  {myBookings.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-6 italic text-black font-semibold"
                      >
                        No booked amenities found.
                      </td>
                    </tr>
                  )}

                  {myBookings.map((b, i) => (
                    <tr
                      key={b._id}
                      className={`${
                        i % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/70 dark:bg-emerald-900/60"
                      }`}
                    >
                      <td className="px-4 py-3 text-black font-medium">
                        {b.amenity?.name}
                      </td>
                      <td className="px-4 py-3 text-black font-medium">{b.amenity?.description}</td>
                      <td className="px-4 py-3 text-black font-medium">
                        {b.bookingDate?.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {selectedAmenity && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div className="bg-white dark:bg-emerald-900 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-2xl font-bold text-center mb-4">
                  Book Amenity
                </h3>

                <p className="mb-2 font-medium">
                  Amenity:{" "}
                  <span className="font-bold">{selectedAmenity.name}</span>
                </p>

                <label className="block font-semibold mb-1">
                  Booking Date:
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2 rounded border"
                />

                <div className="flex justify-between mt-5">
                  <button
                    className="px-5 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={() => {
                      setSelectedAmenity(null);
                      setBookingDate("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    onClick={handleBookAmenity}
                  >
                    {bookingLoading ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Amenities;
