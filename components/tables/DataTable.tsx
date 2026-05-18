"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
          {/* Table Header */}
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 dark:text-gray-500 select-none">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "px-3 py-3 font-semibold",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {isLoading ? (
              // Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="hover:bg-transparent">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-3 py-3.5">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state cell
              <tr>
                <td colSpan={columns.length} className="px-3 py-12 text-center">
                  {emptyState || (
                    <div className="text-sm font-semibold text-gray-400 dark:text-gray-500">No data found.</div>
                  )}
                </td>
              </tr>
            ) : (
              // Row mapping
              data.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "transition-colors duration-150 group",
                    onRowClick ? "cursor-pointer hover:bg-gray-50/40 dark:hover:bg-gray-800/40" : "hover:bg-gray-50/10 dark:hover:bg-gray-800/10"
                  )}
                >
                  {columns.map((col, cIdx) => {
                    const content =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);

                    return (
                      <td
                        key={cIdx}
                        className={cn(
                          "px-3 py-3 font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.className
                        )}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
