"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FieldLabel from "@/components/FieldLabel";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

export default function BursaryForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    admissionNo: "",
    institution: "",
    constituency: "",
    ward: "",
    subward: "",
    village: "",
    reason: "",
    fatherName: "",
    fatherOccupation: "",
    fatherIncome: "",
    motherName: "",
    motherOccupation: "",
    motherIncome: "",
    guardianName: "",
    guardianContact: "",
    familySize: "",
    dependentsInSchool: "",
    academicLevel: "",
    course: "",
    yearOfStudy: "",
    programType: "",
    formLevel: "",
    studentID: null as File | null,
    nationalID: null as File | null,
    admissionLetter: null as File | null,
    feeStructure: null as File | null,
    supportingDocs: null as File | null,
  });

  const wardOptions: Record<string, string[]> = {
    "Mbooni East": ["Kalawa", "Tulimani", "Kithungo/Kitundu", "Mbooni"],
    "Mbooni West": ["Kisau/Kiteta", "Mutitu/Kalamba", "Waia/Kako"],
  };

  const subWardOptions: Record<string, string[]> = {
    Kalawa: ["Kanyenyoni", "Kivani", "Kalawa Market"],
    Tulimani: ["Tulimani Town", "Kasikeu", "Kyaani"],
    "Kithungo/Kitundu": ["Kitundu", "Kithungo Hill", "Mbaa Village"],
    Mbooni: ["Mbooni Town", "Kinyuu", "Thii Village"],
    "Kisau/Kiteta": ["Kiteta Market", "Kisau Hills", "Ngomeni"],
    "Mutitu/Kalamba": ["Mutitu Town", "Kalamba Centre", "Kiangini"],
    "Waia/Kako": ["Kako Market", "Waia", "Kilungu Base"],
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) setForm({ ...form, [name]: files[0] });
  };

  const validateStep = (fields: string[]) => {
    const missing = fields.filter((f) => !form[f as keyof typeof form]);
    setErrors(missing);
    return missing.length === 0;
  };

  const handleNext = () => {
    let fields: string[] = [];
    if (step === 1)
      fields = [
        "fullName",
        "admissionNo",
        "institution",
        "constituency",
        "ward",
        "subward",
        "village",
        "reason",
      ];
    else if (step === 2)
      fields = [
        "fatherName",
        "fatherOccupation",
        "fatherIncome",
        "motherName",
        "motherOccupation",
        "motherIncome",
        "familySize",
        "dependentsInSchool",
      ];
    else if (step === 3) {
      fields = [
        "academicLevel",
        "studentID",
        "nationalID",
        "admissionLetter",
        "feeStructure",
      ];
      if (form.academicLevel === "Tertiary")
        fields.push("course", "yearOfStudy", "programType");
      else if (form.academicLevel === "Secondary") fields.push("formLevel");
    }
    if (validateStep(fields)) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    const required = ["fullName", "admissionNo", "institution", "academicLevel"];
    const missing = required.filter((f) => !form[f as keyof typeof form]);
    if (missing.length > 0) {
      alert("⚠️ Please fill all required fields before submitting.");
      return;
    }

    const formData = new FormData();
    (Object.keys(form) as (keyof typeof form)[]).forEach((key) => {
      const value = form[key];
      if (value !== null && value !== undefined) {
        if (typeof value === "string" || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const response = await fetch(
        "http://localhost/bursarySystem/api/application.php",
        { method: "POST", body: formData }
      );

      const text = await response.text();
      console.log("Raw PHP Response:", text);

      let data: { success: boolean; message: string };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response: " + text);
      }

      if (data.success) {
        alert("✅ " + data.message);
        window.location.href = "/student-dashboard";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err: unknown) {
      console.error("Submit Error:", err);
      alert("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-10"
    >
      {/* Progress Bar */}
      <div className="flex justify-between mb-10">
        {["Personal Info", "Family Info", "Academic Files", "Confirm"].map(
          (label, index) => (
            <div key={index} className="flex flex-col items-center w-1/4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold transition-all ${
                  step > index + 1
                    ? "bg-green-500"
                    : step === index + 1
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                {step > index + 1 ? <CheckCircle size={22} /> : index + 1}
              </div>
              <p
                className={`mt-2 font-semibold text-sm md:text-base ${
                  step === index + 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          )
        )}
      </div>

    {/* Step 1: Personal Info */}
{step === 1 && (
  <motion.div
    key="step1"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <div>
      <FieldLabel label="Full Name" required />
      <Input
        name="fullName"
        placeholder="Enter your full name"
        value={form.fullName}
        onChange={handleChange}
        className={errors.includes("fullName") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Admission / Student Number" required />
      <Input
        name="admissionNo"
        placeholder="e.g., ADM12345"
        value={form.admissionNo}
        onChange={handleChange}
        className={errors.includes("admissionNo") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Institution" required />
      <Input
        name="institution"
        placeholder="e.g., University of Nairobi"
        value={form.institution}
        onChange={handleChange}
        className={errors.includes("institution") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Constituency" required />
      <Select
        onValueChange={(value) =>
          setForm({ ...form, constituency: value, ward: "", subward: "" })
        }
      >
        <SelectTrigger>
          <SelectValue
            placeholder={form.constituency || "Select your constituency"}
          />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(wardOptions).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {form.constituency && (
      <div>
        <FieldLabel label="Ward" required />
        <Select
          onValueChange={(value) =>
            setForm({ ...form, ward: value, subward: "" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={form.ward || "Select ward"} />
          </SelectTrigger>
          <SelectContent>
            {wardOptions[form.constituency]?.map((ward) => (
              <SelectItem key={ward} value={ward}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    {form.ward && (
      <div>
        <FieldLabel label="Sub-Ward" required />
        <Select
          onValueChange={(value) => setForm({ ...form, subward: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={form.subward || "Select sub-ward"} />
          </SelectTrigger>
          <SelectContent>
            {subWardOptions[form.ward]?.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    <div className="md:col-span-2">
      <FieldLabel label="Village / Estate" required />
      <Input
        name="village"
        placeholder="e.g., Kalawa Market"
        value={form.village}
        onChange={handleChange}
        className={errors.includes("village") ? "border-red-500" : ""}
      />
    </div>

    <div className="md:col-span-2">
      <FieldLabel label="Reason for Application" required />
      <Textarea
        name="reason"
        placeholder="Explain briefly why you are applying for the bursary..."
        value={form.reason}
        onChange={handleChange}
        className={errors.includes("reason") ? "border-red-500" : ""}
      />
    </div>

    <div className="flex justify-end md:col-span-2 mt-6">
      <Button onClick={handleNext} className="flex items-center gap-2">
        Next
        <ChevronRight size={18} />
      </Button>
    </div>
  </motion.div>
)}

  
{/* Step 2: Family Info */}
{step === 2 && (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {/* Father Information */}
    <div>
      <FieldLabel label="Father's Name" required />
      <Input
        name="fatherName"
        placeholder="Enter father's full name"
        value={form.fatherName}
        onChange={handleChange}
        className={errors.includes("fatherName") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Father's Occupation" required />
      <Input
        name="fatherOccupation"
        placeholder="e.g., Farmer, Teacher, Businessman"
        value={form.fatherOccupation}
        onChange={handleChange}
        className={errors.includes("fatherOccupation") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Father's Monthly Income (KES)" required />
      <Input
        type="number"
        name="fatherIncome"
        placeholder="e.g., 15000"
        value={form.fatherIncome}
        onChange={handleChange}
        className={errors.includes("fatherIncome") ? "border-red-500" : ""}
      />
    </div>

    {/* Mother Information */}
    <div>
      <FieldLabel label="Mother's Name" required />
      <Input
        name="motherName"
        placeholder="Enter mother's full name"
        value={form.motherName}
        onChange={handleChange}
        className={errors.includes("motherName") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Mother's Occupation" required />
      <Input
        name="motherOccupation"
        placeholder="e.g., Self-employed, Civil Servant"
        value={form.motherOccupation}
        onChange={handleChange}
        className={errors.includes("motherOccupation") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Mother's Monthly Income (KES)" required />
      <Input
        type="number"
        name="motherIncome"
        placeholder="e.g., 12000"
        value={form.motherIncome}
        onChange={handleChange}
        className={errors.includes("motherIncome") ? "border-red-500" : ""}
      />
    </div>

    {/* Guardian Information (Optional) */}
    <div className="md:col-span-2">
      <FieldLabel label="Guardian (if applicable)" />
      <Input
        name="guardianName"
        placeholder="Guardian full name (if applicable)"
        value={form.guardianName}
        onChange={handleChange}
      />
    </div>

    <div className="md:col-span-2">
      <FieldLabel label="Guardian Contact" />
      <Input
        name="guardianContact"
        placeholder="e.g., 0712 345 678"
        value={form.guardianContact}
        onChange={handleChange}
      />
    </div>

    {/* Family Statistics */}
    <div>
      <FieldLabel label="Total Family Members" required />
      <Input
        type="number"
        name="familySize"
        placeholder="e.g., 6"
        value={form.familySize}
        onChange={handleChange}
        className={errors.includes("familySize") ? "border-red-500" : ""}
      />
    </div>

    <div>
      <FieldLabel label="Dependents Currently in School" required />
      <Input
        type="number"
        name="dependentsInSchool"
        placeholder="e.g., 3"
        value={form.dependentsInSchool}
        onChange={handleChange}
        className={
          errors.includes("dependentsInSchool") ? "border-red-500" : ""
        }
      />
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-between md:col-span-2 mt-6">
      <Button
        variant="outline"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft size={18} />
        Back
      </Button>

      <Button onClick={handleNext} className="flex items-center gap-2">
        Next
        <ChevronRight size={18} />
      </Button>
    </div>
  </motion.div>
)}
{/* Step 3: Academic Files */}
{step === 3 && (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {/* Academic Level */}
    <div className="md:col-span-2">
      <FieldLabel label="Current Academic Level" required />
      <Select
        name="academicLevel"
        onValueChange={(value) =>
          setForm({ ...form, academicLevel: value })
        }
      >
        <SelectTrigger
          className={
            errors.includes("academicLevel") ? "border-red-500" : ""
          }
        >
          <SelectValue placeholder="Select level (Secondary / Tertiary)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Secondary">Secondary</SelectItem>
          <SelectItem value="Tertiary">Tertiary / College / University</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Show if Secondary */}
    {form.academicLevel === "Secondary" && (
      <div>
        <FieldLabel label="Current Form Level" required />
        <Select
          name="formLevel"
          onValueChange={(value) =>
            setForm({ ...form, formLevel: value })
          }
        >
          <SelectTrigger
            className={
              errors.includes("formLevel") ? "border-red-500" : ""
            }
          >
            <SelectValue placeholder="Select Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Form 1">Form 1</SelectItem>
            <SelectItem value="Form 2">Form 2</SelectItem>
            <SelectItem value="Form 3">Form 3</SelectItem>
            <SelectItem value="Form 4">Form 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )}

    {/* Show if Tertiary */}
    {form.academicLevel === "Tertiary" && (
      <>
        <div>
          <FieldLabel label="Course / Program" required />
          <Input
            name="course"
            placeholder="e.g., BSc Computer Science"
            value={form.course}
            onChange={handleChange}
            className={errors.includes("course") ? "border-red-500" : ""}
          />
        </div>

        <div>
          <FieldLabel label="Year of Study" required />
          <Select
            name="yearOfStudy"
            onValueChange={(value) =>
              setForm({ ...form, yearOfStudy: value })
            }
          >
            <SelectTrigger
              className={
                errors.includes("yearOfStudy") ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <FieldLabel label="Program Type" required />
          <Select
            name="programType"
            onValueChange={(value) =>
              setForm({ ...form, programType: value })
            }
          >
            <SelectTrigger
              className={
                errors.includes("programType") ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="e.g., Full-time / Part-time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Distance Learning">Distance Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    )}

    {/* File Uploads */}
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <FieldLabel label="Student ID / School ID" required />
        <Input
          type="file"
          name="studentID"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className={errors.includes("studentID") ? "border-red-500" : ""}
        />
      </div>

      <div>
        <FieldLabel label="National ID / Birth Certificate" required />
        <Input
          type="file"
          name="nationalID"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className={errors.includes("nationalID") ? "border-red-500" : ""}
        />
      </div>

      <div>
        <FieldLabel label="Admission Letter" required />
        <Input
          type="file"
          name="admissionLetter"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className={errors.includes("admissionLetter") ? "border-red-500" : ""}
        />
      </div>

      <div>
        <FieldLabel label="Fee Structure" required />
        <Input
          type="file"
          name="feeStructure"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className={errors.includes("feeStructure") ? "border-red-500" : ""}
        />
      </div>

      <div className="md:col-span-2">
        <FieldLabel label="Other Supporting Documents (optional)" />
        <Input
          type="file"
          name="supportingDocs"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-between md:col-span-2 mt-6">
      <Button
        variant="outline"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft size={18} />
        Back
      </Button>

      <Button onClick={handleNext} className="flex items-center gap-2">
        Next
        <ChevronRight size={18} />
      </Button>
    </div>
  </motion.div>
)}
{/* Step 4: Confirm & Submit */}
{step === 4 && (
  <motion.div
    key="step4"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
      Review Your Application
    </h2>
    <p className="text-gray-600 text-center">
      Please confirm that all the information below is accurate before submitting.
    </p>

    {/* Summary Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-xl p-6 bg-gray-50">
      <div>
        <h3 className="font-semibold text-lg text-blue-600 mb-2">Personal Info</h3>
        <ul className="text-gray-700 space-y-1">
          <li><b>Full Name:</b> {form.fullName}</li>
          <li><b>Admission No:</b> {form.admissionNo}</li>
          <li><b>Institution:</b> {form.institution}</li>
          <li><b>Constituency:</b> {form.constituency}</li>
          <li><b>Ward:</b> {form.ward}</li>
          <li><b>Sub-Ward:</b> {form.subward}</li>
          <li><b>Village:</b> {form.village}</li>
          <li><b>Reason:</b> {form.reason}</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-blue-600 mb-2">Family Info</h3>
        <ul className="text-gray-700 space-y-1">
          <li><b>Father:</b> {form.fatherName} ({form.fatherOccupation})</li>
          <li><b>Father Income:</b> {form.fatherIncome}</li>
          <li><b>Mother:</b> {form.motherName} ({form.motherOccupation})</li>
          <li><b>Mother Income:</b> {form.motherIncome}</li>
          {form.guardianName && (
            <li><b>Guardian:</b> {form.guardianName} — {form.guardianContact}</li>
          )}
          <li><b>Family Size:</b> {form.familySize}</li>
          <li><b>Dependents in School:</b> {form.dependentsInSchool}</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-blue-600 mb-2">Academic Info</h3>
        <ul className="text-gray-700 space-y-1">
          <li><b>Level:</b> {form.academicLevel}</li>
          {form.academicLevel === "Secondary" && (
            <li><b>Form:</b> {form.formLevel}</li>
          )}
          {form.academicLevel === "Tertiary" && (
            <>
              <li><b>Course:</b> {form.course}</li>
              <li><b>Year of Study:</b> {form.yearOfStudy}</li>
              <li><b>Program Type:</b> {form.programType}</li>
            </>
          )}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-blue-600 mb-2">Uploaded Files</h3>
        <ul className="text-gray-700 space-y-1">
          <li><b>Student ID:</b> {form.studentID ? (form.studentID as File).name : "Not uploaded"}</li>
          <li><b>National ID:</b> {form.nationalID ? (form.nationalID as File).name : "Not uploaded"}</li>
          <li><b>Admission Letter:</b> {form.admissionLetter ? (form.admissionLetter as File).name : "Not uploaded"}</li>
          <li><b>Fee Structure:</b> {form.feeStructure ? (form.feeStructure as File).name : "Not uploaded"}</li>
          <li><b>Supporting Docs:</b> {form.supportingDocs ? (form.supportingDocs as File).name : "None"}</li>
        </ul>
      </div>
    </div>

    {/* Navigation + Submit Buttons */}
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft size={18} />
        Back
      </Button>

      <Button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <CheckCircle size={18} />
        Submit Application
      </Button>
    </div>
  </motion.div>
)}
   </motion.div>
  );
}