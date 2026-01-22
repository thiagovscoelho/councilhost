import React, { TextareaHTMLAttributes } from 'react';
import './TextArea.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="textarea-wrapper">
      {label && <label className="textarea-label">{label}</label>}
      <textarea className={`textarea ${error ? 'textarea-error' : ''} ${className}`} {...props} />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
}
