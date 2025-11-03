"use client";

import React from "react";
import Image from "next/image";
import { Bell, MessageSquare, LogOut, User } from "lucide-react";
import "../styles/header.css";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  role?: "admin" | "student";
}

export default function Header({ userName, onLogout, role }: HeaderProps) {
  const roleLabel =
    role === "admin" ? "Admin" : role === "student" ? "Student" : "";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-logo-text">
          <Image
            src="/cdflogo.jpg" // ensure logo is in /public/images/
            alt="NGCDF Logo"
            width={100}
            height={100}
            className="header-logo"
          />
          <h2 className="header-title">
            Mbooni NG CDF Bursary Management System{" "}
            {roleLabel && <span className="role-label">({roleLabel})</span>}
          </h2>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>

        <button className="icon-btn" title="Messages">
          <MessageSquare size={20} />
        </button>

        <div className="user-info">
          <User size={20} className="user-icon" />
          <span className="user-name">{userName}</span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
