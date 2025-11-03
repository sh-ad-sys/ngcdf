"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      if (formData.identifier === "" || formData.password === "") {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/cd.jpg"
          alt="Bursary system illustration"
          fill
          priority
          className="object-cover w-full h-full"
        />
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Form positioned on the right-hand side */}
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
            <p className="text-sm  text-gray-500">
              Sign in to access your dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-la font-bold text-gray-700">
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
              <label className="block text-la font-bold text-gray-700">
                Password
              </label>
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

            {error && (
              <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm bg-green-100 p-2 rounded">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? "Authenticating..." : (<><LogIn size={18} /> Login</>)}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
