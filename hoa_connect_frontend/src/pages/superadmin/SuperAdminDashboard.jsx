import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState({ totalPayments: 0 });
  const [features] = useState([
    "Manage multiple Communities (create, edit, delete)",
    "Assign or remove HOA Admins for communities",
    "View all payments & transactions (global reports)",
    "Generate overall analytics reports",
    "Send system-wide notifications",
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login"); // Redirect if not authorized
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch total communities
    axios
      .get("http://localhost:5000/communities/getCommunity", config)
      .then((res) => {
        setCommunitiesCount(Array.isArray(res.data) ? res.data.length : 0);
      })
      .catch(() => {
        setCommunitiesCount(0);
      });

    // Fetch all users and filter HOA admins
    axios
      .get("http://localhost:5000/auth/register", config)
      .then((res) => {
        const admins = Array.isArray(res.data)
          ? res.data.filter((user) => user.role === "admin")
          : [];
        setHoaAdminsCount(admins.length);
      })
      .catch(() => {
        setHoaAdminsCount(0);
      });

    // Fetch total payments
    axios
      .get("http://localhost:5000/dashboard/total-payments", config)
      .then((res) => {
        const total = res.data?.total || 0;
        setAnalytics({ totalPayments: total });
      })
      .catch(() => {
        setAnalytics({ totalPayments: 0 });
      });
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HOA Connect</div>
        <nav>
          <ul>
            <li className="active">Super Admin Dashboard</li>
            <li
              onClick={() => navigate("/manage-communities")}
              style={{ cursor: "pointer" }}
            >
              Communities
            </li>
            <li
              onClick={() => navigate("/hoa-admins")}
              style={{ cursor: "pointer" }}
            >
              HOA Admins
            </li>
            <li
              onClick={() => navigate("/payments")}
              style={{ cursor: "pointer" }}
            >
              Payments
            </li>
            <li
              onClick={() => navigate("/analytics")}
              style={{ cursor: "pointer" }}
            >
              Analytics
            </li>
            <li
              onClick={() => navigate("/notifications")}
              style={{ cursor: "pointer" }}
            >
              Notifications
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>Super Admin Dashboard</h1>

        <div className="main-cards">
          <div className="card">
            <h2>Total Communities</h2>
            <p>{communitiesCount}</p>
          </div>
          <div className="card">
            <h2>HOA Admins Assigned</h2>
            <p>{hoaAdminsCount}</p>
          </div>
          <div className="card">
            <h2>Total Payments</h2>
            <p>${analytics.totalPayments.toLocaleString()}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="section">
            <h3>Super Admin Features</h3>
            <ul>
              {features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="section">
            <h3>Analytics Overview</h3>
            <div className="analytics-placeholder">
              {analytics ? (
                <div className="analytics-summary">
                  <p>
                    <strong>Total Payments:</strong> $
                    {analytics.totalPayments.toLocaleString()}
                  </p>
                </div>
              ) : (
                "[Graph Placeholder]"
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
