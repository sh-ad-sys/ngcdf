"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import "../../../styles/profile.css"; // ✅ import your external CSS

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {/* Profile Picture */}
      <div className="profile-picture">
        <div className="profile-image-wrapper">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="profile-image-placeholder">No Image</div>
          )}

          <label className="profile-upload-button">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Profile Form */}
      <form className="profile-form">
        <div>
          <label className="profile-label">Full Names *</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Email / Admission No *</label>
          <input
            type="text"
            placeholder="Enter your email or admission number"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Gender *</label>
          <select className="profile-select">
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div>
          <label className="profile-label">Phone Number *</label>
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Sub County *</label>
          <select className="profile-select">
            <option>Select Sub County</option>
            <option>Mbooni East</option>
            <option>Mbooni West</option>
          </select>
        </div>

        <div>
          <label className="profile-label">Home Ward *</label>
          <select className="profile-select">
            <option>Select Ward</option>
            <option>Kithungo</option>
            <option>Kiteta</option>
          </select>
        </div>

        <div>
          <label className="profile-label">Sub Ward</label>
          <input
            type="text"
            placeholder="Enter your sub ward"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Village</label>
          <input
            type="text"
            placeholder="Enter your village"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Password *</label>
          <input
            type="password"
            placeholder="Enter password"
            className="profile-input"
          />
        </div>

        <div>
          <label className="profile-label">Change Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="profile-input"
          />
        </div>
      </form>

      <div className="profile-button-container">
        <button className="profile-save-button">Save Changes</button>
      </div>
    </div>
  );
}
