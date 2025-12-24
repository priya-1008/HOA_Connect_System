import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setUser({ token: data.token, role: data.role });

        // Role-based navigation
        if (data.role === "superadmin") {
          navigate("/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "resident") {
          navigate("/resident-dashboard");
        } else {
          setError("Unknown role!");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        alt="HOA"
        className="absolute inset-0 w-full h-screen object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-50 z-10"></div>

      {/* Card */}
      <div className="relative z-20 w-full max-w-xl min-h-[600px] bg-white rounded-2xl shadow-xl p-12 border flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-6">
          HOA CONNECT SYSTEM
        </h1>
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-7">
          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 text-lg"
              required
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 text-lg pr-12"
              required
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[52px] cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-teal-700 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition shadow-md text-lg"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-md text-center text-gray-500 mt-8">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-bold hover:underline"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
