"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "../../../styles/adminDashboard.css";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  status: string;
  profileImage?: string;
}

const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    institution: "",
    course: "",
    status: "Active",
  });

  useEffect(() => {
    const sampleData: Student[] = [
      {
        id: 1,
        name: "Grace Njeri",
        email: "grace.njeri@example.com",
        phone: "0712345678",
        institution: "University of Nairobi",
        course: "Computer Science",
        status: "Active",
      },
      {
        id: 2,
        name: "Brian Otieno",
        email: "brian.otieno@example.com",
        phone: "0723456789",
        institution: "Kenyatta University",
        course: "Economics",
        status: "Suspended",
      },
      {
        id: 3,
        name: "Jane Mwikali",
        email: "jane.mwikali@example.com",
        phone: "0701122334",
        institution: "Egerton University",
        course: "Agriculture",
        status: "Active",
      },
    ];
    setStudents(sampleData);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      id: 0,
      name: "",
      email: "",
      phone: "",
      institution: "",
      course: "",
      status: "Active",
    });
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? formData : s))
      );
    } else {
      setStudents((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="admin-students-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <Users size={28} className="text-blue-600" />
          <h1>Manage Students</h1>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={openAddModal}>
            <UserPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Institution</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>
                    {student.profileImage ? (
                      <Image
                        src={student.profileImage}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="profile-photo"
                      />
                    ) : (
                      <div className="profile-placeholder">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.institution}</td>
                  <td>{student.course}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        student.status === "Active" ? "active" : "suspended"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(student)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-data">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
                <button onClick={() => setModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {(
  [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "institution", label: "Institution" },
    { key: "course", label: "Course" },
  ] as const
).map((field) => (
  <div className="form-group" key={field.key}>
    <label>{field.label}</label>
    <input
      type={field.key === "email" ? "email" : "text"}
      value={formData[field.key as keyof Student] || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          [field.key]: e.target.value,
        })
      }
    />
  </div>
))}


                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStudentsPage;
