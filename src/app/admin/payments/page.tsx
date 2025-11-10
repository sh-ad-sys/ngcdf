"use client";

import React, { useState } from "react";
import { Search, Filter, Download, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import "../../../styles/adminpayments.css";

interface Beneficiary {
  id: number;
  admNo: string;
  studentName: string;
  school: string;
  course: string;
  yearOfStudy: string;
  amount: number;
  chequeNo: string;
  awardDate: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: 1,
      admNo: "ADM001",
      studentName: "John Doe",
      school: "University of Nairobi",
      course: "BSc Computer Science",
      yearOfStudy: "3rd Year",
      amount: 25000,
      chequeNo: "CHQ001245",
      awardDate: "2025-10-01",
    },
    {
      id: 2,
      admNo: "ADM002",
      studentName: "Jane Smith",
      school: "Kenyatta University",
      course: "BA Economics",
      yearOfStudy: "2nd Year",
      amount: 20000,
      chequeNo: "CHQ001246",
      awardDate: "2025-10-02",
    },
    {
      id: 3,
      admNo: "ADM003",
      studentName: "Samuel Kiptoo",
      school: "Moi University",
      course: "BEd Arts",
      yearOfStudy: "4th Year",
      amount: 18000,
      chequeNo: "CHQ001247",
      awardDate: "2025-10-03",
    },
  ]);

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.admNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(beneficiaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Qualified Students");
    XLSX.writeFile(workbook, "Bursary_Qualified_Students.xlsx");
  };

  const totalStudents = beneficiaries.length;
  const totalAmount = beneficiaries.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="payments-container">
      {/* Header */}
      <div className="payments-header">
        <h1>Qualified Bursary Beneficiaries</h1>
        <button className="add-btn" onClick={handleExportExcel}>
          <Download size={18} /> Export to Excel
        </button>
      </div>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, school, or adm no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card success">
          <Users size={26} />
          <div>
            <h3>Total Qualified Students</h3>
            <p>{totalStudents}</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="stat-card info">
          <CreditCard size={26} />
          <div>
            <h3>Total Amount Awarded (KSH)</h3>
            <p>{totalAmount.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>

      {/* Beneficiaries Table */}
      <div className="table-wrapper">
        <table className="payments-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Adm No</th>
              <th>Student Name</th>
              <th>School</th>
              <th>Course</th>
              <th>Year of Study</th>
              <th>Amount (KSH)</th>
              <th>Cheque No</th>
              <th>Date Awarded</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.admNo}</td>
                <td>{b.studentName}</td>
                <td>{b.school}</td>
                <td>{b.course}</td>
                <td>{b.yearOfStudy}</td>
                <td>{b.amount.toLocaleString()}</td>
                <td>{b.chequeNo}</td>
                <td>{b.awardDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBeneficiaries.length === 0 && (
          <p className="no-results">No matching records found.</p>
        )}
      </div>
    </div>
  );
}
