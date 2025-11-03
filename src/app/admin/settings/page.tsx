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

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>("light");
  const [language, setLanguage] = useState<string>("english");
  const [autoBackup, setAutoBackup] = useState<boolean>(false);

  const handleSave = (): void => {
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
        ⚙️ Admin Settings
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-8 space-y-10">
        {/* General Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            General Preferences
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(val: string) => setTheme(val)}>
                <SelectTrigger className="w-full">
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
              <Select
                value={language}
                onValueChange={(val: string) => setLanguage(val)}
              >
                <SelectTrigger className="w-full">
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
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Notifications
          </h2>
          <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-4">
            <Label className="text-gray-700">Email Notifications</Label>
            <Switch
              checked={notifications}
              onCheckedChange={(checked: boolean) => setNotifications(checked)}
            />
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Security Settings
          </h2>
          <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-4">
            <Label className="text-gray-700">Enable Auto-Backup</Label>
            <Switch
              checked={autoBackup}
              onCheckedChange={(checked: boolean) => setAutoBackup(checked)}
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
