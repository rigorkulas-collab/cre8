"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  hasHeader?: boolean;
  hasBottomNav?: boolean;
  className?: string;
}

export default function PageContainer({
  children,
  hasHeader = true,
  hasBottomNav = true,
  className,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "flex-1 w-full overflow-y-auto bg-white dark:bg-gray-900 px-5 py-6 scroll-smooth transition-colors duration-200",
        // Add padding to ensure content scrolling does not get hidden under the navigation elements
        hasBottomNav && "pb-24", 
        hasHeader ? "pt-6" : "pt-14",
        className
      )}
    >
      <div className="w-full max-w-lg mx-auto">
        {children}
      </div>
    </main>
  );
}
