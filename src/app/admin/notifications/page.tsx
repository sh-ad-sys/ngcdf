"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all_students");

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/bursarySystem/api/notifications/create_notification.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message, target }),
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("Notification sent!");
        setTitle("");
        setMessage("");
      } else {
        alert(json.error || "Failed to send notification");
      }
    } catch (err) {
      console.error("Notification error:", err);
      alert("Error sending notification. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-8">
      <h1 className="text-3xl font-semibold mb-8">📢 Send Notification</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create Notification</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Write the message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Send To</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select target group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_students">All Students</SelectItem>
                <SelectItem value="all_admins">All Admins</SelectItem>
                <SelectItem value="single_student">Specific Student</SelectItem>
                <SelectItem value="everyone">Everyone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={sendNotification}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
