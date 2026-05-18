"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/constants/status";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.trim().toLowerCase();
  const style = STATUS_STYLES[key] || {
    bg: "bg-gray-50 border-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: status,
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold shadow-xs transition-colors duration-150 cursor-default",
      style.bg,
      style.text,
      className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full ring-1 ring-white/10 shrink-0", style.dot)} />
      {style.label}
    </span>
  );
}
