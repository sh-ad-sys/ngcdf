"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

export default function BursaryApplicationPage() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState({
    // Personal Info
    fullName: "",
    admissionNo: "",
    institution: "",
    constituency: "",
    ward: "",
    subward: "",
    village: "",
    // Family Info
    guardianName: "",
    guardianContact: "",
    familyIncome: "",
    // Academic Info & Docs
    academicLevel: "",
    course: "",
    yearOfStudy: "",
    programType: "",
    formLevel: "",
    idDocument: null as File | null,
    feeStructure: null as File | null,
    admissionLetter: null as File | null,
  });

  const wardOptions: Record<string, string[]> = {
    "Mbooni East": ["Kalawa", "Tulimani", "Kithungo/Kitundu", "Mbooni"],
    "Mbooni West": ["Kisau/Kiteta", "Mutitu/Kalamba", "Waia/Kako"],
  };

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) setForm({ ...form, [name]: files[0] });
  };

  const validateStep = (requiredFields: string[]) => {
    const missing = requiredFields.filter((f) => !form[f as keyof typeof form]);
    setErrors(missing);
    return missing.length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      const fields = [
        "fullName",
        "admissionNo",
        "institution",
        "constituency",
        "ward",
        "subward",
        "village",
      ];
      if (validateStep(fields)) setStep(2);
    } else if (step === 2) {
      const fields = ["guardianName", "guardianContact", "familyIncome"];
      if (validateStep(fields)) setStep(3);
    } else if (step === 3) {
      const fields = [
        "academicLevel",
        "idDocument",
        "feeStructure",
        "admissionLetter",
      ];
      if (form.academicLevel === "Tertiary") {
        fields.push("course", "yearOfStudy", "programType");
      } else if (form.academicLevel === "Secondary") {
        fields.push("formLevel");
      }
      if (validateStep(fields)) setStep(4);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    alert("✅ Bursary Application submitted successfully!");
    console.log("Submitted Data:", form);
  };

  const FieldLabel = ({ label }: { label: string }) => (
    <label className="text-sm font-semibold text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
      {/* Progress Tracker */}
      <div className="flex justify-between mb-12">
        {["Personal Info", "Family Info", "Academic Files", "Confirm"].map(
          (label, index) => (
            <div key={index} className="flex flex-col items-center w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                  step > index + 1
                    ? "bg-green-500"
                    : step === index + 1
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                {step > index + 1 ? <CheckCircle size={20} /> : index + 1}
              </div>
              <p
                className={`mt-2 text-sm font-semibold ${
                  step === index + 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          )
        )}
      </div>

      {/* STEP 1: PERSONAL INFO */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Step 1 — Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldLabel label="Full Name" />
              <Input
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <FieldLabel label="Admission Number" />
              <Input
                name="admissionNo"
                onChange={handleChange}
                placeholder="Enter admission number"
              />
            </div>
            <div>
              <FieldLabel label="Institution / School" />
              <Input
                name="institution"
                onChange={handleChange}
                placeholder="e.g., University of Nairobi"
              />
            </div>
            <div>
              <FieldLabel label="Constituency" />
              <Select
                onValueChange={(value) =>
                  setForm({ ...form, constituency: value, ward: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select constituency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mbooni East">Mbooni East</SelectItem>
                  <SelectItem value="Mbooni West">Mbooni West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.constituency && (
              <div>
                <FieldLabel label="Ward" />
                <Select
                  onValueChange={(value) => setForm({ ...form, ward: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wardOptions[form.constituency].map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <FieldLabel label="Sub-ward" />
              <Input
                name="subward"
                onChange={handleChange}
                placeholder="Enter sub-ward"
              />
            </div>
            <div>
              <FieldLabel label="Village" />
              <Input
                name="village"
                onChange={handleChange}
                placeholder="Enter village name"
              />
            </div>
          </div>

          {errors.length > 0 && (
            <p className="text-red-600 mt-4 text-sm">
              ⚠️ Please fill all required fields before continuing.
            </p>
          )}

          <div className="flex justify-end mt-8">
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: FAMILY INFO */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Step 2 — Family Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldLabel label="Parent/Guardian Name" />
              <Input
                name="guardianName"
                onChange={handleChange}
                placeholder="Enter guardian’s name"
              />
            </div>
            <div>
              <FieldLabel label="Guardian Contact" />
              <Input
                name="guardianContact"
                onChange={handleChange}
                placeholder="e.g., 0712 345 678"
              />
            </div>
            <div>
              <FieldLabel label="Total Monthly Income (KSh)" />
              <Input
                name="familyIncome"
                onChange={handleChange}
                placeholder="e.g., 15000"
                type="number"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: ACADEMIC FILES */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Step 3 — Academic Files & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldLabel label="Academic Level" />
              <Select
                onValueChange={(value) =>
                  setForm({ ...form, academicLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.academicLevel === "Tertiary" && (
              <>
                <div>
                  <FieldLabel label="Course Undertaking" />
                  <Input
                    name="course"
                    onChange={handleChange}
                    placeholder="e.g., BSc Computer Science"
                  />
                </div>
                <div>
                  <FieldLabel label="Year of Study" />
                  <Select
                    onValueChange={(value) =>
                      setForm({ ...form, yearOfStudy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
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
                  <FieldLabel label="Program Type" />
                  <Select
                    onValueChange={(value) =>
                      setForm({ ...form, programType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Degree">Degree</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {form.academicLevel === "Secondary" && (
              <div>
                <FieldLabel label="Current Form" />
                <Select
                  onValueChange={(value) => setForm({ ...form, formLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
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

            <div>
              <FieldLabel label="National ID / Birth Certificate" />
              <Input type="file" name="idDocument" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="Fee Structure" />
              <Input type="file" name="feeStructure" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="Admission Letter" />
              <Input
                type="file"
                name="admissionLetter"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: CONFIRM */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Step 4 — Confirm & Submit
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg space-y-2">
            <p><strong>Full Name:</strong> {form.fullName}</p>
            <p><strong>Institution:</strong> {form.institution}</p>
            <p><strong>Constituency:</strong> {form.constituency}</p>
            <p><strong>Guardian:</strong> {form.guardianName}</p>
            <p><strong>Income:</strong> KSh {form.familyIncome}</p>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Application
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
