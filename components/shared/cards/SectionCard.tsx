import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ children, className, ...props }: SectionCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
