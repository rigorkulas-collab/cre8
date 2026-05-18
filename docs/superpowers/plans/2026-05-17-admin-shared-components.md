# Step 2 — Shared Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create six high-fidelity, premium, globally reusable shared components (`PageHeader`, `StatsCard`, `StatusBadge`, `SearchBar`, `EmptyState`, `ConfirmDialog`) in `components/shared/` to serve as the functional blocks for all admin sections.

**Architecture:** Build modular, fully-typed React components leveraging the pre-established `Button`, `Card`, and `Dialog` UI blocks. Maintain strict TypeScript signatures and elegant mobile-responsive layouts.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Radix UI primitives.

---

## User Review Required

> [!IMPORTANT]
> - **Unified Status Badges:** The `StatusBadge` component will use a pre-mapped style catalog supporting both custom cases (e.g. `pending`, `confirmed`, `completed`, `cancelled`, `paid`, `refunded`, `failed`) with sleek color-coordinated layouts matching our salon operations.
> - **Destructive Confirmation Interactivity:** `ConfirmDialog` will integrate Radix Dialog and `Button` states directly to offer safe handlers, a loading spinner, and red theme highlights for destructive operations (e.g., deletions/cancelations).

## Open Questions

> [!NOTE]
> There are no remaining open questions. The component interfaces are standardized and clean.

---

## Proposed Changes

### [Shared Components]

- `components/shared/PageHeader.tsx` [NEW]
- `components/shared/StatsCard.tsx` [NEW]
- `components/shared/StatusBadge.tsx` [NEW]
- `components/shared/SearchBar.tsx` [NEW]
- `components/shared/EmptyState.tsx` [NEW]
- `components/shared/ConfirmDialog.tsx` [NEW]

---

## Task List

### Task 1: Create PageHeader Component

**Files:**
- Create: `components/shared/PageHeader.tsx`

- [ ] **Step 1: Write PageHeader component file**
  Create `components/shared/PageHeader.tsx` with responsive layout, title, description, and slot for action buttons/elements.
  ```tsx
  "use client";

  import React from "react";

  interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
  }

  export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl">
              {description}
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

---

### Task 2: Create StatsCard Component

**Files:**
- Create: `components/shared/StatsCard.tsx`

- [ ] **Step 1: Write StatsCard component file**
  Create `components/shared/StatsCard.tsx` with support for value, change indicators, customizable Lucide icon, and descriptions.
  ```tsx
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
  }

  export default function StatsCard({ title, value, description, change, icon: Icon }: StatsCardProps) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">{value}</span>
            {change && (
              <span className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold",
                change.type === "increase" && "bg-green-50 text-green-700",
                change.type === "decrease" && "bg-red-50 text-red-700",
                change.type === "neutral" && "bg-gray-100 text-gray-600"
              )}>
                {change.type === "increase" && <ArrowUpRight className="h-3.5 w-3.5" />}
                {change.type === "decrease" && <ArrowDownRight className="h-3.5 w-3.5" />}
                {change.type === "neutral" && <Minus className="h-3.5 w-3.5" />}
                {change.value}
              </span>
            )}
          </div>
          {description && (
            <span className="text-xs font-medium text-gray-400">{description}</span>
          )}
        </div>
      </div>
    );
  }
  ```

---

### Task 3: Create StatusBadge Component

**Files:**
- Create: `components/shared/StatusBadge.tsx`

- [ ] **Step 1: Write StatusBadge component file**
  Create `components/shared/StatusBadge.tsx` with dynamic status-color styling maps, custom text capitalization, and premium CSS pill aesthetics.
  ```tsx
  "use client";

  import React from "react";
  import { cn } from "@/lib/utils";

  type StatusType = 
    | "pending" 
    | "confirmed" 
    | "completed" 
    | "cancelled" 
    | "paid" 
    | "refunded" 
    | "failed"
    | string;

  interface StatusBadgeProps {
    status: StatusType;
    className?: string;
  }

  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    pending: {
      bg: "bg-amber-50/70 border-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    confirmed: {
      bg: "bg-emerald-50/70 border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    completed: {
      bg: "bg-blue-50/70 border-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    cancelled: {
      bg: "bg-red-50/70 border-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    paid: {
      bg: "bg-emerald-50/70 border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    refunded: {
      bg: "bg-purple-50/70 border-purple-100",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
    failed: {
      bg: "bg-red-50/70 border-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  };

  export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const key = status.trim().toLowerCase();
    const style = statusStyles[key] || {
      bg: "bg-gray-50 border-gray-100",
      text: "text-gray-600",
      dot: "bg-gray-400",
    };

    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold shadow-xs transition-colors duration-150 cursor-default",
        style.bg,
        style.text,
        className
      )}>
        <span className={cn("h-1.5 w-1.5 rounded-full ring-1 ring-white/10 shrink-0", style.dot)} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }
  ```

---

### Task 4: Create SearchBar Component

**Files:**
- Create: `components/shared/SearchBar.tsx`

- [ ] **Step 1: Write SearchBar component file**
  Create `components/shared/SearchBar.tsx` incorporating a clean search input field with an inline magnifying glass and dynamic close/clear indicators.
  ```tsx
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
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-[#D1BFA7] focus:ring-1 focus:ring-[#D1BFA7] focus:outline-none transition-all duration-200 bg-white shadow-xs placeholder-gray-400 font-medium"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear Search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
  ```

---

### Task 5: Create EmptyState Component

**Files:**
- Create: `components/shared/EmptyState.tsx`

- [ ] **Step 1: Write EmptyState component file**
  Create `components/shared/EmptyState.tsx` using a polished, centered placeholder system, custom Lucide icons, descriptive text slots, and optional custom buttons.
  ```tsx
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
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 text-center animate-fade-in">
        {/* Icon Ring wrapper */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-[#D1BFA7] mb-5 shadow-xs">
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

---

### Task 6: Create ConfirmDialog Component

**Files:**
- Create: `components/shared/ConfirmDialog.tsx`

- [ ] **Step 1: Write ConfirmDialog component file**
  Create `components/shared/ConfirmDialog.tsx` as a high-fidelity dialog modal integrating Radix and standard styled Button elements, handling loading states, cancel/confirm configurations, and destructive overlays.
  ```tsx
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
        <DialogContent className="max-w-md gap-6">
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
              className="w-full sm:w-auto rounded-xl"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isLoading}
              size="default"
              className={cn(
                "w-full sm:w-auto rounded-xl",
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

  // Import utility inside component context helper
  import { cn } from "@/lib/utils";
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the codebase compiles successfully and that all newly created components integrate perfectly.
- Command: `npm run build`

### Manual Verification
- We will double-check that the files are properly generated in `components/shared/` and imported without TypeScript issues.
