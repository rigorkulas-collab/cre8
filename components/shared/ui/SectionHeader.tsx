"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ title, subtitle, description, action, className }: SectionHeaderProps) {
  const displaySubtitle = subtitle || description;
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2 ${className || ""}`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-2xl leading-tight">
          {title}
        </h2>
        {displaySubtitle && (
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed max-w-2xl">
            {displaySubtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
