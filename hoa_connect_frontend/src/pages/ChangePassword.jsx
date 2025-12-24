import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNo,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password updated successfully. Please login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Failed to update password");
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
          Forgot Password
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded-lg text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="resident@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 text-lg"
              required
            />
          </div>

          {/* House Number */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="0123456789"
              value={phoneNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setPhoneNo(value);
                }
              }}
              minLength={10}
              maxLength={10}
              pattern="[0-9]{10}"
              title="Phone number must be exactly 10 digits"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 text-lg"
              required
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition shadow-md text-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-md text-center text-gray-500 mt-8">
          Remembered your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
