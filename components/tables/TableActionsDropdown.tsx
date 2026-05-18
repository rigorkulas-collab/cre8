"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";

export interface TableActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  isDestructive?: boolean;
  disabled?: boolean;
}

interface TableActionsDropdownProps {
  actions: TableActionItem[];
  align?: "left" | "right";
}

export default function TableActionsDropdown({
  actions,
  align = "right",
}: TableActionsDropdownProps) {
  const dropdownItems = actions.map((act) => ({
    label: act.label,
    onClick: act.onClick,
    icon: act.icon,
    danger: act.isDestructive,
    disabled: act.disabled,
  }));

  return (
    <Dropdown
      align={align}
      trigger={
        <button className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer select-none">
          <MoreHorizontal className="h-4.5 w-4.5" />
          <span className="sr-only">More options</span>
        </button>
      }
      items={dropdownItems}
    />
  );
}
