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

export interface AdminSettings {
  theme: string; // "light" | "dark"
  language: string; // "english" | "kiswahili"
  notifications: number; // 1 or 0
  auto_backup: number;
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

  const [settings, setSettings] = useState<AdminSettings | null>(null);

  // ===========================================
  // LOAD STUDENT DASHBOARD
  // ===========================================
  useEffect(() => {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) {
      console.error("No student ID in localStorage.");
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        const res = await fetch(
          `http://localhost/bursarySystem/api/studentDashboard.php?student_id=${studentId}`
        );

        const raw = await res.text();

        let data: DashboardResponse | null = null;

        try {
          data = JSON.parse(raw);
        } catch {
          console.error("Invalid JSON returned:", raw);
          return;
        }

        if (data?.success) {
          setStudent(data.student ?? null);
          setBursaryStatus(data.bursaryStatus ?? null);
          setDisbursements(data.disbursements ?? []);
          setBursaryTrend(data.bursaryTrend ?? []);
        } else {
          console.error("API error:", data?.message);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  // ===========================================
  // LOAD ADMIN SETTINGS (THEME, LANGUAGE etc.)
  // ===========================================
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(
          "http://localhost/bursarySystem/api/settings/getSettings.php"
        );
        const json = await res.json();

        if (json.success) {
          setSettings(json.settings);
        }
      } catch (error) {
        console.error("Failed to load admin settings:", error);
      }
    }

    loadSettings();
  }, []);

  // ===========================================
  // APPLY THEME TO PAGE
  // ===========================================
  useEffect(() => {
    if (!settings) return;

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(settings.theme);
  }, [settings]);

  // ===========================================
  // Loading Screen
  // ===========================================
  if (loading && !student) {
    return (
      <>
        <p className="text-center text-gray-600 text-lg font-medium">
          Loading dashboard...
        </p>
      </>
    );
  }

  if (!student || !bursaryStatus) {
    return (
      <p className="text-center text-red-600 text-lg font-semibold">
        Could not load student dashboard. Try again.
      </p>
    );
  }

  // Translate titles if admin selected "kiswahili"
  const isSwahili = settings?.language === "kiswahili";

  const texts = {
    welcome: isSwahili ? "Karibu" : "Welcome",
    bursaryStatusTitle: isSwahili ? "Hali ya Bursary" : "Bursary Status",
    disbursementsTitle: isSwahili ? "Malipo" : "Disbursements",
    bursaryTrendTitle: isSwahili ? "Mwelekeo wa Bursary" : "Bursary Trend",
    noDisbursements: isSwahili ? "Hakuna malipo bado" : "No disbursements yet",
    noTrend: isSwahili ? "Hakuna data za mwenendo" : "No trend data available",
  };

  // ===========================================
  // Render Student Dashboard
  // ===========================================
  return (
    <div className="p-6 max-w-4xl mx-auto transition-all duration-500">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {texts.welcome}, {student.fullName}
      </h1>

      {/* Bursary Status */}
      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
        <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
          {texts.bursaryStatusTitle}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Status: {bursaryStatus.status}
        </p>
        {bursaryStatus.amountApproved && (
          <p className="text-gray-700 dark:text-gray-300">
            Amount Approved: KES {bursaryStatus.amountApproved}
          </p>
        )}
        {bursaryStatus.remarks && (
          <p className="text-gray-600 italic dark:text-gray-400">
            Remarks: {bursaryStatus.remarks}
          </p>
        )}
      </div>

      {/* Disbursements */}
      <div className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
        <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">
          {texts.disbursementsTitle}
        </h2>

        {disbursements.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            {texts.noDisbursements}
          </p>
        ) : (
          <ul className="space-y-2">
            {disbursements.map((d) => (
              <li
                key={d.id}
                className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
              >
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>{d.date}</span>
                  <span>KES {d.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trend */}
      <div className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
        <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">
          {texts.bursaryTrendTitle}
        </h2>

        {bursaryTrend.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">{texts.noTrend}</p>
        ) : (
          <ul className="space-y-1 dark:text-gray-200">
            {bursaryTrend.map((t, idx) => (
              <li key={idx}>
                {t.month}: {t.total}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optional Notifications */}
      {settings?.notifications === 1 && (
        <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow">
          Notifications are enabled by the admin.
        </div>
      )}
    </div>
  );
}
