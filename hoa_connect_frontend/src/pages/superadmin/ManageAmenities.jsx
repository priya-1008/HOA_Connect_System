import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderNavbar from "./HeaderNavbar";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const ManageAmenities = ({ darkMode }) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch amenities
  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get(
        "http://localhost:5000/amenities/getamenities",
        config
      );
      setAmenities(res.data.amenities || []);
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
    fetchAmenities();
  }, []);

  // On change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create amenity
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      await axios.post(
        "http://localhost:5000/amenities/addamenity",
        {
          name: formData.name,
          description: formData.description,
        },
        config
      );
      fetchAmenities();
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add amenity");
    }
  };

  // Edit
  const startEdit = (amenity) => {
    setIsEditing(true);
    setEditId(amenity._id);
    setFormData({
      name: amenity.name || "",
      description: amenity.description || "",
    });
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      await axios.put(
        `http://localhost:5000/amenities/updateamenity/${editId}`,
        {
          name: formData.name,
          description: formData.description,
        },
        config
      );
      fetchAmenities();
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to update amenity");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this amenity?")) return;
    try {
      const config = getAuthConfig();
      await axios.delete(
        `http://localhost:5000/amenities/deleteamenity/${id}`,
        config
      );
      fetchAmenities();
    } catch (err) {
      console.error(err);
      setError("Failed to delete amenity");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <section
        className={`rounded-xl shadow-lg px-6 py-9 transition-colors duration-300
        ${
          darkMode
            ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
            : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-6 text-center ${
            darkMode ? "text-teal-900" : "text-gray-900"
          }`}
        >
          Manage Amenities
        </h1>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {/* Amenity Form */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Amenity Name */}
          <input
            type="text"
            name="name"
            placeholder="Amenity Name"
            value={formData.name}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700"
                  : "bg-white text-gray-900"
              }`}
          />

          {/* Amenity Description */}
          <textarea
            name="description"
            placeholder="Amenity Description"
            value={formData.description}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700"
                  : "bg-white text-gray-900"
              }`}
          />

          {/* Buttons */}
          <div className="col-span-2 flex gap-3 mt-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow font-semibold"
            >
              {isEditing ? "Update Amenity" : "Add Amenity"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({ name: "", description: "" });
                }}
                className="px-6 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Amenities Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full rounded-lg overflow-hidden text-center">
            <thead
              className={`${
                darkMode
                  ? "bg-teal-800 text-teal-100"
                  : "bg-teal-100 text-teal-900"
              }`}
            >
              <tr>
                <th className="px-4 py-2 border-b-2">Name</th>
                <th className="px-4 py-2 border-b-2">Description</th>
                <th className="px-4 py-2 border-b-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {amenities.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No amenities found.
                  </td>
                </tr>
              ) : (
                amenities.map((amenity) => (
                  <tr
                    key={amenity._id}
                    className={`${
                      darkMode ? "hover:bg-slate-800" : "hover:bg-teal-50"
                    } transition`}
                  >
                    <td className="px-4 py-2 border-b">{amenity.name}</td>
                    <td className="px-4 py-2 border-b">
                      {amenity.description || "—"}
                    </td>

                    <td className="px-4 py-2 border-b flex justify-center gap-3">
                      <button
                        onClick={() => startEdit(amenity)}
                        className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                        title="Edit Amenity"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(amenity._id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Delete Amenity"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
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

const AmenitiesDashboard = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <ManageAmenities darkMode={darkMode} />
    </HeaderNavbar>
  );
};

export default AmenitiesDashboard;
