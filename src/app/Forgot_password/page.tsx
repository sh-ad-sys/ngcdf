"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      return setError("Please enter your email address.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost/bursarySystem/api/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message || "No account found with that email.");
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
            <Mail size={28} />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Forgot Your Password?
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email address below to receive a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Sending...
              </span>
            ) : (
              "Send Reset Link"
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
