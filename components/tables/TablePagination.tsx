"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
      {/* Left Section: Range metrics */}
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-none">
        Showing <span className="text-gray-700 dark:text-gray-300 font-bold">{startItem}</span> to{" "}
        <span className="text-gray-700 dark:text-gray-300 font-bold">{endItem}</span> of{" "}
        <span className="text-gray-700 dark:text-gray-300 font-bold">{totalItems}</span> results
      </p>

      {/* Right Section: Pagination paging buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md h-8 px-2 py-0 border-gray-200"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
 
        {/* Simple Dynamic numbers */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isCurrent = pageNum === currentPage;
          return (
            <Button
              key={pageNum}
              variant={isCurrent ? "secondary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`rounded-md h-8 w-8 px-0 py-0 flex items-center justify-center font-bold text-xs ${
                isCurrent ? "shadow-xs" : "border-gray-200 bg-white"
              }`}
            >
              {pageNum}
            </Button>
          );
        })}
 
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md h-8 px-2 py-0 border-gray-200"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
