# Shared Global Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a unified visual design foundation and centralized component library shared by the Admin and Customer portals, standardizing colors, badges, empty states, search bars, cards, and modal dialogs.

**Architecture:** We will create `lib/constants/status.ts` as a single source of truth for visual style configurations and status maps. Existing components will be refactored and moved to structured folders under `components/shared/`, old top-level files will be deleted, global page imports will be updated, and the global accent color will be customized to a professional blue/indigo theme.

**Tech Stack:** Next.js, React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Radix UI Dialog.

---

### Task 1: Create Centralized Constants (`lib/constants/status.ts`)

**Files:**
- Create: `lib/constants/status.ts`

- [x] **Step 1: Write `lib/constants/status.ts`**
  Write the status constants and tailwind style mapping.

  ```typescript
  export const APPOINTMENT_STATUSES = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  } as const;

  export const PAYMENT_STATUSES = {
    PENDING: "pending",
    PAID: "paid",
    REFUNDED: "refunded",
    FAILED: "failed",
  } as const;

  export const CUSTOMER_STATUSES = {
    ACTIVE: "active",
    INACTIVE: "inactive",
  } as const;

  export interface StatusStyle {
    bg: string;
    text: string;
    dot: string;
    label: string;
  }

  export const STATUS_STYLES: Record<string, StatusStyle> = {
    pending: {
      bg: "bg-amber-50/70 border-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-emerald-50/70 border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Confirmed",
    },
    completed: {
      bg: "bg-blue-50/70 border-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Completed",
    },
    cancelled: {
      bg: "bg-red-50/70 border-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Cancelled",
    },
    paid: {
      bg: "bg-emerald-50/70 border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Paid",
    },
    refunded: {
      bg: "bg-purple-50/70 border-purple-100",
      text: "text-purple-700",
      dot: "bg-purple-500",
      label: "Refunded",
    },
    failed: {
      bg: "bg-red-50/70 border-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Failed",
    },
    active: {
      bg: "bg-emerald-50/70 border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Active",
    },
    inactive: {
      bg: "bg-gray-50 border-gray-100",
      text: "text-gray-500",
      dot: "bg-gray-400",
      label: "Inactive",
    },
  };
  ```

- [x] **Step 2: Commit constants** (Skipped git add/commit due to absence of git repo)

---

### Task 2: Create Reusable UI Components in Categorized Folders

**Files:**
- Create: `components/shared/cards/SectionCard.tsx`
- Create: `components/shared/badges/StatusBadge.tsx`
- Create: `components/shared/ui/SectionHeader.tsx`
- Create: `components/shared/ui/EmptyState.tsx`
- Create: `components/shared/ui/SearchBar.tsx`
- Create: `components/shared/dialogs/ConfirmDialog.tsx`

- [x] **Step 1: Implement `SectionCard.tsx`**
  Write a clean card wrapper with consistent border, background, shadow, and padding.

  ```typescript
  import * as React from "react";
  import { cn } from "@/lib/utils";

  export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
  }

  export default function SectionCard({ children, className, ...props }: SectionCardProps) {
    return (
      <div
        className={cn(
          "w-full bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
  ```

- [x] **Step 2: Implement `StatusBadge.tsx`**
  Look up visual styling from `STATUS_STYLES` dynamically.

  ```typescript
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
  ```

