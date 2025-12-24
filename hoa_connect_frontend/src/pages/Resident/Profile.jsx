import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Home, Calendar, BadgeCheck, ShieldCheck } from "lucide-react"; 
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    houseNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ===================== FRIENDLY AVATAR (Lorelei Style) ==========================
  const avatarUrl = useMemo(() => {
    if (!form.name) return "https://api.dicebear.com/7.x/lorelei/svg?seed=Lucky";
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  }, [form.name]);

  // ===================== FETCH PROFILE ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/resident/getmyprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.profile;
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNo: data.phoneNo || "",
          houseNumber: data.houseNumber || "",
        });
      } catch (err) {
        setError("Unable to fetch profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // ===================== UPDATE PROFILE (FIXED API PAYLOAD) ==========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      setSaving(true);
      setError(""); 
      setSuccess("");

      // CRITICAL FIX: Ensure keys match your Backend Controller's req.body
      const payload = {
        name: form.name,
        email: form.email,
        phoneNo: form.phoneNo,      // If backend fails, try changing this to 'phone'
        houseNumber: form.houseNumber // If backend fails, try changing this to 'house'
      };

      const res = await axios.put("http://localhost:5000/resident/updateprofile", 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If the response contains the updated data, sync it back to the state
      if (res.data) {
        setSuccess("Profile updated successfully!");
        // Optional: Refresh local state with updated data from server
        // setProfile(res.data.updatedProfile || res.data.profile); 
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      setError(err.response?.data?.message || "Server error: Profile not updated in database.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <main className="relative z-10 p-6 md:p-12 flex flex-col items-center w-full">
          <section className="w-full max-w-5xl space-y-8">
            
            {/* 1. TOP PROFILE HEADER */}
            <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 border border-white/40">
              <div className="relative">
                <img src={avatarUrl} alt="Avatar" className="w-36 h-36 rounded-full border-4 border-emerald-500 bg-white/90 shadow-2xl" />
                <div className="absolute bottom-1 right-1 bg-emerald-600 p-2 rounded-full border-2 border-white">
                  <BadgeCheck size={24} className="text-white" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-5xl font-black text-emerald-950 drop-shadow-sm uppercase">
                  {form.name || "Resident"}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-4">
                  <span className="bg-emerald-800 text-white px-6 py-2 rounded-xl text-base font-bold tracking-widest uppercase">
                    {profile?.role || "Resident"}
                  </span>
                  <p className="text-emerald-950 font-extrabold text-xl flex items-center gap-2">
                    <Calendar size={22} className="text-emerald-800" /> 
                    Joined: {profile ? new Date(profile.createdAt).toLocaleDateString() : "--/--/----"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. MAIN ACCOUNT SETTINGS (Increased Font & Size) */}
            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="bg-emerald-900/90 p-6 text-center">
                <h3 className="text-3xl font-black text-white tracking-widest uppercase flex items-center justify-center gap-4">
                  <ShieldCheck size={32} /> Account Settings
                </h3>
              </div>

              <div className="p-12 md:p-16">
                {error && <div className="mb-8 bg-red-600 text-white p-5 rounded-xl text-center font-bold text-xl border-2 border-red-400 shadow-lg">{error}</div>}
                {success && <div className="mb-8 bg-emerald-600 text-white p-5 rounded-xl text-center font-bold text-xl border-2 border-emerald-400 shadow-lg">{success}</div>}

                <form onSubmit={handleUpdate} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    {[
                      { label: "Full Name", name: "name", icon: <User size={26}/>, value: form.name },
                      { label: "Email Address", name: "email", icon: <Mail size={26}/>, value: form.email },
                      { label: "Phone Number", name: "phoneNo", icon: <Phone size={26}/>, value: form.phoneNo },
                      { label: "House / Unit No", name: "houseNumber", icon: <Home size={26}/>, value: form.houseNumber },
                    ].map((field) => (
                      <div key={field.name} className="flex flex-col gap-4">
                        <label className="text-emerald-950 font-black text-base uppercase flex items-center gap-3 px-1 tracking-widest">
                          {field.icon} {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={field.value}
                          onChange={handleChange}
                          className="w-full bg-white/90 border-2 border-emerald-100 p-6 rounded-2xl text-emerald-900 font-bold text-2xl focus:bg-white focus:border-emerald-600 focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all shadow-md"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-10">
                    <button
                      disabled={saving}
                      type="submit"
                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-black py-6 px-24 rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-xl border-b-8 border-emerald-950"
                    >
                      {saving ? "SAVING DATA..." : "UPDATE PROFILE NOW"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Profile;