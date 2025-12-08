"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Header from "../../components/header";
import "../../styles/adminDashboard.css";
import { useRouter } from "next/navigation";

interface Application {
  fullName: string;
  institution: string;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");

  // Backend-driven State
  const [stats, setStats] = useState({
    totalApplicants: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [applications, setApplications] = useState<Application[]>([]);

  // 🔐 Check login
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  // 🚀 Fetch data from API
  useEffect(() => {
    fetch("http://localhost/bursarySystem/api/get_admin_applications.php")
      .then((res) => res.json())
      .then((data) => {
        console.log("ADMIN API RESPONSE:", data);

        if (data.success) {
          setStats({
            totalApplicants: data.stats.total,
            approved: data.stats.approved,
            pending: data.stats.pending,
            rejected: data.stats.rejected,
          });

          setApplications(data.recent); // backend returns latest 10
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error("API ERROR:", err));
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const filteredApps = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.institution.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  if (!isLoggedIn) return null;

  return (
    <div className="admin-dashboard">
      <Header role="admin" onLogout={handleLogout} />

      <h1 className="dashboard-title">📊 Admin Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <Users />
          <div>
            <p>Total Applicants</p>
            <h2>{stats.totalApplicants}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <CheckCircle />
          <div>
            <p>Approved</p>
            <h2>{stats.approved}</h2>
          </div>
        </div>

        <div className="stat-card yellow">
          <FileText />
          <div>
            <p>Pending</p>
            <h2>{stats.pending}</h2>
          </div>
        </div>

        <div className="stat-card red">
          <XCircle />
          <div>
            <p>Rejected</p>
            <h2>{stats.rejected}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <section className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 />
            <h3>Applicants Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <PieChartIcon />
            <h3>Approval Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Applications */}
      <section className="recent-apps">
        <div className="table-header">
          <h2>Recent Applications</h2>
          <div className="search-box">
            <Search />
            <input
              type="text"
              placeholder="Search applicant or school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>School / Institution</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredApps.map((app, index) => (
              <tr key={index}>
                <td>{app.fullName}</td>
                <td>{app.institution}</td>
                <td className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </td>
                <td>{app.date}</td>
              </tr>
            ))}

            {filteredApps.length === 0 && (
              <tr>
                <td colSpan={4} className="no-results">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
