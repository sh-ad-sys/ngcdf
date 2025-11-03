"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Download, FileText, TrendingUp } from "lucide-react";

const disbursementData = [
  { month: "Jan", amount: 300000 },
  { month: "Feb", amount: 450000 },
  { month: "Mar", amount: 500000 },
  { month: "Apr", amount: 400000 },
  { month: "May", amount: 600000 },
  { month: "Jun", amount: 700000 },
];

const categoryData = [
  { name: "Tuition Fees", value: 40 },
  { name: "Books & Materials", value: 25 },
  { name: "Accommodation", value: 20 },
  { name: "Transport", value: 10 },
  { name: "Others", value: 5 },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Disbursed</CardTitle>
            <TrendingUp className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">Ksh 3,450,000</p>
            <p className="text-sm text-gray-500 mt-1">+12% from last period</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Pending Applications</CardTitle>
            <FileText className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">124</p>
            <p className="text-sm text-gray-500 mt-1">-8% compared to last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Approved Students</CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">1,089</p>
            <p className="text-sm text-gray-500 mt-1">+5% this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle>Monthly Disbursement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disbursementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle>Fund Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(props) => {
                      const { name, value } = props as { name?: string; value?: number };
                      return `${name ?? ""} ${(value ?? 0)}%`;
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle>Recent Disbursement Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3 border-b">Date</th>
                <th className="text-left px-4 py-3 border-b">Category</th>
                <th className="text-left px-4 py-3 border-b">Amount</th>
                <th className="text-left px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "2025-09-01", category: "Tuition Fees", amount: "Ksh 250,000", status: "Completed" },
                { date: "2025-09-10", category: "Accommodation", amount: "Ksh 120,000", status: "Pending" },
                { date: "2025-09-18", category: "Books & Materials", amount: "Ksh 75,000", status: "Completed" },
                { date: "2025-09-25", category: "Transport", amount: "Ksh 30,000", status: "Completed" },
              ].map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{report.date}</td>
                  <td className="px-4 py-3 border-b">{report.category}</td>
                  <td className="px-4 py-3 border-b font-medium">{report.amount}</td>
                  <td
                    className={`px-4 py-3 border-b ${
                      report.status === "Completed"
                        ? "text-green-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }`}
                  >
                    {report.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
