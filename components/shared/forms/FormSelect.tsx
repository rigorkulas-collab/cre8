"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: FormSelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, options, placeholder, helperText, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold tracking-tight text-gray-900 dark:text-gray-100 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all duration-150 font-medium cursor-pointer appearance-none",
              error && "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10 bg-red-50/5 dark:bg-red-950/20",
              props.disabled && "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-150 dark:border-gray-800 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-400 font-medium">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-900 font-medium bg-white dark:bg-gray-800 dark:text-gray-100">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Stylized custom dropdown indicator */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 dark:text-gray-500">
            <svg
              className="h-4 w-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="text-[10px] font-bold text-red-600 animate-in fade-in slide-in-from-top-1 duration-150">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 leading-normal">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
export { FormSelect };
