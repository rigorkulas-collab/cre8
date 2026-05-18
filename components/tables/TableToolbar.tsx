"use client";

import React from "react";
import SearchBar from "@/components/shared/ui/SearchBar";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      {/* Left pane: Search & Filters combo */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        {filters && (
          <div className="flex items-center gap-2 shrink-0">
            {filters}
          </div>
        )}
      </div>

      {/* Right pane: Custom slots */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
