"use client";

import React, { useState } from "react";
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
import "../../styles/adminDashboard.css";

interface Application {
  name: string;
  school: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

export default function AdminDashboard() {
  const [search, setSearch] = useState("");

  const [stats] = useState({
    totalApplicants: 210,
    approved: 120,
    pending: 60,
    rejected: 30,
  });

  const [applications] = useState<Application[]>([
    { name: "Jane Mwende", school: "Mbooni Girls High", status: "Approved", date: "2025-10-16" },
    { name: "Peter Mutua", school: "Kiteta Boys", status: "Pending", date: "2025-10-17" },
    { name: "John Kyalo", school: "Tulimani Secondary", status: "Rejected", date: "2025-10-15" },
    { name: "Mary Nduku", school: "Mbooni East Tech", status: "Approved", date: "2025-10-14" },
  ]);

  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.school.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="admin-dashboard" title-bold>
      <h1 className="dashboard-title">📊 Admin Dashboard Overview</h1>

      {/* === Stats Cards === */}
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

      {/* === Charts === */}
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* === Recent Applications Table === */}
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
                <td>{app.name}</td>
                <td>{app.school}</td>
                <td className={`status ${app.status.toLowerCase()}`}>{app.status}</td>
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
