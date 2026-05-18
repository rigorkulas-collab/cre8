# Step 3 — Shared Table System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-fidelity, highly generic, and fully typed Shared Table System (`DataTable`, `TableToolbar`, `TableFilters`, `TablePagination`, `TableActionsDropdown`) in `components/tables/` to handle all listing data across appointments, services, payments, reports, and customer records.

**Architecture:** Build reusable components using generic type signatures (`T`), supporting flexible column accessors, interactive cell render overrides, automated loading skeletons, unified filtering dropdowns, and clean responsive pagination trackers.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, pre-built custom `Dropdown` and `Button` UI blocks.

---

## User Review Required

> [!IMPORTANT]
> - **Generics Type Signatures:** The `DataTable` columns config will support both simple string property lookups (e.g. `accessor: "name"`) and functional cell rendering overrides (e.g. `accessor: (row) => <StatusBadge status={row.status} />`), ensuring supreme extensibility.
> - **Skeleton Loaders:** Renders generic gray loading skeletons mimicking multi-column records dynamically whenever `isLoading` is active.

## Open Questions

> [!NOTE]
> There are no remaining open questions. The requirements and design align perfectly.

---

## Proposed Changes

### [Table System Components]

- `components/tables/DataTable.tsx` [NEW]
- `components/tables/TableToolbar.tsx` [NEW]
- `components/tables/TableFilters.tsx` [NEW]
- `components/tables/TablePagination.tsx` [NEW]
- `components/tables/TableActionsDropdown.tsx` [NEW]

---

## Task List

### Task 1: Create DataTable Component

**Files:**
- Create: `components/tables/DataTable.tsx`

- [ ] **Step 1: Write DataTable component file**
  Create generic `components/tables/DataTable.tsx` with customized property lookups, render function accessors, loading skeleton placeholders, click event callbacks, and optional empty visual states.
  ```tsx
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
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-500">
            {/* Table Header */}
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400 select-none">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={cn(
                      "px-6 py-4 font-bold",
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
            <tbody className="divide-y divide-gray-100/80 bg-white">
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="hover:bg-transparent">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="px-6 py-4.5">
                        <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                // Empty state cell
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    {emptyState || (
                      <div className="text-sm font-semibold text-gray-400">No data found.</div>
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
                      onRowClick ? "cursor-pointer hover:bg-gray-50/40" : "hover:bg-gray-50/10"
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
                            "px-6 py-4 font-medium text-gray-900 group-hover:text-black transition-colors",
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
  ```

---

### Task 2: Create TableToolbar Component

**Files:**
- Create: `components/tables/TableToolbar.tsx`

- [ ] **Step 1: Write TableToolbar component file**
  Create `components/tables/TableToolbar.tsx` which wraps reusable search queries, category filters, and action slots in a fluid flex wrapper.
  ```tsx
  "use client";

  import React from "react";
  import SearchBar from "@/components/shared/SearchBar";

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
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
  ```

---

### Task 3: Create TableFilters Component

**Files:**
- Create: `components/tables/TableFilters.tsx`

- [ ] **Step 1: Write TableFilters component file**
  Create `components/tables/TableFilters.tsx` referencing custom Dropdown components for unified option filtering.
  ```tsx
  "use client";

  import React from "react";
  import { Filter, Check } from "lucide-react";
  import Dropdown from "@/components/ui/Dropdown";
  import { cn } from "@/lib/utils";

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
        <Check className="h-3.5 w-3.5 text-[#D1BFA7]" />
      ) : undefined,
      className: selectedValue === opt.value ? "bg-gray-50 text-gray-900 font-bold" : undefined,
    }));

    return (
      <Dropdown
        align="left"
        header={label}
        trigger={
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200 shadow-xs cursor-pointer">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <span>{label}: <span className="text-gray-900 font-extrabold">{activeLabel}</span></span>
          </button>
        }
        items={dropdownItems}
      />
    );
  }
  ```

---

### Task 4: Create TablePagination Component

**Files:**
- Create: `components/tables/TablePagination.tsx`

- [ ] **Step 1: Write TablePagination component file**
  Create `components/tables/TablePagination.tsx` displaying calculated elements ranges, page limits, and custom gold active page buttons.
  ```tsx
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-100 animate-fade-in">
        {/* Left Section: Range metrics */}
        <p className="text-xs font-semibold text-gray-400 leading-none">
          Showing <span className="text-gray-700 font-bold">{startItem}</span> to{" "}
          <span className="text-gray-700 font-bold">{endItem}</span> of{" "}
          <span className="text-gray-700 font-bold">{totalItems}</span> results
        </p>

        {/* Right Section: Pagination paging buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg h-8 px-2 py-0"
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
                className={`rounded-lg h-8 w-8 px-0 py-0 flex items-center justify-center font-bold text-xs ${
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
            className="rounded-lg h-8 px-2 py-0"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  ```

---

### Task 5: Create TableActionsDropdown Component

**Files:**
- Create: `components/tables/TableActionsDropdown.tsx`

- [ ] **Step 1: Write TableActionsDropdown component file**
  Create `components/tables/TableActionsDropdown.tsx` utilizing Dropdown primitives with Lucide trigger button configs.
  ```tsx
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
          <button className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer">
            <MoreHorizontal className="h-4.5 w-4.5" />
            <span className="sr-only">More options</span>
          </button>
        }
        items={dropdownItems}
      />
    );
  }
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the codebase compiles successfully and that all table elements integrate perfectly.
- Command: `npm run build`

### Manual Verification
- We will double-check that the files are properly generated in `components/tables/` and imported without TypeScript issues.
