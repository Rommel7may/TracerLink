import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  htmlFor?: string;
}

export function FormField({ label, children, error, required = false, className = '', htmlFor }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label 
        htmlFor={htmlFor} 
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}