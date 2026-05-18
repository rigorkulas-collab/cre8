import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-white shadow-sm",
        secondary:
          "border-transparent bg-gray-100 text-gray-900",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 font-normal tracking-normal",
        warning:
          "border-transparent bg-amber-100 text-amber-800 font-normal tracking-normal",
        outline: "text-gray-900 border-border font-normal tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
