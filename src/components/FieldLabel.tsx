// components/FieldLabel.tsx
import React from "react";

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ label, required }) => (
  <label className="block text-gray-700 font-semibold mb-1 text-base">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default FieldLabel;
