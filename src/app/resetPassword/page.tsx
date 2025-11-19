"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match!");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost/bursarySystem/api/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Password has been reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Invalid or expired reset link.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
            <Lock size={28} />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter and confirm your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-2 rounded-lg text-white font-medium transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          {message && <p className="text-green-600 text-center font-medium mt-3">{message}</p>}
          {error && <p className="text-red-600 text-center font-medium mt-3">{error}</p>}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 text-sm hover:underline flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
