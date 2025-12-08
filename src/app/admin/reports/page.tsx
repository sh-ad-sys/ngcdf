"use client";

import React, { useEffect, useState } from "react";
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

interface ReportRow {
  academic_year: string;
  beneficiaries: number;
  amount: number;
  status: string;
}

interface DashboardStats {
  total_disbursed_2025: number;
  applicants_2025: number;
  approved_beneficiaries: number;
}

export default function ReportsPage() {
  const [chartData, setChartData] = useState([]);
  const [reportTable, setReportTable] = useState<ReportRow[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch backend report data
  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetch("http://localhost/BursarySystem/api/report.php");
        const data = await res.json();

        setChartData(data.chartData);
        setReportTable(data.reportTable);
        setStats(data.stats);
      } catch (error) {
        console.error("Error loading report:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportTable);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursement Report");
    XLSX.writeFile(workbook, "Bursary_Disbursement_Report.xlsx");
  };

  if (loading) return <p className="p-6 text-gray-600">Loading reports...</p>;

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
              Ksh {stats?.total_disbursed_2025.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Based on database records
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Applicants (2025)</CardTitle>
            <FileText className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">
              {stats?.applicants_2025.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total submissions</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Approved Beneficiaries</CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">
              {stats?.approved_beneficiaries.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Verified and approved
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
          <div className="w-full h-88 md:h-104 lg:h-120">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
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
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle>Annual Disbursement Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3 border-b">Academic Year</th>
                <th className="text-left px-4 py-3 border-b">Total Beneficiaries</th>
                <th className="text-left px-4 py-3 border-b">Total Disbursed</th>
                <th className="text-left px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{row.academic_year}</td>
                  <td className="px-4 py-3 border-b">{row.beneficiaries.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b font-medium">
                    Ksh {row.amount.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 border-b ${
                      row.status === "Completed"
                        ? "text-green-600 font-semibold"
                        : "text-blue-600 font-semibold"
                    }`}
                  >
                    {row.status}
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
