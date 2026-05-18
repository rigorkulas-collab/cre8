"use client";

import React from "react";
import { Filter, Check } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";

export interface FilterOption {
  label: string;
  value: string;
}

interface TableFiltersProps {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (val: string) => void;
}

export default function TableFilters({
  label,
  options,
  selectedValue,
  onSelect,
}: TableFiltersProps) {
  const activeLabel = options.find((opt) => opt.value === selectedValue)?.label || "All";

  const dropdownItems = options.map((opt) => ({
    label: opt.label,
    onClick: () => onSelect(opt.value),
    rightElement: selectedValue === opt.value ? (
      <Check className="h-3.5 w-3.5 text-gray-900" />
    ) : undefined,
    className: selectedValue === opt.value ? "bg-gray-50 text-gray-900 font-bold" : undefined,
  }));

  return (
    <Dropdown
      align="left"
      header={label}
      trigger={
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 shadow-xs cursor-pointer select-none">
          <Filter className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          <span>{label}: <span className="text-gray-900 dark:text-gray-100 font-extrabold">{activeLabel}</span></span>
        </button>
      }
      items={dropdownItems}
    />
  );
}
