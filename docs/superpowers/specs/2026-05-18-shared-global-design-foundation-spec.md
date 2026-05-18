# Design Spec: Shared Global Design Foundation

This document specifies the shared global design system and layout system to be shared by both the Admin Desktop Portal and Customer Mobile Portal of the Salon Booking System.

---

## 1. Architectural Goals
*   **Unified Visual Identity:** Single visual language, theme colors, and layout borders across both desktop (Admin) and mobile (Customer) portals.
*   **Dry Styling Architecture:** Components are centralized and props-driven to prevent Tailwind class duplication and UI design drift.
*   **Centralized Constants:** Domain and visual status states are defined once in `lib/constants/status.ts`.

---

## 2. Color System & Theme
Defined in CSS variables within `app/globals.css`:
*   **Background:** `#F3F4F6` (var(--background-gray) / standard tailwind gray-100)
*   **Card Background:** `#FFFFFF` (var(--card-bg))
*   **Primary Text:** `#111827` (var(--foreground) / tailwind gray-900)
*   **Secondary Text:** `#6B7280` (var(--muted-foreground) / tailwind gray-500)
*   **Accent Color:** `#2563EB` (var(--accent) / modern professional blue/indigo)
*   **Border Color:** `#E5E7EB` (var(--border) / tailwind gray-200)

---

## 3. Centralized Constants (`lib/constants/status.ts`)
Standardize status values and their corresponding styling (background, border, text, dot color):

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

---

## 4. Components Layout & Directory Mapping

### Categorized Categories
```
components/shared/
  ├── badges/
  │   └── StatusBadge.tsx
  ├── cards/
  │   └── SectionCard.tsx
  ├── dialogs/
  │   └── ConfirmDialog.tsx
  └── ui/
      ├── EmptyState.tsx
      ├── SearchBar.tsx
      └── SectionHeader.tsx
```

---

## 5. Reusable Component APIs

### A. SectionCard
```typescript
import * as React from "react";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
```
*   **Styles:** Enforces `bg-white border border-gray-200 rounded-xl shadow-xs p-6 sm:p-8 w-full` with custom overrides allowed.

### B. StatusBadge
```typescript
export interface StatusBadgeProps {
  status: string;
  className?: string;
}
```
*   **Styles:** Look up style dynamically from `STATUS_STYLES` in `lib/constants/status.ts`. Fallback styling is a gray-50 badge.

### C. SectionHeader
```typescript
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}
```
*   **Styles:** Title styling is `text-xl sm:text-2xl font-bold text-gray-900 tracking-tight`. Subtitle styling is `text-xs sm:text-sm font-semibold text-gray-400`. Optional `action` renders right-aligned buttons.

### D. EmptyState
```typescript
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  actionText?: string;
  onActionClick?: () => void;
}
```
*   **Styles:** Dashed border container centering standard icon, title, description, and action button.

### E. SearchBar
```typescript
export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}
```
*   **Styles:** Clean minimal input with leading Search icon and tailing Clear/X button.

### F. ConfirmDialog
```typescript
export interface ConfirmDialogProps {
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
```
*   **Styles:** Modern modal overlay with Radix/Shadcn dialog components.

---

## 6. Migration and Reorganization Strategy
1.  Move files and delete legacy top-level elements.
2.  Globally replace imports across all admin dashboard pages.
3.  Modify `globals.css` with the new Indigo/Blue accent (`#2563EB`).
4.  Run TypeScript checks to confirm 0 compilation errors.
