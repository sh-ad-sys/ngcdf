"use client";

import { useState } from "react";
import { Download, CheckCircle, Clock, XCircle } from "lucide-react";

export default function DisbursementPage() {
  const [disbursements] = useState([
    {
      id: 1,
      semester: "Semester 1 - 2025",
      institution: "Tech University",
      amount: 30000,
      status: "Paid",
      chequeNumber: "CHQ-23456",
      paymentDate: "2025-09-10",
    },
    {
      id: 2,
      semester: "Semester 2 - 2024",
      institution: "Tech University",
      amount: 25000,
      status: "Awaiting Cheque",
      chequeNumber: "Pending",
      paymentDate: "Pending",
    },
    {
      id: 3,
      semester: "Semester 1 - 2024",
      institution: "Tech University",
      amount: 28000,
      status: "Pending",
      chequeNumber: "Pending",
      paymentDate: "Pending",
    },
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Bursary Disbursement</h1>
        <p className="text-gray-600 mt-1">
          View bursary payment details and track disbursement progress for your institution.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-start">
          <CheckCircle className="text-green-500 mb-2" size={28} />
          <h3 className="font-semibold text-gray-700">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              disbursements
                .filter((d) => d.status === "Paid")
                .reduce((sum, d) => sum + d.amount, 0)
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-start">
          <Clock className="text-yellow-500 mb-2" size={28} />
          <h3 className="font-semibold text-gray-700">Awaiting Cheque</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {disbursements.filter((d) => d.status === "Awaiting Cheque").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-start">
          <XCircle className="text-blue-600 mb-2" size={28} />
          <h3 className="font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold text-blue-700">
            {disbursements.filter((d) => d.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* Disbursement Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Semester</th>
              <th className="px-4 py-3 text-left font-semibold">Institution</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Cheque No</th>
              <th className="px-4 py-3 text-left font-semibold">Payment Date</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {disbursements.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-4 py-3">{item.semester}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-4 py-3">
                  {item.status === "Paid" ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Paid
                    </span>
                  ) : item.status === "Awaiting Cheque" ? (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      Awaiting Cheque
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{item.chequeNumber}</td>
                <td className="px-4 py-3">{item.paymentDate}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={item.status !== "Paid"}
                    className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      item.status === "Paid"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Download size={16} />
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Section */}
      <div className="mt-6 text-sm text-gray-600">
        <p>
          <strong>Note:</strong> If your bursary is marked as “Awaiting Cheque,” kindly check with
          your institution’s finance office for collection updates.
        </p>
      </div>
    </div>
  );
}
