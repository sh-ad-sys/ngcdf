"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import "../../styles/auth.css";

interface RegisterFormData {
  fullName: string;
  gender: string;
  emailOrAdmNo: string;
  phone: string;
  subCounty: string;
  ward: string;
  subWard: string;
  village: string;
  password: string;
  confirmPassword: string;
}

const backgroundImages = [
  "/register.jpg",
  "/makueni2.jpg",
  "/makueni3.jpg",
  "/makueni4.jpg",
  "/makueni5.jpg",
];

const subCountyWards: Record<string, string[]> = {
  "Mbooni West": ["Kikima", "Tulimani", "Kiteta", "Kalawani", "Kithungo/Kitundu"],
  "Mbooni East": ["Mutitu", "Waia/Kako", "Kathonzweni", "Itetani", "Kiima Kiu/Kalanzoni"],
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    gender: "",
    emailOrAdmNo: "",
    phone: "",
    subCounty: "",
    ward: "",
    subWard: "",
    village: "",
    password: "",
    confirmPassword: "",
  });

  const [filteredWards, setFilteredWards] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (formData.subCounty) {
      setFilteredWards(subCountyWards[formData.subCounty]);
      setFormData((prev) => ({ ...prev, ward: "" }));
    }
  }, [formData.subCounty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim())
      return setError("Please enter your full name.");
    if (!formData.gender) return setError("Please select your gender.");
    if (!formData.emailOrAdmNo.trim())
      return setError("Please enter your Email or Admission Number.");
    if (!isEmail(formData.emailOrAdmNo)) {
      if (!/^[A-Za-z0-9\-\/]+$/.test(formData.emailOrAdmNo))
        return setError("Enter a valid admission number or email.");
    }
    if (!formData.phone.match(/^07\d{8}$/))
      return setError("Enter a valid Kenyan phone number (e.g. 07XXXXXXXX).");
    if (!formData.subCounty) return setError("Please select your sub county.");
    if (!formData.ward) return setError("Please select your ward.");
    if (!formData.subWard.trim()) return setError("Please enter your sub ward.");
    if (!formData.village.trim()) return setError("Please enter your village.");
    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters long.");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match.");

    setSuccess("Registration successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <div className="register-page">
      {/* ✅ LEFT IMAGE SLIDER */}
      <div className="register-left">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`bg-slide ${index === currentImage ? "active" : ""}`}
          >
            <Image
              src={image}
              alt="Background slide"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="overlay">
          <h1>Mbooni NG CDF BM System</h1>
          <p>Tujenge Mbooni Pamoja</p>
        </div>
      </div>

      {/* ✅ RIGHT FORM SECTION */}
      <div className="register-right">
        <div className="auth-card slide-in">
          {/* ✅ Logo Section */}
          <div className="auth-logo">
            <Image
              src="/cdflogo.jpg"
              alt="CDF Logo"
              width={100}
              height={100}
              className="auth-logo-img"
              priority
            />
          </div>

          <h2 className="auth-title">Mbooni NG CDF BM System</h2>
          <p className="auth-subtitle">
            Register to apply for bursary and track your application status
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label>Full Names</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email or Admission Number */}
            <div className="form-group">
              <label>Email Address / Admission Number</label>
              <input
                type="text"
                name="emailOrAdmNo"
                value={formData.emailOrAdmNo}
                onChange={handleChange}
                placeholder="Enter your email or admission number"
                required
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="07XXXXXXXX"
                required
              />
            </div>

            {/* Sub County */}
            <div className="form-group">
              <label>Sub County</label>
              <select
                name="subCounty"
                value={formData.subCounty}
                onChange={handleChange}
                required
              >
                <option value="">Select Sub County</option>
                {Object.keys(subCountyWards).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div className="form-group">
              <label>Home Ward</label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                required
                disabled={!formData.subCounty}
              >
                <option value="">Select Ward</option>
                {filteredWards.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Ward */}
            <div className="form-group">
              <label>Sub Ward</label>
              <input
                type="text"
                name="subWard"
                value={formData.subWard}
                onChange={handleChange}
                placeholder="Enter your sub ward"
                required
              />
            </div>

            {/* Village */}
            <div className="form-group">
              <label>Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter your village"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group password-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="form-group password-group">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Alerts */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Submit */}
            <button type="submit" className="auth-btn">
              <UserPlus size={20} /> Register
            </button>
          </form>

          {/* ✅ Fixed footer (no nested <p>) */}
          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
