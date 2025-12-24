import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie
} from "recharts";
import {
  UsersIcon, BellIcon, CurrencyDollarIcon, MegaphoneIcon, 
  ClipboardDocumentListIcon, CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white/50 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-lg p-6 flex flex-col items-start justify-center hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
    </div>
    <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    notifications: 0, residents: 0, hoaAdmins: 0,
    complaints: 0, announcements: 0, amenities: 0, totalPayments: 0,
  });

  // State for monthly data
  const [monthlyPayments, setMonthlyPayments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    axios.get("http://localhost:5000/hoaadmin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data.data);
        // Assuming your backend provides monthly breakdown: res.data.data.monthlyHistory
        // Placeholder data if backend isn't ready:
        setMonthlyPayments(res.data.data.monthlyHistory || [
          { month: "Jan", amount: 4000 },
          { month: "Feb", amount: 3000 },
          { month: "Mar", amount: 5000 },
          { month: "Apr", amount: res.data.data.totalPayments } 
        ]);
      })
      .catch(() => console.log("Error fetching analytics"));
  }, [navigate]);

  const resourceData = [
    { name: "Residents", count: data.residents },
    { name: "Amenities", count: data.amenities }
  ];

  const distributionData = [
    { name: "Complaints", value: data.complaints, color: "#ef4444" },
    { name: "Announcements", value: data.announcements, color: "#f97316" },
    { name: "Notifications", value: data.notifications, color: "#2563eb" },
  ];

  return (
    <HOAHeaderNavbar>
      <div className="relative flex flex-col min-h-screen overflow-y-auto" style={{ backgroundImage: "url('/Society.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/40 dark:bg-gray-700/85 pointer-events-none" />
        
        <main className="relative z-10 pb-20">
          <div className="h-[200px] flex items-center justify-center text-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-xl">Admin Dashboard</h1>
          </div>

          {/* Stats Grid */}
          <section className="px-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            <StatCard title="Total Notifications" value={data.notifications} color="text-blue-600" icon={BellIcon} />
            <StatCard title="Total Residents" value={data.residents} color="text-green-600" icon={UsersIcon} />
            <StatCard title="Complaints" value={data.complaints} color="text-red-600" icon={ClipboardDocumentListIcon} />
            <StatCard title="Announcements" value={data.announcements} color="text-orange-500" icon={MegaphoneIcon} />
            <StatCard title="Amenities" value={data.amenities} color="text-teal-600" icon={CalendarDaysIcon} />
            <StatCard title="Total Payments" value={`₹${data.totalPayments.toLocaleString()}`} color="text-emerald-600" icon={CurrencyDollarIcon} />
          </section>

          <section className="px-10 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
            
            {/* 1. Monthly Revenue Collection (Area Chart) */}
            <div className="bg-white/60 backdrop-blur-md border border-gray-300 rounded-2xl p-6 shadow-xl lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Revenue Trend (₹)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPayments}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" />
                    <XAxis dataKey="month" tick={{fill: '#374151', fontWeight: 'bold'}} />
                    <YAxis tick={{fill: '#374151'}} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
                    <Area type="monotone" dataKey="amount" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Resources Comparison (Bar Chart) */}
            <div className="bg-white/60 backdrop-blur-md border border-gray-300 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resources Count</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData}>
                    <XAxis dataKey="name" tick={{fill: '#374151'}} />
                    <YAxis />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
                        <Cell fill="#16a34a" />
                        <Cell fill="#0d9488" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Communication Distribution (Pie Chart) */}
            <div className="bg-white/60 backdrop-blur-md border border-gray-300 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alert Distribution</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
                      paddingAngle={5} dataKey="value"
                      label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Dashboard;