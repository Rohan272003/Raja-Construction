'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, Props>(function SelectField(props, ref) {
  const { label, options, id, error, required, className, ...rest } = props;
  const fieldId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="field-label flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-ruby font-bold ml-1" title="Required">*</span>}
        </span>
      </label>
      <select
        ref={ref}
        id={fieldId}
        className={`field-input appearance-none ${error ? '!border-ruby !ring-1 !ring-ruby bg-ruby/5' : ''} ${className ?? ''}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});
