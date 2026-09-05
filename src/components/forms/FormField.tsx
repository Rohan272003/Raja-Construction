'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as?: 'textarea' };

export const FormField = forwardRef<HTMLInputElement, InputProps>(function FormField(props, ref) {
  const { label, error, id, required, className, ...rest } = props;
  const fieldId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="field-label flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-ruby font-bold ml-1" title="Required">*</span>}
        </span>
      </label>
      <input
        ref={ref}
        id={fieldId}
        className={`field-input ${error ? '!border-ruby !ring-1 !ring-ruby bg-ruby/5' : ''} ${className ?? ''}`}
        {...rest}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextAreaField(props, ref) {
  const { label, error, id, required, as: _as, className, ...rest } = props;
  const fieldId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="field-label flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-ruby font-bold ml-1" title="Required">*</span>}
        </span>
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={`field-input min-h-[110px] resize-none ${error ? '!border-ruby !ring-1 !ring-ruby bg-ruby/5' : ''} ${className ?? ''}`}
        {...rest}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});
