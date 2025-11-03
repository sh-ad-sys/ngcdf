"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  DollarSign,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import "../../styles/adminDashboard.css";

interface StudentLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Home", icon: Home, path: "/student" },
  { name: "My Applications", icon: FileText, path: "/student/application" },
  { name: "Disbursements", icon: DollarSign, path: "/student/disbursement" },
  { name: "Notifications", icon: Bell, path: "/student/notifications" },
  { name: "Settings", icon: Settings, path: "/student/settings" },
];

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="student-layout flex min-h-screen">
      {/* ----- Desktop Sidebar ----- */}
      {!isMobileView && (
        <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
          <div className="sidebar-header">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={22} />
            </button>
          </div>

          <nav className="sidebar-nav scrollable">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link key={item.name} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={isActive ? "active nav-item" : "nav-item"}
                  >
                    <Icon size={20} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <button
              onClick={() => {
                localStorage.removeItem("student");
                window.location.href = "/login";
              }}
              className="logout-btn"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>
      )}

      {/* ----- Main Content Area ----- */}
      <div
        className="main-container flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: !isMobileView ? (isSidebarOpen ? "16rem" : "5rem") : "0",
        }}
      >
        {isMobileView && (
          <header className="top-navbar-mobile">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </header>
        )}

        <div className="flex flex-col grow transition-all duration-300">
          <main className="main-content grow overflow-y-auto px-6 pb-6 md:px-8 md:pb-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>

      {/* ----- Mobile Sidebar ----- */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobileView && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="sidebar-mobile"
          >
            <div className="sidebar-header">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={isActive ? "active nav-item" : "nav-item"}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <button
                onClick={() => {
                  localStorage.removeItem("student");
                  window.location.href = "/login";
                }}
                className="logout-btn"
              >
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
