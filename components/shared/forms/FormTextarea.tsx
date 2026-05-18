"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-bold tracking-tight text-gray-900 dark:text-gray-100 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all duration-150 font-medium resize-y",
            error && "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10 bg-red-50/5 dark:bg-red-950/20",
            props.disabled && "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-150 dark:border-gray-800 cursor-not-allowed",
            className
          )}
          {...props}
        />

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

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
export { FormTextarea };
