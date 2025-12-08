"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LoginFormData {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost/bursarySystem/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password.trim(),
        }),
      });

      const text = await response.text();
      console.log("Raw PHP response:", text);

      // ⭐ SAFE JSON PARSER
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return setError("Invalid server response.");
      }

      if (data.success) {
        setSuccess(data.message);

        // Save user info
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");

        // Normalize ID
        const userId = data.user.id || data.user.user_id;

        // Save student ID
        if (data.user.role === "student") {
          localStorage.setItem("student_id", userId);
        }

        // Save admin ID
        if (data.user.role === "admin") {
          localStorage.setItem("admin_id", userId);
        }

        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/student";
          }
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/cd.jpg"
          alt="Bursary system illustration"
          fill
          priority
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Success / Error Modal */}
      {(success || error) && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div
            className={`bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-sm border-t-4 ${
              success ? "border-green-500" : "border-red-500"
            }`}
          >
            {success && (
              <>
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Success</h2>
                <p className="text-gray-600 mt-2">{success}</p>
              </>
            )}
            {error && (
              <>
                <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Failed</h2>
                <p className="text-gray-600 mt-2">{error}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="relative z-10 flex justify-end items-center h-full">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-l-2xl shadow-2xl w-full max-w-md mr-12">
          <div className="text-center mb-6">
            <Image
              src="/cdflogo.jpg"
              alt="CDF Logo"
              width={100}
              height={100}
              className="mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-blue-800">
              Automated CDF Bursary System
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to access your dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Email / Admission Number
              </label>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your email or admission number"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot_password"
                  className="text-xs text-blue-600 underline hover:text-blue-800 transition-all"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? "Authenticating..." : (
                <>
                  <LogIn size={18} /> Login
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
