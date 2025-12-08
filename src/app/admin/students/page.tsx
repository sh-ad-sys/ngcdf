"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Loader2, Lock, Unlock, Check, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// ================= INTERFACES =================

interface Student {
  id: number;
  student_id: number;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  national_id: string;
  admission_no: string;
  institution: string;
  course: string;
  year_of_study: string;
  avatar: string | null;
  status: string;
  verification_status: string;
  disbursement_status: string;
  admin_notes: string;
  fundingHistory: FundingRecord[];
  academicHistory: AcademicRecord[];
}

interface FundingRecord {
  year: number;
  bursary: string;
  amount: number;
  status: string;
  disbursements: {
    date: string;
    amount: number;
    mode: string;
  }[];
}

interface AcademicRecord {
  year: number;
  semester: string;
  remarks: string;
}

// =================== PAGE COMPONENT ===================

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Student | null>(null);
  const [search, setSearch] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  // ================= FETCH STUDENTS =================
  async function loadStudents() {
    try {
      const res = await fetch(
        "http://localhost/bursarySystem/api/admin/get_admin_students.php"
      );
      const json = await res.json();

      if (json.success && Array.isArray(json.students)) {
        const mapped = json.students.map((s: Student) => ({
          ...s,
          fundingHistory: [],
          academicHistory: [],
        }));

        setStudents(mapped);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // ================= FILTER =================
  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_no.toLowerCase().includes(search.toLowerCase()) ||
      s.national_id.toLowerCase().includes(search.toLowerCase())
  );

  // ================= ADMIN ACTION HANDLER =================
  async function handleAction(action: string) {
    if (!selected) return;

    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost/bursarySystem/api/admin/${action}.php`, {
        method: "POST",
        body: JSON.stringify({ student_id: selected.id }),
      });

      const json = await res.json();

      alert(json.message || "Success");

      // Refresh list
      await loadStudents();
      setSelected(null);
    } catch {
      alert("Error performing action");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>

      {/* SEARCH */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search name, email, admission number, national ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Badge variant="outline">Total Students: {filtered.length}</Badge>
      </div>

      {/* TABLE */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>ID Number</TableCell>
                  <TableCell>Adm No</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={s.avatar || ""} />
                          <AvatarFallback>{s.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {s.full_name}
                      </div>
                    </TableCell>

                    <TableCell>{s.national_id}</TableCell>
                    <TableCell>{s.admission_no}</TableCell>
                    <TableCell>{s.institution}</TableCell>

                    <TableCell>
                      <Badge variant={s.status === "Active" ? "default" : "destructive"}>
                        {s.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => setSelected(s)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* PROFILE MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>Detailed student information</DialogDescription>
          </DialogHeader>

          {selected && (
            <div>
              {/* HEADER */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selected.avatar || ""} />
                  <AvatarFallback>{selected.full_name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-xl font-semibold">{selected.full_name}</h2>
                  <p className="text-gray-500">{selected.email}</p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* TABS */}
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="funding">Funding</TabsTrigger>
                </TabsList>

                {/* PROFILE */}
                <TabsContent value="profile">
                  <h3 className="font-semibold text-lg mb-2">Student Information</h3>

                  <div className="space-y-2">
                    <p><strong>Phone:</strong> {selected.phone}</p>
                    <p><strong>Gender:</strong> {selected.gender}</p>
                    <p><strong>National ID:</strong> {selected.national_id}</p>
                    <p><strong>Admission No:</strong> {selected.admission_no}</p>
                    <p><strong>Institution:</strong> {selected.institution}</p>
                    <p><strong>Course:</strong> {selected.course}</p>
                    <p><strong>Year of Study:</strong> {selected.year_of_study}</p>
                    <p><strong>Status:</strong> {selected.status}</p>
                    <p><strong>Verification:</strong> {selected.verification_status}</p>
                    <p><strong>Disbursement:</strong> {selected.disbursement_status}</p>
                  </div>

                  <Separator className="my-4" />

                  {/* ================= ADMIN ACTIONS ================= */}
                  <h3 className="font-semibold text-lg mt-4 mb-2">Admin Actions</h3>

                  <div className="flex flex-wrap gap-3">

                    <Button disabled={actionLoading} onClick={() => handleAction("verify_student")}>
                      <Check className="w-4 h-4 mr-2" /> Verify Student
                    </Button>

                    <Button
                      variant="outline"
                      disabled={actionLoading}
                      onClick={() => handleAction("unverify_student")}
                    >
                      <X className="w-4 h-4 mr-2" /> Unverify
                    </Button>

                    <Button disabled={actionLoading} onClick={() => handleAction("approve_funding")}>
                      <Check className="w-4 h-4 mr-2" /> Approve Funding
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={actionLoading}
                      onClick={() => handleAction("reject_funding")}
                    >
                      <X className="w-4 h-4 mr-2" /> Reject Funding
                    </Button>

                    <Button disabled={actionLoading} onClick={() => handleAction("activate_account")}>
                      Activate Account
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={actionLoading}
                      onClick={() => handleAction("deactivate_account")}
                    >
                      <Unlock className="w-4 h-4 mr-2" /> Deactivate Account
                    </Button>

                    <Button
                      variant="secondary"
                      disabled={actionLoading}
                      onClick={() => handleAction("reset_password")}
                    >
                      <Lock className="w-4 h-4 mr-2" /> Reset Password
                    </Button>
                  </div>
                </TabsContent>

                {/* ACADEMIC */}
                <TabsContent value="academic">
                  <h3 className="font-semibold text-lg mb-2">Academic History</h3>

                  {selected.academicHistory.length === 0 ? (
                    <p className="text-gray-500">No academic records available.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell>Semester</TableCell>
                          <TableCell>Remarks</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.academicHistory.map((a, i) => (
                          <TableRow key={i}>
                            <TableCell>{a.year}</TableCell>
                            <TableCell>{a.semester}</TableCell>
                            <TableCell>{a.remarks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                {/* FUNDING */}
                <TabsContent value="funding">
                  <h3 className="font-semibold text-lg mb-2">Funding History</h3>

                  {selected.fundingHistory.length === 0 ? (
                    <p>No records found.</p>
                  ) : (
                    selected.fundingHistory.map((f, i) => (
                      <Card key={i} className="mb-4">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {f.year} — {f.bursary} ({f.status})
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          <p>
                            <strong>Amount Awarded:</strong> KES {f.amount.toLocaleString()}
                          </p>

                          <Separator className="my-3" />

                          <strong>Disbursements:</strong>
                          <ul className="mt-2 space-y-1">
                            {f.disbursements.map((d, i2) => (
                              <li key={i2}>
                                {d.date} — KES {d.amount.toLocaleString()} ({d.mode})
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
