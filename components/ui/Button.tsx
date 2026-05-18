import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold tracking-normal transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm select-none",
  {
    variants: {
      variant: {
        primary: "bg-[#111827] text-white hover:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700 dark:hover:bg-gray-700",
        secondary: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        outline: "border border-border bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800/50 dark:text-gray-100 dark:hover:bg-gray-800/80 shadow-sm",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-800/80 dark:text-gray-100 shadow-none",
        link: "bg-transparent text-gray-900 dark:text-gray-100 underline-offset-4 hover:underline shadow-none font-normal",
      },
      size: {
        default: "px-6 py-3.5 text-xs font-bold leading-none",
        sm: "px-4 py-3 text-xs font-bold leading-none",
        lg: "px-8 py-4 text-sm font-bold leading-none",
        none: "p-0 h-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
export { buttonVariants };
