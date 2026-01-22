import React from 'react';
import './RadioGroup.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RadioGroup({ name, options, value, onChange, label }: RadioGroupProps) {
  return (
    <div className="radio-group">
      {label && <label className="radio-group-label">{label}</label>}
      <div className="radio-options">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="radio-input"
            />
            <span className="radio-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
