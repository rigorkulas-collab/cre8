"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ComponentType<any>;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, helperText, error, type = "text", id, icon: Icon, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold tracking-tight text-gray-900 dark:text-gray-100 select-none cursor-pointer"
          >
            {label}
          </label>
        )}
        
        <div className="relative w-full">
          {Icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all duration-150 font-medium",
              Icon && "pl-10",
              error && "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10 bg-red-50/5 dark:bg-red-950/20",
              props.disabled && "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-150 dark:border-gray-800 cursor-not-allowed",
              className
            )}
            {...props}
          />
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

FormInput.displayName = "FormInput";

export default FormInput;
export { FormInput };

