"use client";

import {
  User,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentDashboard() {
  // Static data for display
  const student = {
    name: "Jane Mwikali",
    institution: "University of Nairobi",
    admissionNo: "UON/2022/CS/1023",
    course: "Computer Science",
  };

  const bursaryStatus = {
    status: "Approved",
    amount: 25000,
    date: "2025-10-15",
    note: "Bursaries are awarded once per academic year based on eligibility and application review.",
  };

  const recentDisbursements = [
    {
      id: 1,
      institution: "University of Nairobi",
      amount: 25000,
      date: "2025-10-15",
      status: "Approved",
    },
  ];

  const bursaryTrend = [
    { year: "2022", amount: 20000 },
    { year: "2023", amount: 25000 },
    { year: "2024", amount: 0 },
    { year: "2025", amount: 25000 },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {student.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-600">
            Track your bursary disbursements and academic details for this academic year.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4 md:mt-0">
          <Download className="w-4 h-4" />
          Download Summary
        </button>
      </div>

      {/* Profile Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Institution</h3>
            <p className="font-semibold text-gray-800">{student.institution}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FileText className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Admission No</h3>
            <p className="font-semibold text-gray-800">{student.admissionNo}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Course</h3>
            <p className="font-semibold text-gray-800">{student.course}</p>
          </div>
        </div>
      </div>

      {/* Bursary Application Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Bursary Application Status
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {bursaryStatus.status === "Approved" ? (
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            ) : bursaryStatus.status === "Pending" ? (
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            ) : (
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            )}
            <div>
              <p className="text-gray-600">Current Status</p>
              <h3
                className={`text-lg font-semibold ${
                  bursaryStatus.status === "Approved"
                    ? "text-green-600"
                    : bursaryStatus.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {bursaryStatus.status}
              </h3>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Amount Awarded</p>
            <h3 className="text-lg font-semibold text-blue-600">
              KSH {bursaryStatus.amount.toLocaleString()}
            </h3>
          </div>

          <div>
            <p className="text-gray-600">Date Approved</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {bursaryStatus.date}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-gray-500 text-sm italic">
          {bursaryStatus.note}
        </p>
      </div>

      {/* Bursary Trend (Once per Year) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Bursary Awards per Academic Year
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bursaryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Disbursements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Latest Disbursement
          </h2>
          <button className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
            View History <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4">Institution</th>
                <th className="text-left py-3 px-4">Amount (KSH)</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDisbursements.map((d) => (
                <tr
                  key={d.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{d.institution}</td>
                  <td className="py-3 px-4 font-medium text-blue-700">
                    {d.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{d.date}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 transition">
          <FileText className="w-5 h-5" />
          Apply for Bursary
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 transition">
          <CheckCircle className="w-5 h-5" />
          View Application Status
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 transition">
          <CreditCard className="w-5 h-5" />
          View Disbursement History
        </button>
      </div>
    </div>
  );
}
