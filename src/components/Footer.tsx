"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import "../styles/footer.css";

interface FooterProps {
  role?: "admin" | "student";
}

export default function Footer({ role }: FooterProps) {
  const year = new Date().getFullYear();
  const portalName = role === "admin" ? "NGCDF Admin Portal" : role === "student" ? "NGCDF Student Portal" : "NGCDF Portal";

  return (
    <footer>
      {/* --- Top Section --- */}
      <div className="footer-top">
        {/* About Section */}
        <div className="footer-section">
          <h4>About NGCDF</h4>
          <p>
            The National Government Constituencies Development Fund (NGCDF) promotes community-driven
            development through equitable resource distribution and transparency across Kenya.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            {role === "admin" && <li><Link href="/admin/dashboard">Admin Dashboard</Link></li>}
            {role === "student" && <li><Link href="/student/dashboard">Student Dashboard</Link></li>}
            <li><Link href="/support">Support</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li><Mail size={16} /> shadrackmutune9@gmail.com</li>
            <li><Phone size={16} /> +254 710292540</li>
            <li><MapPin size={16} /> Nairobi, Kenya</li>
          </ul>

          {/* Social Icons */}
          <div className="footer-social">
            <Link href="#"><Facebook size={18} /></Link>
            <Link href="#"><Twitter size={18} /></Link>
            <Link href="#"><Instagram size={18} /></Link>
          </div>
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="footer-bottom">
        <p>
          © {year} {portalName}. All Rights Reserved. | Developed by{" "}
          <Link href="https://DevS Solutions" target="_blank">
            DevS Solutions
          </Link>
        </p>
      </div>
    </footer>
  );
}
