"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";
import { Download, Search, Filter, Eye } from "lucide-react";

/* ---------------------------
   Types
--------------------------- */
type Status = "Pending" | "Reviewed" | "Approved" | "Rejected";
type Level = "Secondary" | "Tertiary" | "Other";

export type Application = {
  id: number;
  name: string;
  admissionNo: string;
  institution: string;
  level: Level;
  status: Status;
  submittedAt: string;
  amountRequested?: number;
  ward?: string;
  constituency?: string;
  notes?: string;
};

/** Backend API structure */
type BackendApplication = {
  id: number;
  fullName: string;
  admissionNo: string;
  institution: string;
  academicLevel: Level;
  status: Status;
  submittedAt: string;
  amountRequested?: number;
  ward?: string;
  constituency?: string;
  reason?: string;
};

type BackendResponse = {
  applications: BackendApplication[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    reviewed: number;
    rejected: number;
  };
};

/* ---------------------------
   Main Component
--------------------------- */
export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    reviewed: 0,
    rejected: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [levelFilter, setLevelFilter] = useState<Level | "All">("All");
  const [yearFilter, setYearFilter] = useState<string | "All">("All");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [openApp, setOpenApp] = useState<Application | null>(null);

  /* ---------------------------
     Fetch Applications
  --------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams({
          status: statusFilter,
          level: levelFilter,
          year: yearFilter,
          search,
        });

        const res = await fetch(
          `http://localhost/bursarySystem/api/adminapplications.php?${params.toString()}`
        );

        const json: BackendResponse = await res.json();

        // Map backend structure into front-end Application type
        const mapped: Application[] = json.applications.map((a) => ({
          id: a.id,
          name: a.fullName,
          admissionNo: a.admissionNo,
          institution: a.institution,
          level: a.academicLevel,
          status: a.status,
          submittedAt: a.submittedAt,
          amountRequested: a.amountRequested,
          ward: a.ward,
          constituency: a.constituency,
          notes: a.reason ?? "",
        }));

        setData(mapped);
        setStats(json.stats);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    })();
  }, [statusFilter, levelFilter, yearFilter, search]);

  /* ---------------------------
     Derived Data
  --------------------------- */
  const years = useMemo(() => {
    const yrs = Array.from(
      new Set(
        data.map((d) =>
          new Date(d.submittedAt).getFullYear().toString()
        )
      )
    );
    return ["All", ...yrs];
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return data.filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter) return false;
      if (levelFilter !== "All" && d.level !== levelFilter) return false;
      if (
        yearFilter !== "All" &&
        new Date(d.submittedAt).getFullYear().toString() !== yearFilter
      )
        return false;

      return (
        d.name.toLowerCase().includes(q) ||
        d.admissionNo.toLowerCase().includes(q) ||
        d.institution.toLowerCase().includes(q)
      );
    });
  }, [data, search, statusFilter, levelFilter, yearFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------------------------
     Helpers
  --------------------------- */
  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "-";

  const statusColor = (s: Status) =>
    s === "Approved"
      ? "bg-green-100 text-green-800"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : s === "Reviewed"
      ? "bg-blue-100 text-blue-800"
      : "bg-red-100 text-red-800";

  const exportToCSV = (items: Application[]) => {
    const headers = [
      "ID",
      "Name",
      "AdmissionNo",
      "Institution",
      "Level",
      "Status",
      "SubmittedAt",
      "AmountRequested",
      "Ward",
      "Constituency",
      "Notes",
    ];
    const rows = items.map((r) =>
      [
        r.id,
        r.name,
        r.admissionNo,
        r.institution,
        r.level,
        r.status,
        r.submittedAt,
        r.amountRequested ?? "",
        r.ward ?? "",
        r.constituency ?? "",
        (r.notes ?? "").replace(/\n/g, " "),
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------
     JSX
  --------------------------- */
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Applications</h1>
          <p className="text-sm text-slate-500">
            Review and manage bursary applications.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          className="flex items-center gap-2 bg-white border px-3 py-2 rounded-md shadow-sm hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white shadow-sm border rounded-lg">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="p-4 bg-white shadow-sm border rounded-lg">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-semibold">{stats.pending}</p>
        </div>
        <div className="p-4 bg-white shadow-sm border rounded-lg">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-2xl font-semibold">{stats.approved}</p>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col lg:flex-row gap-3 mt-6">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, admission number..."
            className="pl-10 pr-3 py-2 w-full border rounded-lg"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as Status | "All")
          }
          className="px-3 py-2 border rounded-lg"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={levelFilter}
          onChange={(e) =>
            setLevelFilter(e.target.value as Level | "All")
          }
          className="px-3 py-2 border rounded-lg"
        >
          <option value="All">All Levels</option>
          <option value="Secondary">Secondary</option>
          <option value="Tertiary">Tertiary</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setLevelFilter("All");
            setYearFilter("All");
          }}
          className="px-3 py-2 border rounded-lg bg-white"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Applicant</th>
                <th className="px-4 py-3 text-left">Institution</th>
                <th className="px-4 py-3 text-left">Level</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-slate-500">
                      {row.admissionNo}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.institution}</td>
                  <td className="px-4 py-3">{row.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(row.submittedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setOpenApp(row)}
                      className="flex items-center gap-2 border px-3 py-1 rounded-md"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}

              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 flex justify-between bg-slate-50">
          <p className="text-sm">
            Showing <b>{(page - 1) * pageSize + 1}</b> to{" "}
            <b>{Math.min(page * pageSize, filtered.length)}</b> of{" "}
            <b>{filtered.length}</b>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded bg-white"
            >
              Prev
            </button>

            <div className="px-3 py-1 border rounded bg-white">
              Page {page}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Transition show={!!openApp}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            enter="duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-60"
            leave="duration-150"
            leaveFrom="opacity-60"
            leaveTo="opacity-0"
          >
            <div
              className="absolute inset-0 bg-black opacity-60"
              onClick={() => setOpenApp(null)}
            />
          </Transition.Child>

          <Transition.Child
            enter="duration-200"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <div className="relative bg-white max-w-2xl w-full rounded-lg shadow-xl p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">{openApp?.name}</h2>
                  <p className="text-sm text-slate-500">
                    {openApp?.admissionNo}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    openApp ? statusColor(openApp.status) : ""
                  }`}
                >
                  {openApp?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-slate-500">Institution</p>
                  <p className="font-medium">{openApp?.institution}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Level</p>
                  <p className="font-medium">{openApp?.level}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p className="font-medium">
                    {formatDate(openApp?.submittedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Amount Requested</p>
                  <p className="font-medium">
                    KSH {openApp?.amountRequested ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-500">Notes</p>
                <pre className="mt-1 bg-slate-50 p-2 rounded whitespace-pre-wrap text-sm">
                  {openApp?.notes ?? "No notes provided"}
                </pre>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setOpenApp(null)}
                >
                  Close
                </button>

                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Open Review
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
