"use client";

import { useState } from "react";
import {
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Disbursement {
  id: number;
  studentName: string;
  institution: string;
  amount: number;
  chequeNumber: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  remarks?: string;
}

export default function DisbursementsPage() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([
    {
      id: 1,
      studentName: "Jane Mwikali",
      institution: "University of Nairobi",
      amount: 25000,
      chequeNumber: "CHQ-001245",
      status: "Approved",
      date: "2025-10-15",
      remarks: "Cheque sent to institution",
    },
    {
      id: 2,
      studentName: "David Kamau",
      institution: "Kenyatta University",
      amount: 18000,
      chequeNumber: "CHQ-001246",
      status: "Pending",
      date: "2025-10-17",
      remarks: "Awaiting verification",
    },
    {
      id: 3,
      studentName: "Faith Njeri",
      institution: "JKUAT",
      amount: 20000,
      chequeNumber: "CHQ-001247",
      status: "Rejected",
      date: "2025-10-18",
      remarks: "Duplicate application",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by student or institution
  const filteredDisbursements = disbursements.filter(
    (d) =>
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(disbursements);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Disbursements");
    XLSX.writeFile(wb, "Disbursement_Report.xlsx");
  };

  const handleAddDisbursement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDisbursement: Disbursement = {
      id: disbursements.length + 1,
      studentName: formData.get("studentName") as string,
      institution: formData.get("institution") as string,
      amount: Number(formData.get("amount")),
      chequeNumber: formData.get("chequeNumber") as string,
      remarks: formData.get("remarks") as string,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };
    setDisbursements((prev) => [...prev, newDisbursement]);
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" />
          Disbursement Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Add Disbursement
        </button>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student or institution..."
            className="pl-10 w-full border border-gray-200 rounded-md py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-green-700 font-medium border border-green-600 px-4 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
        >
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Student Name</th>
              <th className="py-3 px-4 text-left">Institution</th>
              <th className="py-3 px-4 text-left">Cheque No.</th>
              <th className="py-3 px-4 text-left">Amount (KSH)</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisbursements.map((d) => (
              <tr
                key={d.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-gray-800">
                  {d.studentName}
                </td>
                <td className="py-3 px-4 text-gray-700">{d.institution}</td>
                <td className="py-3 px-4 text-gray-700">{d.chequeNumber}</td>
                <td className="py-3 px-4 text-green-700 font-bold">
                  {d.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      d.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : d.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {d.status === "Approved" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {d.status === "Pending" && <Clock className="w-4 h-4" />}
                    {d.status === "Rejected" && <XCircle className="w-4 h-4" />}
                    {d.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{d.date}</td>
                <td className="py-3 px-4 text-gray-600 italic">{d.remarks}</td>
              </tr>
            ))}

            {filteredDisbursements.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No disbursement records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              New Disbursement Record
            </h2>

            <form onSubmit={handleAddDisbursement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  required
                  name="studentName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  required
                  name="institution"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  placeholder="Enter institution name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount (KSH)
                  </label>
                  <input
                    required
                    name="amount"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Number
                  </label>
                  <input
                    required
                    name="chequeNumber"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g., CHQ-001245"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  placeholder="Add any remarks..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
