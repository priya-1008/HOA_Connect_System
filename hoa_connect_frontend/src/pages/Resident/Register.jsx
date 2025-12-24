import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    houseNumber: "",
    role: "resident",
    communityId: "",
  });

  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState("");
  const [loadingCommunities, setLoadingCommunities] = useState(false);

  const fetchCommunities = async () => {
    try {
      setLoadingCommunities(true);

      const res = await axios.get("http://localhost:5000/superadmin/getcommunities");

      const list = Array.isArray(res.data?.communities)
        ? res.data.communities
        : Array.isArray(res.data)
        ? res.data
        : [];

      setCommunities(list);

      if (list.length > 0 && !form.communityId) {
        setForm((prev) => ({ ...prev, communityId: list[0]._id }));
      }

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load communities. Please try again."
      );
      setCommunities([]);
    } finally {
      setLoadingCommunities(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNo: form.phoneNo,
        houseNumber: form.houseNumber,
        communityId: form.communityId,
        role: "resident",
      };

      const response = await axios.post(
        "http://localhost:5000/resident/register",
        payload
      );

      if (response.data) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden">

      {/* LEFT IMAGE */}
      <div className="w-1/2 h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="HOA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
      </div>

      {/* RIGHT FORM - FULL WIDTH UTILIZED */}
      <div className="w-1/2 h-screen flex items-center justify-center bg-white px-12">

        <div className="w-full">  {/* REMOVED max-width SO FULL WIDTH IS USED */}
          
          <h1 className="text-4xl font-bold text-center text-gray-400 mb-4">
            HOA CONNECT SYSTEM
          </h1>

          <h2 className="text-4xl font-bold text-center text-teal-700 mb-10">
            Sign Up
          </h2>

          <form onSubmit={handleRegister} className="space-y-6 w-full">

            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
                placeholder="Enter password"
              />
            </div>

            <div>
              <input
                type="text"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <input
                type="text"
                name="houseNumber"
                value={form.houseNumber}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
                placeholder="Enter house / flat number"
              />
            </div>

            <div>
              <input
                type="text"
                value="resident"
                readOnly
                className="w-full px-5 py-4 border rounded-lg bg-gray-100 text-lg"
              />
            </div>

            <div>
              <select
                name="communityId"
                value={form.communityId}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border rounded-lg text-lg"
              >
                <option value="" selected>Select community</option>
                {communities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-600 text-md font-medium bg-red-100 px-4 py-3 rounded-lg text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-md mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold hover:underline"
            >
              Login Here
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
