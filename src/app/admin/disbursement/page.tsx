"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";


interface Disbursement {
  id: number;
  application_id: number;
  chequeNumber: string;
  amount: number;
  paymentDate: string;
  institution: string;
  status: string;
}

export default function AdminDisbursementsPage() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [filtered, setFiltered] = useState<Disbursement[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost/bursarySystem/api/disbursement.php");
        const data = await res.json();

        if (data.success) {
          setDisbursements(data.data);
          setFiltered(data.data);
        }
      } catch {
        console.log("Error loading disbursements");
      }
    }

    loadData();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    let results = disbursements;

    if (search.trim() !== "") {
      results = results.filter((item) =>
        item.institution.toLowerCase().includes(search.toLowerCase()) ||
        item.chequeNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      results = results.filter((item) => item.status === statusFilter);
    }

    setFiltered(results);
  }, [search, statusFilter, disbursements]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Disbursements</h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Input
              placeholder="Search by institution or cheque..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="p-4 bg-linear-to-r from-slate-50 to-white rounded-lg shadow-sm border flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Total Disbursements</span>
          <span className="text-2xl font-bold mt-1">{disbursements.length}</span>
        </div>

        {/* Total Amount */}
        <div className="p-4 bg-linear-to-r from-slate-50 to-white rounded-lg shadow-sm border flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Total Amount</span>
          <span className="text-xl font-bold mt-1 text-green-600">
            KES {disbursements.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </span>
        </div>

        {/* Completed */}
        <div className="p-4 bg-linear-to-r from-slate-50 to-white rounded-lg shadow-sm border flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Completed</span>
          <span className="text-xl font-bold mt-1">
            {disbursements.filter((d) => d.status === "Completed").length}
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 bg-linear-to-r from-slate-50 to-white rounded-lg shadow-sm border flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Pending</span>
          <span className="text-xl font-bold mt-1">
            {disbursements.filter((d) => d.status === "Pending").length}
          </span>
        </div>

        {/* Approved */}
        <div className="p-4 bg-linear-to-r from-slate-50 to-white rounded-lg shadow-sm border flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Approved</span>
          <span className="text-xl font-bold mt-1">
            {disbursements.filter((d) => d.status === "Approved").length}
          </span>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl shadow-lg border overflow-x-auto"
      >
        <table className="min-w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left">Cheque</th>
              <th className="py-3 px-4 text-left">Institution</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Payment Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{item.chequeNumber}</td>
                <td className="py-3 px-4">{item.institution}</td>
                <td className="py-3 px-4 text-green-600 font-semibold">
                  KES {item.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">{item.paymentDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "Approved"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Button size="sm" className="rounded-lg">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No disbursement records found
          </div>
        )}
      </motion.div>
    </div>
  );
}
