"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  
  FilePieChart,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer"; // ✅ Import Footer component
import "../../styles/adminDashboard.css";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Home", icon: Home, path: "/admin" },
  { name: "Applications", icon: FileText, path: "/admin/applications" },
  { name: "Students", icon: Users, path: "/admin/students" },
  { name: "Disbursements", icon: DollarSign, path: "/admin/disbursement" },
  { name: "Payments", icon: CreditCard, path: "/admin/payments" },
  { name: "Reports", icon: FilePieChart, path: "/admin/reports" },
  
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // ✅ Detect screen size for responsive sidebar
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout flex min-h-screen">
      {/* ----- Desktop Sidebar ----- */}
      {!isMobileView && (
        <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
          <div className="sidebar-header">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              title="Toggle Sidebar"
            >
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
        </aside>
      )}

      {/* ----- Main Content + Footer Wrapper ----- */}
      
<div
  className="flex flex-col flex-1 min-h-screen transition-all duration-300"
  style={{
    marginLeft: !isMobileView ? (isSidebarOpen ? "16rem" : "5rem") : "0",
  }}
>
  {/* ----- Mobile Navbar ----- */}
  {isMobileView && (
    <header className="top-navbar-mobile">
      <button onClick={() => setMobileMenuOpen(true)}>
        <Menu size={24} />
      </button>
      <div className="spacer" />
    </header>
  )}

  {/* ✅ Main Content + Footer combined */}
  <main className="grow overflow-y-auto px-6 pb-6 md:px-8 md:pb-8">
    {children}
  </main>

  {/* ✅ Footer now aligned properly */}
  <footer className="transition-all duration-300">
    <Footer />
  </footer>
</div>


      {/* ----- Mobile Sidebar (Slide-In) ----- */}
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
                  localStorage.removeItem("user");
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
