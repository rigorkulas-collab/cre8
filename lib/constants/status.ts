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
    bg: "bg-amber-50/70 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Pending",
  },
  confirmed: {
    bg: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Confirmed",
  },
  completed: {
    bg: "bg-blue-50/70 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-50/70 border-red-100 dark:bg-red-950/30 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    label: "Cancelled",
  },
  paid: {
    bg: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  refunded: {
    bg: "bg-purple-50/70 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/50",
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
    label: "Refunded",
  },
  failed: {
    bg: "bg-red-50/70 border-red-100 dark:bg-red-950/30 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    label: "Failed",
  },
  active: {
    bg: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Active",
  },
  inactive: {
    bg: "bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-800",
    text: "text-gray-500 dark:text-gray-400",
    dot: "bg-gray-400",
    label: "Inactive",
  },
};