- [x] **Step 3: Implement `SectionHeader.tsx`**
  Implement page/section title component, supporting title, description, and optional right-aligned action buttons.

  ```typescript
  "use client";

  import React from "react";

  interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
  }

  export default function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
    return (
      <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-gray-150 ${className || ""}`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-semibold text-gray-400 leading-relaxed max-w-2xl">
              {subtitle}
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
  ```

- [x] **Step 4: Implement `EmptyState.tsx`**
  Centering standard icon, title, description, and action button.

  ```typescript
  "use client";

  import React from "react";
  import { HelpCircle } from "lucide-react";
  import Button from "@/components/ui/Button";

  interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ComponentType<any>;
    actionText?: string;
    onActionClick?: () => void;
  }

  export default function EmptyState({
    title,
    description,
    icon: Icon = HelpCircle,
    actionText,
    onActionClick,
  }: EmptyStateProps) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white/50 p-8 text-center w-full">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-gray-400 mb-5 shadow-xs">
          <Icon className="h-7 w-7" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm font-medium text-gray-500 max-w-sm mb-6 leading-relaxed">{description}</p>

        {actionText && onActionClick && (
          <Button variant="secondary" onClick={onActionClick} size="default">
            {actionText}
          </Button>
        )}
      </div>
    );
  }
  ```

- [x] **Step 5: Implement `SearchBar.tsx`**
  Input component for searches, including leading Search icon and clear button.

  ```typescript
  "use client";

  import React from "react";
  import { Search, X } from "lucide-react";

  interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  }

  export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
    return (
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4.5 w-4.5 text-gray-400" />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-sm placeholder:text-gray-400 text-gray-900 pl-10 pr-10"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Clear Search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
  ```

- [x] **Step 6: Implement `ConfirmDialog.tsx`**
  Modern confirmation modal styled nicely.

  ```typescript
  "use client";

  import React from "react";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import Button from "@/components/ui/Button";
  import { Loader2 } from "lucide-react";
  import { cn } from "@/lib/utils";

  interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
  }

  export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
    isLoading = false,
  }: ConfirmDialogProps) {
    const handleConfirm = async () => {
      await onConfirm();
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md gap-6 rounded-lg sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>
   
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              size="default"
              className="w-full sm:w-auto rounded-lg"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isLoading}
              size="default"
              className={cn(
                "w-full sm:w-auto rounded-lg",
                isDestructive && "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/10"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                  Please wait...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  ```

- [x] **Step 7: Commit components** (Skipped git add/commit due to absence of git repo)

---

### Task 3: Global Imports Updates & Legacy Cleanup

**Files:**
- Modify: `app/admin/customers/page.tsx`
- Modify: `app/admin/reports/page.tsx`
- Modify: `app/admin/payments/page.tsx`
- Modify: `app/admin/settings/page.tsx`
- Modify: `app/admin/dashboard/page.tsx`
- Modify: `app/admin/appointments/page.tsx`
- Modify: `app/admin/services/page.tsx`
- Modify: `components/tables/TableToolbar.tsx`
- Delete: `components/shared/StatusBadge.tsx`
- Delete: `components/shared/ConfirmDialog.tsx`
- Delete: `components/shared/EmptyState.tsx`
- Delete: `components/shared/SearchBar.tsx`
- Delete: `components/shared/PageHeader.tsx`

- [x] **Step 1: Update page components imports**
  Refactor all file imports to refer to the new categorized directories:
  *   `@/components/shared/StatusBadge` ➔ `@/components/shared/badges/StatusBadge`
  *   `@/components/shared/ConfirmDialog` ➔ `@/components/shared/dialogs/ConfirmDialog`
  *   `@/components/shared/EmptyState` ➔ `@/components/shared/ui/EmptyState`
  *   `@/components/shared/SearchBar` ➔ `@/components/shared/ui/SearchBar`
  *   `@/components/shared/PageHeader` ➔ `@/components/shared/ui/SectionHeader` (Rename usage component `<PageHeader` to `<SectionHeader`)
  *   `@/components/ui/SectionHeader` ➔ `@/components/shared/ui/SectionHeader`

- [x] **Step 2: Delete legacy top-level duplicate components**
  Successfully removed:
  *   `components/shared/StatusBadge.tsx`
  *   `components/shared/ConfirmDialog.tsx`
  *   `components/shared/EmptyState.tsx`
  *   `components/shared/SearchBar.tsx`
  *   `components/shared/PageHeader.tsx`

- [x] **Step 3: Commit migration & cleanup** (Skipped git add/commit due to absence of git repo)

---

### Task 4: Custom Accent Color & Global Style Polish

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/Button.tsx`

- [x] **Step 1: Replace accent color variables in `app/globals.css`**
  Changed the `--accent` value from `#D1BFA7` to `#2563EB` (Tailwind blue-600) for a modern, sleek corporate aesthetic.

- [x] **Step 2: Update secondary button hover styling in `components/ui/Button.tsx`**
  Adjusted the `secondary` variant to match the new Indigo Blue corporate branding accent.

  ```typescript
  secondary: "bg-[#2563EB] text-white hover:bg-[#1d4ed8]",
  ```

- [x] **Step 3: Run typescript compiler verification**
  Successfully executed: `npx tsc --noEmit` and confirmed 0 compile or import errors in the `app`, `components` or `lib` application codebase directory!

- [x] **Step 4: Commit style updates** (Skipped git add/commit due to absence of git repo)
