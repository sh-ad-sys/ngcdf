"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "../../../styles/applications.css";

interface Application {
  id: number;
  name: string;
  applicantId: string;
  course: string;
  institution: string;
  amountRequested: number;
  status: "Pending" | "Approved" | "Rejected";
  dateApplied: string;
  profilePic?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Simulated data fetch
  useEffect(() => {
    setApplications([
      {
        id: 1,
        name: "Jane Muthoni",
        applicantId: "CDF2025-001",
        course: "Bachelor of Education",
        institution: "University of Nairobi",
        amountRequested: 25000,
        status: "Pending",
        dateApplied: "2025-09-15",
        profilePic: "/images/student1.jpg",
      },
      {
        id: 2,
        name: "John Mwangi",
        applicantId: "CDF2025-002",
        course: "Diploma in Business Management",
        institution: "Kenyatta University",
        amountRequested: 18000,
        status: "Approved",
        dateApplied: "2025-09-10",
        profilePic: "/images/student2.jpg",
      },
      {
        id: 3,
        name: "Faith Njeri",
        applicantId: "CDF2025-003",
        course: "BSc Computer Science",
        institution: "Jomo Kenyatta University",
        amountRequested: 30000,
        status: "Rejected",
        dateApplied: "2025-09-11",
        profilePic: "/images/student3.jpg",
      },
    ]);
  }, []);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle Approve / Reject
  const handleStatusChange = (id: number, newStatus: "Approved" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="applications-container">
      {/* Header */}
      <div className="applications-header">
        <h1>Applications</h1>
        <p>Manage and review all bursary applications.</p>
      </div>

      {/* Controls */}
      <div className="applications-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Applicant ID</th>
              <th>Course</th>
              <th>Institution</th>
              <th>Amount (Ksh)</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td className="applicant-info">
                  <div className="profile-pic">
                    <Image
                      src={app.profilePic || "/images/default-avatar.png"}
                      alt={app.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span>{app.name}</span>
                </td>
                <td>{app.applicantId}</td>
                <td>{app.course}</td>
                <td>{app.institution}</td>
                <td>{app.amountRequested.toLocaleString()}</td>
                <td>
                  <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>{app.dateApplied}</td>
                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedApplication(app)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {app.status === "Pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(app.id, "Approved")}
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(app.id, "Rejected")}
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2>Application Details</h2>
              <div className="modal-body">
                <Image
                  src={selectedApplication.profilePic || "/images/default-avatar.png"}
                  alt={selectedApplication.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
                <h3>{selectedApplication.name}</h3>
                <p><strong>ID:</strong> {selectedApplication.applicantId}</p>
                <p><strong>Course:</strong> {selectedApplication.course}</p>
                <p><strong>Institution:</strong> {selectedApplication.institution}</p>
                <p><strong>Amount Requested:</strong> Ksh {selectedApplication.amountRequested.toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedApplication.status}</p>
                <p><strong>Date Applied:</strong> {selectedApplication.dateApplied}</p>
              </div>
              <div className="modal-actions">
                <button onClick={() => setSelectedApplication(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
