import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none accent-gray-900 dark:accent-gray-100 cursor-pointer transition-colors",
            className
          )}
          {...props}
        />
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
          {label}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
