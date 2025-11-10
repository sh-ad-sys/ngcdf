"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/header.css";

interface HeaderProps {
  onLogout?: () => void;
  role?: "admin" | "student";
}

export default function Header({ onLogout, role }: HeaderProps) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true);

  // 🧩 Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // 🚫 Hide header completely if not logged in
  if (!isLoggedIn) return null;

  const roleLabel =
    role === "admin" ? "Admin" : role === "student" ? "Student" : "";

  const notifications = [
    { id: 1, text: "New bursary application received." },
    { id: 2, text: "Application approved successfully." },
    { id: 3, text: "Funds disbursed for Term 2." },
  ];

  const messages = [
    { id: 1, sender: "Bursary Officer", text: "Please upload your ID copy." },
    { id: 2, sender: "Admin", text: "Application review in progress." },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      onLogout?.();
      router.push("/"); // ✅ Redirect to login page
    }
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    if (!showNotifications) setHasUnreadNotifications(false);
  };

  const handleOpenMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    if (!showMessages) setHasUnreadMessages(false);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-logo-text">
          <Image
            src="/cdflogo.jpg"
            alt="NGCDF Logo"
            width={80}
            height={80}
            className="header-logo"
          />
          <h2 className="header-title">
            Mbooni NG-CDF Bursary Management System{" "}
            {roleLabel && <span className="role-label">({roleLabel})</span>}
          </h2>
        </div>
      </div>

      <div className="header-right">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="icon-btn"
            title="Notifications"
            onClick={handleOpenNotifications}
          >
            <Bell size={20} />
            {hasUnreadNotifications && <span className="red-dot"></span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="dropdown-panel"
              >
                <div className="dropdown-header">
                  Notifications
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="close-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <div key={note.id} className="dropdown-item">
                      {note.text}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No new notifications</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 💬 Messages */}
        <div className="relative">
          <button
            className="icon-btn"
            title="Messages"
            onClick={handleOpenMessages}
          >
            <MessageSquare size={20} />
            {hasUnreadMessages && <span className="red-dot"></span>}
          </button>

          <AnimatePresence>
            {showMessages && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="dropdown-panel"
              >
                <div className="dropdown-header">
                  Messages
                  <button
                    onClick={() => setShowMessages(false)}
                    className="close-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className="dropdown-item">
                      <strong>{msg.sender}: </strong> {msg.text}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No new messages</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🚪 Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
