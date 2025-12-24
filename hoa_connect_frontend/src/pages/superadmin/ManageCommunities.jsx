import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderNavbar from "./HeaderNavbar";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const ManageCommunities = ({ darkMode }) => {
  const [communities, setCommunities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form fields mapped to backend controller
  const [formData, setFormData] = useState({
    communityName: "",
    address: "",
    hoaAdminName: "",
    hoaAdminEmail: "",
    hoaAdminPassword: "",
    hoaAdminPhoneNumber: "",
    isResident: false,
    amenityIds: [], // MULTIPLE amenities
  });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ---------- Fetch Communities ----------
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/superadmin/getcommunities",
        getAuthConfig()
      );
      setCommunities(res.data?.communities || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load communities");
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Amenities ----------
  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/amenities/getamenities",
        getAuthConfig()
      );
      setAmenities(res.data?.amenities || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load amenities");
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
    fetchAmenities();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, options, multiple } = e.target;

    if (name === "amenityIds" && multiple) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData((prev) => ({ ...prev, amenityIds: selected }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // ---------- Create Community ----------
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        communityName: formData.communityName,
        address: formData.address,
        // send whole array of amenity ids
        amenities: formData.amenityIds,
        isResident: formData.isResident,
        hoaAdminName: formData.hoaAdminName,
        hoaAdminEmail: formData.hoaAdminEmail,
        hoaAdminPassword: formData.hoaAdminPassword,
        hoaAdminPhoneNumber: formData.hoaAdminPhoneNumber,
      };

      await axios.post(
        "http://localhost:5000/superadmin/addCommunity",
        payload,
        getAuthConfig()
      );
      await fetchCommunities();
      setFormData({
        communityName: "",
        address: "",
        hoaAdminName: "",
        hoaAdminEmail: "",
        hoaAdminPassword: "",
        hoaAdminPhoneNumber: "",
        isResident: false,
        amenityIds: [],
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create community");
    }
  };

  // ---------- Start Edit ----------
  const startEdit = (comm) => {
    setIsEditing(true);
    setEditId(comm._id);

    // collect all amenity ids for this community
    const ids =
      Array.isArray(comm.amenities) && comm.amenities.length > 0
        ? comm.amenities.map((a) => a._id?.toString() || a.toString())
        : [];

    setFormData((prev) => ({
      ...prev,
      communityName: comm.name || "",
      address: comm.address || "",
      hoaAdminName: comm.user?.name || "",
      hoaAdminEmail: comm.user?.email || "",
      hoaAdminPassword: "",
      // keep existing phone number in state so it doesn't disappear visually
      hoaAdminPhoneNumber: comm.user?.phoneNo || "",
      isResident: comm.user?.isResident ?? false,
      amenityIds: ids,
    }));
  };

  // ---------- Update Community (only HOA admin replace) ----------
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // replaceHoaAdmin can only change name/email/password
      await axios.put(
        `http://localhost:5000/superadmin/updatecommunities/${editId}/replace-admin`,
        {
          newAdminName: formData.hoaAdminName,
          newAdminEmail: formData.hoaAdminEmail,
          newAdminPassword: formData.hoaAdminPassword,
          newAdminPhoneNo: formData.hoaAdminPhoneNumber,
          amenities: formData.amenityIds, // array of ids
        },
        getAuthConfig()
      );

      await fetchCommunities();
      setIsEditing(false);
      setEditId(null);
      setFormData({
        communityName: "",
        address: "",
        hoaAdminName: "",
        hoaAdminEmail: "",
        hoaAdminPassword: "",
        hoaAdminPhoneNumber: "",
        isResident: false,
        amenityIds: [],
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to update community");
    }
  };

  // ---------- Delete Community ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this community?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/superadmin/deleteCommunity/${id}`,
        getAuthConfig()
      );
      await fetchCommunities();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete community");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <section
        className={`rounded-xl shadow-lg px-6 py-9 transition-colors duration-300
          ${
            darkMode
              ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
              : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
          }`}
      >
        <h2
          className={`text-4xl font-bold mb-6 text-center ${
            darkMode ? "text-teal-900" : "text-gray-900"
          }`}
        >
          Manage HOA Admin Communities
        </h2>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            type="text"
            name="communityName"
            placeholder="Community Name"
            value={formData.communityName}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-500"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
            required
          />
          <input
            name="address"
            placeholder="Community Address"
            value={formData.address}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-500"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
            required
          />

          <input
            type="text"
            name="hoaAdminName"
            placeholder="HOA Admin Name"
            value={formData.hoaAdminName}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
          />
          <input
            type="email"
            name="hoaAdminEmail"
            placeholder="HOA Admin Email"
            value={formData.hoaAdminEmail}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
          />

          {!isEditing && (
            <input
              type="password"
              name="hoaAdminPassword"
              placeholder="HOA Admin Password"
              value={formData.hoaAdminPassword}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900 placeholder-gray-750"
              }`}
            />
          )}

          <input
            type="text"
            name="hoaAdminPhoneNumber"
            placeholder="HOA Admin Phone Number"
            maxLength="10"
            value={formData.hoaAdminPhoneNumber}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
          />

          {/* Multi-select Amenities */}
          <select
            name="amenityIds"
            multiple
            value={formData.amenityIds}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 h-32 ${
              darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                : "bg-white text-gray-900 placeholder-gray-750"
            }`}
          >
            {amenities.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>

          <label
            className={`flex items-center gap-2 mt-2 ${
              darkMode ? "text-teal-100" : "text-gray-900"
            }`}
          >
            <input
              type="checkbox"
              name="isResident"
              checked={formData.isResident}
              onChange={handleChange}
              className="w-4 h-4"
            />
            HOA Admin is also a resident
          </label>

          <div className="col-span-2 flex gap-3 mt-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow font-semibold"
            >
              {isEditing ? "Update Community" : "Add Community"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({
                    communityName: "",
                    address: "",
                    hoaAdminName: "",
                    hoaAdminEmail: "",
                    hoaAdminPassword: "",
                    hoaAdminPhoneNumber: "",
                    isResident: false,
                    amenityIds: [],
                  });
                }}
                className="px-6 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg shadow mt-6">
          <table className="w-full text-center rounded-lg overflow-hidden border-separate border-spacing-0">
            <thead
              className={`${
                darkMode
                  ? "bg-emerald-900 text-emerald-50"
                  : "bg-emerald-100 text-emerald-900"
              }`}
            >
              <tr>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Address
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Admin Name
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Phone No
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Amenities
                </th>
                <th className="px-6 py-3 border-b border-emerald-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-emerald-900/80 dark:text-emerald-100/80 italic"
                  >
                    No communities found.
                  </td>
                </tr>
              ) : (
                communities.map((comm, idx) => (
                  <tr
                    key={comm._id}
                    className={`transition ${
                      darkMode
                        ? idx % 2 === 0
                          ? "bg-emerald-900/40"
                          : "bg-emerald-900/30"
                        : idx % 2 === 0
                        ? "bg-white/70"
                        : "bg-emerald-50/80"
                    } hover:bg-emerald-200/60 dark:hover:bg-emerald-900/60`}
                  >
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {comm.name}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {comm.address}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {comm.user?.name || "-"}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {comm.user?.email || "-"}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {comm.user?.phoneNo || "-"}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      {Array.isArray(comm.amenities) &&
                      comm.amenities.length > 0
                        ? comm.amenities.map((a) => a.name).join(", ")
                        : "-"}
                    </td>
                    <td className="px-6 py-3 border-b border-emerald-200/70">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(comm)}
                          className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 flex items-center gap-1"
                          title="Edit Community"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comm._id)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                          title="Delete Community"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <ManageCommunities darkMode={darkMode} />
    </HeaderNavbar>
  );
};

export default Dashboard;
