"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  // General
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [autoBackup, setAutoBackup] = useState(false);

  // Student Dashboard Controls
  const [studentTheme, setStudentTheme] = useState("light");
  const [maintenance, setMaintenance] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const [allowFunding, setAllowFunding] = useState(true);
  const [allowAcademic, setAllowAcademic] = useState(true);
  const [allowProfileEdit, setAllowProfileEdit] = useState(true);
  const [allowDocuments, setAllowDocuments] = useState(true);
  const [allowNotificationsStudent, setAllowStudentNotifications] = useState(true);
  const [allowApplications, setAllowApplications] = useState(true);

  // SAVE FUNCTION (fixed)
  const handleSave = async (): Promise<void> => {
    const payload = {
      theme,
      language,
      notifications,
      auto_backup: autoBackup,

      // Student controls
      studentTheme,
      maintenance,
      announcement,

      allowFunding,
      allowAcademic,
      allowProfileEdit,
      allowDocuments,
      allowNotifications: allowNotificationsStudent,
      allowApplications,
    };

    try {
      const res = await fetch(
        "http://localhost/bursarySystem/api/settings/saveSettings.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      alert(json.message || "Settings saved!");
      console.log("Saved Settings: ", payload);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        ⚙️ Admin Settings
      </h1>

      <div className="space-y-10">
        {/* GENERAL SETTINGS */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>General Preferences</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label>Admin Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-100 px-5 py-4 rounded-xl">
              <Label>Email Notifications</Label>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between bg-gray-100 px-5 py-4 rounded-xl">
              <Label>Enable Auto Backup</Label>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
          </CardContent>
        </Card>

        {/* STUDENT DASHBOARD SETTINGS */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Student Dashboard Controls</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <Label className="text-lg">Student Dashboard Theme</Label>
              <Select value={studentTheme} onValueChange={setStudentTheme}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="blue">Blue Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between bg-red-50 px-5 py-4 rounded-xl border border-red-300">
              <div>
                <Label className="text-red-600 font-semibold">
                  Enable Maintenance Mode
                </Label>
                <p className="text-sm text-red-500">
                  When enabled, all students are blocked from logging in.
                </p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>

            {/* Announcement */}
            <div>
              <Label className="text-lg">Global Announcement</Label>
              <Textarea
                placeholder="Message that will appear for all students..."
                className="mt-2"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
            </div>

            {/* FEATURE CONTROLS */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Control Student Features
              </h3>

              <div className="space-y-4">
                <FeatureToggle
                  label="View Funding History"
                  state={allowFunding}
                  setState={setAllowFunding}
                />
                <FeatureToggle
                  label="View Academic Records"
                  state={allowAcademic}
                  setState={setAllowAcademic}
                />
                <FeatureToggle
                  label="Edit Profile"
                  state={allowProfileEdit}
                  setState={setAllowProfileEdit}
                />
                <FeatureToggle
                  label="Download Documents"
                  state={allowDocuments}
                  setState={setAllowDocuments}
                />
                <FeatureToggle
                  label="Student Notifications"
                  state={allowNotificationsStudent}
                  setState={setAllowStudentNotifications}
                />
                <FeatureToggle
                  label="Apply for Bursary"
                  state={allowApplications}
                  setState={setAllowApplications}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reusable Toggle Component
function FeatureToggle({
  label,
  state,
  setState,
}: {
  label: string;
  state: boolean;
  setState: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-4">
      <Label className="text-gray-700">{label}</Label>
      <Switch checked={state} onCheckedChange={setState} />
    </div>
  );
}
