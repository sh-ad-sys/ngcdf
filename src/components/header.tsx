"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  MessageSquare,
  Bell,
  LogOut,
  X,
  Trash2,
  
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import "../styles/header.css";

interface HeaderProps {
  role?: "admin" | "student";
  onLogout?: () => void;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: number;
  category: string;
}

interface MessageItem {
  id: number;
  sender: string;
  message: string;
  created_at: string;
  is_read: number;
}

export default function Header({ role, onLogout }: HeaderProps) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [unreadMessages, setUnreadMessages] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(false);

  // ------------------------------
  // Load logged-in user
  // ------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.id);
      setIsLoggedIn(true);
    }
  }, []);

  // ------------------------------
  // Fetch Messages
  // ------------------------------
  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    const endpoint =
      role === "admin"
        ? "http://localhost/bursarySystem/api/messages/getAdminMessages.php"
        : "http://localhost/bursarySystem/api/messages/getStudentMessages.php";

    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await res.json();
    const list = (data.messages || []) as MessageItem[];

    setMessages(list);
    setUnreadMessages(list.some((m) => m.is_read === 0));
  }, [role, userId]);

  // ------------------------------
  // Fetch Notifications
  // ------------------------------
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

  const res = await fetch(
  "http://localhost/bursarySystem/api/notifications/getNotifications.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, user_id: userId }),
  }
);


    const data = await res.json();
    const list = (data.notifications || []) as NotificationItem[];

    setNotifications(list);
    setUnreadNotifications(list.some((n) => n.is_read === 0));
  }, [role, userId]);

  // ------------------------------
  // Auto-fetch every 10 seconds
  // ------------------------------
  useEffect(() => {
    if (!userId) return;

    fetchMessages();
    fetchNotifications();

    const interval = setInterval(() => {
      fetchMessages();
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [userId, fetchMessages, fetchNotifications]);


  // ------------------------------
  // Mark ALL notifications as read
  // ------------------------------
  const markAllNotificationsRead = async () => {
    await fetch(
      "http://localhost/bursarySystem/api/notifications/markAllRead.php",
      {
        method: "POST",
        body: JSON.stringify({ user_id: userId, role }),
      }
    );

    const updated = notifications.map((n) => ({ ...n, is_read: 1 }));
    setNotifications(updated);
    setUnreadNotifications(false);
  };

  // ------------------------------
  // Mark single notification read
  // ------------------------------
  const markNotificationRead = async (id: number) => {
    await fetch(
      "http://localhost/bursarySystem/api/notifications/markRead.php",
      {
        method: "POST",
        body: JSON.stringify({ id }),
      }
    );

    const updated = notifications.map((n) =>
      n.id === id ? { ...n, is_read: 1 } : n
    );
    setNotifications(updated);
    setUnreadNotifications(updated.some((n) => n.is_read === 0));
  };

  // ------------------------------
  // Clear all notifications
  // ------------------------------
  const clearNotifications = async () => {
    if (!confirm("Clear all notifications?")) return;

    await fetch(
      "http://localhost/bursarySystem/api/notifications/clearAll.php",
      {
        method: "POST",
        body: JSON.stringify({ user_id: userId, role }),
      }
    );

    setNotifications([]);
    setUnreadNotifications(false);
  };

  // ------------------------------
  // UI Handlers
  // ------------------------------
  const toggleNotifications = () => {
    const opening = !showNotifications;
    setShowNotifications(opening);
    setShowMessages(false);

    if (opening) markAllNotificationsRead();
  };

  const toggleMessages = () => {
    const opening = !showMessages;
    setShowMessages(opening);
    setShowNotifications(false);

    if (opening) {
      // mark messages read only when panel opens
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      onLogout?.();
      router.push("/");
    }
  };

  const roleLabel =
    role === "admin" ? "Admin" : role === "student" ? "Student" : "";

  return (
    <>
      {isLoggedIn && (
        <header className="dashboard-header">
          <div className="header-left">
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

          <div className="header-right">

            {/* 🔔 NOTIFICATIONS ICON */}
            <div className="relative">
              <button className="icon-btn" onClick={toggleNotifications}>
                <Bell size={20} />
                {unreadNotifications && <span className="red-dot"></span>}
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
                      <div className="actions">
                        <button onClick={clearNotifications}>
                          <Trash2 size={16} />
                        </button>
                        <button onClick={() => setShowNotifications(false)}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => markNotificationRead(note.id)}
                          className={`dropdown-item ${
                            note.is_read === 0 ? "unread-msg" : ""
                          }`}
                        >
                          <strong>{note.title}</strong>
                          <p>{note.message}</p>
                          <div className="msg-time">{note.created_at}</div>
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-empty">No notifications</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 💬 MESSAGE ICON — unchanged */}
            <div className="relative">
              <button className="icon-btn" onClick={toggleMessages}>
                <MessageSquare size={20} />
                {unreadMessages && <span className="red-dot"></span>}
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
                        <div
                          key={msg.id}
                          className={`dropdown-item ${
                            msg.is_read === 0 ? "unread-msg" : ""
                          }`}
                        >
                          <strong>{msg.sender}: </strong> {msg.message}
                          <div className="msg-time">{msg.created_at}</div>
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-empty">No messages</div>
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
      )}
    </>
  );
}
