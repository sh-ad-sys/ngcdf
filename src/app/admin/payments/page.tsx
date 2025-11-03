"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import "../../../styles/adminpayments.css";

interface Payment {
  id: number;
  studentName: string;
  amount: number;
  method: string;
  date: string;
  status: "Paid" | "Pending" | "Failed";
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, studentName: "John Doe", amount: 5000, method: "M-Pesa", date: "2025-10-18", status: "Paid" },
    { id: 2, studentName: "Jane Smith", amount: 4500, method: "Bank Transfer", date: "2025-10-19", status: "Pending" },
    { id: 3, studentName: "Samuel Kiptoo", amount: 3000, method: "Cash", date: "2025-10-20", status: "Failed" },
  ]);

  const [newPayment, setNewPayment] = useState({
    studentName: "",
    amount: "",
    method: "",
    date: "",
    status: "Pending",
  });

  const handleAddPayment = () => {
    if (!newPayment.studentName || !newPayment.amount || !newPayment.method) return;
    setPayments([
      ...payments,
      {
        id: payments.length + 1,
        studentName: newPayment.studentName,
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        date: newPayment.date || new Date().toISOString().split("T")[0],
        status: newPayment.status as "Paid" | "Pending" | "Failed",
      },
    ]);
    setShowModal(false);
    setNewPayment({ studentName: "", amount: "", method: "", date: "", status: "Pending" });
  };

  const filteredPayments = payments.filter((p) =>
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payments-container">
      {/* ----- Header Section ----- */}
      <div className="payments-header">
        <h1>Payments Management</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Payment
        </button>
      </div>

      {/* ----- Search & Filter Bar ----- */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* ----- Stats Cards ----- */}
      <div className="stats-grid">
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card success">
          <CheckCircle size={26} />
          <div>
            <h3>Paid</h3>
            <p>{payments.filter((p) => p.status === "Paid").length}</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="stat-card warning">
          <Clock size={26} />
          <div>
            <h3>Pending</h3>
            <p>{payments.filter((p) => p.status === "Pending").length}</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="stat-card danger">
          <XCircle size={26} />
          <div>
            <h3>Failed</h3>
            <p>{payments.filter((p) => p.status === "Failed").length}</p>
          </div>
        </motion.div>
      </div>

      {/* ----- Payments Table ----- */}
      <div className="table-wrapper">
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Amount (KSH)</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.studentName}</td>
                <td>{payment.amount.toLocaleString()}</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={`status-badge ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <p className="no-results">No payments found matching your search.</p>
        )}
      </div>

      {/* ----- Add Payment Modal ----- */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>Add New Payment</h2>
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={newPayment.studentName}
                onChange={(e) => setNewPayment({ ...newPayment, studentName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Amount (KSH)</label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <input
                type="text"
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleAddPayment}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
