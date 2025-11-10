"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    reason: "",

    // Family Info
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

    // Academic Info & Files
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

    if (step === 1) {
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
    } else if (step === 2) {
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
    } else if (step === 3) {
      fields = [
        "academicLevel",
        "studentID",
        "nationalID",
        "admissionLetter",
        "feeStructure",
      ];
      if (form.academicLevel === "Tertiary") {
        fields.push("course", "yearOfStudy", "programType");
      } else if (form.academicLevel === "Secondary") {
        fields.push("formLevel");
      }
    }

    if (validateStep(fields)) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    alert("✅ Your bursary application has been submitted successfully!");
    console.log("Application Submitted:", form);
  };

  const FieldLabel = ({ label }: { label: string }) => (
    <label className="text-base font-semibold text-gray-800">
      {label} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
      {/* Step Progress Bar */}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Step 1 — Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <FieldLabel label="Full Name" />
              <Input name="fullName" onChange={handleChange} placeholder="John Doe" />
            </div>
            <div>
              <FieldLabel label="Admission Number" />
              <Input name="admissionNo" onChange={handleChange} placeholder="A12345" />
            </div>
            <div>
              <FieldLabel label="Institution / School" />
              <Input
                name="institution"
                onChange={handleChange}
                placeholder="University of Nairobi"
              />
            </div>

            {/* Constituency Select */}
            <div>
              <FieldLabel label="Constituency" />
              <Select
                onValueChange={(value) =>
                  setForm({ ...form, constituency: value, ward: "", subward: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Constituency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mbooni East">Mbooni East</SelectItem>
                  <SelectItem value="Mbooni West">Mbooni West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ward Select */}
            {form.constituency && (
              <div>
                <FieldLabel label="Ward" />
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, ward: value, subward: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ward" />
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

            {/* Sub-Ward Select */}
            {form.ward && (
              <div>
                <FieldLabel label="Sub-Ward" />
                <Select
                  onValueChange={(value) => setForm({ ...form, subward: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub-Ward" />
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

            <div>
              <FieldLabel label="Village" />
              <Input
                name="village"
                onChange={handleChange}
                placeholder="Enter your village"
              />
            </div>
          </div>

          <div className="mt-6">
            <FieldLabel label="Reason for Applying (Max 150 words)" />
            <Textarea
              name="reason"
              onChange={handleChange}
              placeholder="Explain why you should be considered for this bursary..."
              className="min-h-[120px] text-base"
              maxLength={900}
            />
          </div>

          {errors.length > 0 && (
            <p className="text-red-600 mt-4">⚠️ Fill in all required fields.</p>
          )}

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg"
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

  


      {/* Step 2: Family Info */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Step 2 — Family Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <FieldLabel label="Father's Name" />
              <Input name="fatherName" onChange={handleChange} placeholder="John M. Doe" />
            </div>
            <div>
              <FieldLabel label="Father's Occupation" />
              <Input name="fatherOccupation" onChange={handleChange} placeholder="Farmer / Teacher" />
            </div>
            <div>
              <FieldLabel label="Father’s Monthly Income (KSh)" />
              <Input name="fatherIncome" type="number" onChange={handleChange} placeholder="e.g. 15000" />
            </div>
            <div>
              <FieldLabel label="Mother's Name" />
              <Input name="motherName" onChange={handleChange} placeholder="Mary J. Doe" />
            </div>
            <div>
              <FieldLabel label="Mother's Occupation" />
              <Input name="motherOccupation" onChange={handleChange} placeholder="Businesswoman / Tailor" />
            </div>
            <div>
              <FieldLabel label="Mother’s Monthly Income (KSh)" />
              <Input name="motherIncome" type="number" onChange={handleChange} placeholder="e.g. 12000" />
            </div>
            <div>
              <FieldLabel label="Parent/Guardian Contact" />
              <Input name="guardianContact" onChange={handleChange} placeholder="0712 345 678" />
            </div>
            <div>
              <FieldLabel label="Total Family Members" />
              <Input name="familySize" type="number" onChange={handleChange} placeholder="e.g. 5" />
            </div>
            <div>
              <FieldLabel label="Dependents Currently in School" />
              <Input name="dependentsInSchool" type="number" onChange={handleChange} placeholder="e.g. 3" />
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={handleBack} className="text-lg">
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Academic Files */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Step 3 — Academic Files & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <FieldLabel label="Academic Level" />
              <Select onValueChange={(v) => setForm({ ...form, academicLevel: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.academicLevel === "Tertiary" && (
              <>
                <div>
                  <FieldLabel label="Course Undertaking" />
                  <Input name="course" onChange={handleChange} placeholder="BSc Computer Science" />
                </div>
                <div>
                  <FieldLabel label="Year of Study" />
                  <Select onValueChange={(v) => setForm({ ...form, yearOfStudy: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <FieldLabel label="Student ID (Upload)" />
              <Input type="file" name="studentID" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="National ID / Birth Certificate" />
              <Input type="file" name="nationalID" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="Admission Letter" />
              <Input type="file" name="admissionLetter" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="Fee Structure" />
              <Input type="file" name="feeStructure" onChange={handleFileChange} />
            </div>
            <div>
              <FieldLabel label="Other Supporting Documents" />
              <Input type="file" name="supportingDocs" onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={handleBack} className="text-lg">
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Step 4 — Confirm & Submit
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg text-base space-y-2">
            <p><strong>Full Name:</strong> {form.fullName}</p>
            <p><strong>Institution:</strong> {form.institution}</p>
            <p><strong>Father:</strong> {form.fatherName} — {form.fatherOccupation} (KSh {form.fatherIncome})</p>
            <p><strong>Mother:</strong> {form.motherName} — {form.motherOccupation} (KSh {form.motherIncome})</p>
            <p><strong>Reason:</strong> {form.reason}</p>
          </div>

          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={handleBack} className="text-lg">
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 px-10 py-2 text-lg">
              Submit Application
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
