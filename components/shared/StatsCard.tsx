"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number | string;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ComponentType<any>;
  iconColor?: "blue" | "emerald" | "indigo" | "amber" | "rose" | "purple" | "gray";
}

const colorMap = {
  blue: "bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900 text-blue-500",
  emerald: "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900 text-emerald-500",
  indigo: "bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900 text-indigo-500",
  amber: "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900 text-amber-500",
  rose: "bg-rose-50 dark:bg-rose-950 border-rose-100 dark:border-rose-900 text-rose-500",
  purple: "bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900 text-purple-500",
  gray: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500"
};

export default function StatsCard({ title, value, description, change, icon: Icon, iconColor = "gray" }: StatsCardProps) {
  const colorClasses = colorMap[iconColor] || colorMap.gray;
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none p-4 flex flex-col justify-between transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{title}</span>
        {Icon && (
          <div className={cn("h-8 w-8 rounded-md flex items-center justify-center border shrink-0", colorClasses)}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{value}</span>
          {change && (
            <span className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold shrink-0",
              change.type === "increase" && "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400",
              change.type === "decrease" && "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400",
              change.type === "neutral" && "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}>
              {change.type === "increase" && <ArrowUpRight className="h-3 w-3 shrink-0" />}
              {change.type === "decrease" && <ArrowDownRight className="h-3 w-3 shrink-0" />}
              {change.type === "neutral" && <Minus className="h-3 w-3 shrink-0" />}
              {change.value}
            </span>
          )}
        </div>
        {description && (
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{description}</span>
        )}
      </div>
    </div>
  );
}
