import { useState } from "react";

type PicklistOption = {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function Picklist({ id, label, options, value, onChange, disabled = false }: PicklistOption) {
  return (
    <div className="picklist-wrapper">
      <label htmlFor={id}>{label}</label>
      <select
        className="picklist"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}  // <-- add disabled prop
      >
        <option value="">-- {label} --</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
