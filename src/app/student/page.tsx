"use client";

import { useEffect, useState } from "react";

// =========================
// Type Definitions
// =========================
export interface Student {
  id: string;
  fullName: string;
  admissionNo: string;
  institution: string;
  academicLevel: string;
}

export interface BursaryStatus {
  status: string;
  amountApproved?: string | number;
  remarks?: string;
}

export interface Disbursement {
  id: string;
  amount: string;
  date: string;
}

export interface TrendPoint {
  month: string;
  total: number;
}

export interface DashboardResponse {
  success: boolean;
  message?: string;
  student?: Student | null;
  bursaryStatus?: BursaryStatus | null;
  disbursements?: Disbursement[];
  bursaryTrend?: TrendPoint[];
}

// =========================
// Component
// =========================
export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [bursaryStatus, setBursaryStatus] = useState<BursaryStatus | null>(null);
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [bursaryTrend, setBursaryTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // ⬇️ *** The line you requested added here ***
  const studentId = typeof window !== "undefined"
    ? localStorage.getItem("student_id")
    : null;

  useEffect(() => {
    if (!studentId) {
      console.error("⚠️ No student ID found in localStorage.");
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        const res = await fetch(
          `http://localhost/bursarySystem/api/studentDashboard.php?student_id=${studentId}`
        );

        const text = await res.text();
        let data: DashboardResponse;

        try {
          data = JSON.parse(text) as DashboardResponse;
        } catch {
          console.error("❌ Invalid JSON from API:", text);
          setLoading(false);
          return;
        }

        if (data.success) {
          setStudent(data.student ?? null);
          setBursaryStatus(data.bursaryStatus ?? null);
          setDisbursements(data.disbursements ?? []);
          setBursaryTrend(data.bursaryTrend ?? []);
        } else {
          console.error("❌ API Error:", data.message ?? "Unknown error");
        }
      } catch (error) {
        console.error("❌ Failed to load dashboard.", error);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [studentId]);

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg font-medium">
        Loading dashboard...
      </p>
    );
  }

  if (!student || !bursaryStatus) {
    return (
      <p className="text-center text-red-600 text-lg font-semibold">
        ⚠️ Could not load student dashboard. Try again.
      </p>
    );
  }

  // ===============================
  // Render Dashboard
  // ===============================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome, {student.fullName}
      </h1>

      {/* Bursary Status */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-2">Bursary Status</h2>
        <p className="text-gray-700">Status: {bursaryStatus.status}</p>
        {bursaryStatus.amountApproved && (
          <p className="text-gray-700">
            Amount Approved: KES {bursaryStatus.amountApproved}
          </p>
        )}
        {bursaryStatus.remarks && (
          <p className="text-gray-600 italic">
            Remarks: {bursaryStatus.remarks}
          </p>
        )}
      </div>

      {/* Disbursements */}
      <div className="mt-6 p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Disbursements</h2>
        {disbursements.length === 0 ? (
          <p className="text-gray-600">No disbursements yet</p>
        ) : (
          <ul className="space-y-2">
            {disbursements.map((d) => (
              <li
                key={d.id}
                className="p-3 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between text-gray-700">
                  <span>{d.date}</span>
                  <span>KES {d.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trend */}
      <div className="mt-6 p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Bursary Trend</h2>
        {bursaryTrend.length === 0 ? (
          <p className="text-gray-600">No trend data available</p>
        ) : (
          <ul className="space-y-1">
            {bursaryTrend.map((t, idx) => (
              <li key={idx}>
                {t.month}: {t.total}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
