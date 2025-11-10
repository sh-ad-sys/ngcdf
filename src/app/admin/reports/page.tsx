"use client";

import React from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, TrendingUp, FileText } from "lucide-react";

// Annual disbursement data (fee only)
const disbursementData = [
  { year: "2021", amount: 2100000 },
  { year: "2022", amount: 2600000 },
  { year: "2023", amount: 3100000 },
  { year: "2024", amount: 3450000 },
  { year: "2025", amount: 3900000 },
];

// Table data for Excel and display
const reportTable = [
  { year: "2025", beneficiaries: 1030, amount: 3900000, status: "Ongoing" },
  { year: "2024", beneficiaries: 950, amount: 3450000, status: "Completed" },
  { year: "2023", beneficiaries: 890, amount: 3100000, status: "Completed" },
  { year: "2022", beneficiaries: 820, amount: 2600000, status: "Completed" },
];

export default function ReportsPage() {
  // Export function
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportTable);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursement Report");
    XLSX.writeFile(workbook, "Bursary_Disbursement_Report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Annual Bursary Disbursement (Fee Only)
        </h1>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          <Download size={18} />
          Export Report to Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Disbursed (2025)</CardTitle>
            <TrendingUp className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">
              Ksh 3,900,000
            </p>
            <p className="text-sm text-gray-500 mt-1">
              +15% from last academic year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Applicants (2025)</CardTitle>
            <FileText className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">1,245</p>
            <p className="text-sm text-gray-500 mt-1">
              +9% compared to last year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Approved Beneficiaries</CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">1,030</p>
            <p className="text-sm text-gray-500 mt-1">
              83% approval rate this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
  <Card className="shadow-md border border-gray-100">
  <CardHeader>
    <CardTitle>Annual Fee Disbursement Overview (by Year)</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="w-full h-[22rem] md:h-[26rem] lg:h-[30rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={disbursementData}
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `Ksh ${(value / 1000000).toFixed(1)}M`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value: number) => `Ksh ${value.toLocaleString()}`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="amount"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
            name="Total Disbursed (Ksh)"
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

 

      {/* Reports Table */}
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle>Annual Disbursement Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3 border-b">Academic Year</th>
                <th className="text-left px-4 py-3 border-b">
                  Total Beneficiaries
                </th>
                <th className="text-left px-4 py-3 border-b">Total Disbursed</th>
                <th className="text-left px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportTable.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{report.year}</td>
                  <td className="px-4 py-3 border-b">
                    {report.beneficiaries.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b font-medium">
                    Ksh {report.amount.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 border-b ${
                      report.status === "Completed"
                        ? "text-green-600 font-semibold"
                        : "text-blue-600 font-semibold"
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
