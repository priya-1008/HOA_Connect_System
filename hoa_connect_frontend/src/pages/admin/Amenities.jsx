import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Amenities = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAmenities = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "http://localhost:5000/hoaadmin/getamenities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ FIX: Handle ANY response format safely
        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.amenities)
            ? res.data.amenities
            : [];

        setAmenities(list);
      } catch (err) {
        console.error("Error fetching amenities:", err.response || err);
        setError(
          err?.response?.data?.message ||
            "Could not load amenities for this community."
        );
        setAmenities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, [navigate, token, success]);

  // -----------------------------
  // UPDATE MAINTENANCE STATUS
  // -----------------------------
  const handleChange = async (id, value) => {
    try {
      await axios.put(
        `http://localhost:5000/hoaadmin/updateamenity/${id}`,
        { maintenanceStatus: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update UI instantly
      setAmenities((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, maintenanceStatus: value } : item
        )
      );

      setSuccess("Maintenance status updated!");
    } catch (err) {
      console.error("Error updating amenity:", err);
      setError("Failed to update status");
    }
  };

  // -----------------------------
  // DELETE AMENITY
  // -----------------------------
  const handleDelete = async (id) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await axios.delete(
        `http://localhost:5000/hoaadmin/deleteamenity/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAmenities((prev) => prev.filter((a) => a._id !== id));
      setSuccess("Amenity deleted successfully.");
    } catch (err) {
      console.error("Error deleting amenity:", err.response || err);
      setError(err?.response?.data?.message || "Failed to delete amenity.");
    } finally {
      setDeletingId(null);
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
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70"></div>

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Amenities
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

            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full text-sm md:text-base table-fixed">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 font-bold text-left w-3/12">Name</th>
                    <th className="p-4 font-bold text-left w-5/12">
                      Description
                    </th>
                    <th className="p-4 font-bold text-left w-2/12">
                      Maintenance Status
                    </th>
                  </tr>
                </thead>

                <tbody className="align-top">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : amenities.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-black font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No amenities found.
                      </td>
                    </tr>
                  ) : (
                    amenities.map((a, index) => (
                      <tr
                        key={a._id}
                        className={`transition-colors ${
                          index % 2 === 0
                            ? "bg-white dark:bg-emerald-900/40"
                            : "bg-emerald-100 dark:bg-emerald-900/60"
                        }`}
                      >
                        <td className="px-4 py-3 text-black font-medium break-words">
                          {a.name}
                        </td>

                        <td className="px-4 py-3 font-medium text-black break-words whitespace-pre-wrap">
                          {a.description}
                        </td>

                        <td className="px-4 py-3 text-black">
                          <select
                            value={a.maintenanceStatus}
                            onChange={(e) =>
                              handleChange(a._id, e.target.value)
                            }
                            className="p-2 border text-black rounded-lg w-full"
                          >
                            <option value="">Select Maintenance Status</option>
                            <option value="available">Available</option>
                            <option value="under_maintenance">
                              Under Maintenance
                            </option>
                            <option value="closed">Closed</option>
                          </select>
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

export default Amenities;
