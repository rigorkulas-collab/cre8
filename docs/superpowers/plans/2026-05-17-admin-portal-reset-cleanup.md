# Salon Booking System Admin Portal Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely reset and clean the Admin/Staff Portal codebase, establishing a clean, empty, scalable architectural foundation without touching any customer-side pages, components, layouts, or logic.

**Architecture:** Purge all legacy admin routes and UI folders (`app/admin/`, `components/admin/`), and recreate clean empty route pages and scalable directories (`components/shared/`, `components/forms/`, `components/tables/`, `components/layout/`, `components/features/`, `lib/constants/`, `lib/utils/`, `types/`) to form a fresh build environment.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, shadcn/ui.

---

## User Review Required

> [!IMPORTANT]
> - **Zero Customer Disruption:** We will keep `components/forms/FormField.tsx` intact since it is shared/imported by customer-facing login/register components (`components/auth/LoginForm.tsx` and `components/auth/RegisterForm.tsx`).
> - **Page Skeleton Baseline:** New admin page routes under `app/admin/` will be established as clean minimal React components with standard headers and no widgets, mock data, or visual components.
> - **Empty Directory Support:** Empty directories in `components/` and `lib/` will be initialized using `.gitkeep` placeholder files so they are tracked by git.

## Open Questions

> [!NOTE]
> There are no remaining open questions. The requirements are extremely clear and explicit: keep the customer side 100% untouched, delete old admin code, and scaffold empty route folders for the future staff portal.

---

## Proposed Changes

### [Admin Portal Cleanup]

Summary of deleted directories and files:
- `components/admin/` [DELETE] (All sub-folders: services, tables, appointments, shared, drawers, auth, layout, dashboard, payments, reports, customers)
- `app/admin/` [DELETE] (All sub-folders: services, appointments, login, dashboard, payments, reports, customers)

### [Admin Portal Reset Structure]

Summary of created directories and files:
- `app/admin/login/page.tsx` [NEW]
- `app/admin/dashboard/page.tsx` [NEW]
- `app/admin/appointments/page.tsx` [NEW]
- `app/admin/services/page.tsx` [NEW]
- `app/admin/customers/page.tsx` [NEW]
- `app/admin/payments/page.tsx` [NEW]
- `app/admin/reports/page.tsx` [NEW]
- `app/admin/settings/page.tsx` [NEW]
- `components/shared/.gitkeep` [NEW]
- `components/tables/.gitkeep` [NEW]
- `components/layout/.gitkeep` [NEW]
- `components/features/.gitkeep` [NEW]
- `lib/constants/.gitkeep` [NEW]
- `lib/utils/.gitkeep` [NEW]
- `types/.gitkeep` [NEW]

---

## Task List

### Task 1: Clean and Delete Legacy Admin Codebase

**Files:**
- Delete: `app/admin/` (recursively)
- Delete: `components/admin/` (recursively)

- [ ] **Step 1: Delete components/admin folder**
  Run: `rm -rf components/admin`
  Expected: Legacy admin components are deleted.
- [ ] **Step 2: Delete app/admin folder**
  Run: `rm -rf app/admin`
  Expected: Legacy admin pages and routes are deleted.
- [ ] **Step 3: Commit deletions**
  Run: `git add . && git commit -m "cleanup: remove legacy admin components and pages"`
  Expected: Legacy files removed from git index.

---

### Task 2: Recreate Empty Scalable Admin Page Routes

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/dashboard/page.tsx`
- Create: `app/admin/appointments/page.tsx`
- Create: `app/admin/services/page.tsx`
- Create: `app/admin/customers/page.tsx`
- Create: `app/admin/payments/page.tsx`
- Create: `app/admin/reports/page.tsx`
- Create: `app/admin/settings/page.tsx`

- [ ] **Step 1: Create Admin Login Page**
  Write file: `app/admin/login/page.tsx`
  ```tsx
  export default function AdminLoginPage() {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <h1 className="text-xl font-bold">Staff Portal - Login</h1>
      </div>
    );
  }
  ```
- [ ] **Step 2: Create Admin Dashboard Page**
  Write file: `app/admin/dashboard/page.tsx`
  ```tsx
  export default function AdminDashboardPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Dashboard</h1>
      </div>
    );
  }
  ```
- [ ] **Step 3: Create Admin Appointments Page**
  Write file: `app/admin/appointments/page.tsx`
  ```tsx
  export default function AdminAppointmentsPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Appointments</h1>
      </div>
    );
  }
  ```
- [ ] **Step 4: Create Admin Services Page**
  Write file: `app/admin/services/page.tsx`
  ```tsx
  export default function AdminServicesPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Services</h1>
      </div>
    );
  }
  ```
- [ ] **Step 5: Create Admin Customers Page**
  Write file: `app/admin/customers/page.tsx`
  ```tsx
  export default function AdminCustomersPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Customers</h1>
      </div>
    );
  }
  ```
- [ ] **Step 6: Create Admin Payments Page**
  Write file: `app/admin/payments/page.tsx`
  ```tsx
  export default function AdminPaymentsPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Payments</h1>
      </div>
    );
  }
  ```
- [ ] **Step 7: Create Admin Reports Page**
  Write file: `app/admin/reports/page.tsx`
  ```tsx
  export default function AdminReportsPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Reports</h1>
      </div>
    );
  }
  ```
- [ ] **Step 8: Create Admin Settings Page**
  Write file: `app/admin/settings/page.tsx`
  ```tsx
  export default function AdminSettingsPage() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Staff Portal - Settings</h1>
      </div>
    );
  }
  ```
- [ ] **Step 9: Commit the empty routes**
  Run: `git add app/admin && git commit -m "feat: recreate clean minimal empty admin pages"`
  Expected: Clean pages committed.

---

### Task 3: Establish Shared scalable components, utilities, and types directory structure

**Files:**
- Create: `components/shared/.gitkeep`
- Create: `components/tables/.gitkeep`
- Create: `components/layout/.gitkeep`
- Create: `components/features/.gitkeep`
- Create: `lib/constants/.gitkeep`
- Create: `lib/utils/.gitkeep`
- Create: `types/.gitkeep`

- [ ] **Step 1: Create components subdirectories**
  Run:
  ```bash
  mkdir -p components/shared components/tables components/layout components/features
  touch components/shared/.gitkeep components/tables/.gitkeep components/layout/.gitkeep components/features/.gitkeep
  ```
- [ ] **Step 2: Create lib subdirectories**
  Run:
  ```bash
  mkdir -p lib/constants lib/utils
  touch lib/constants/.gitkeep lib/utils/.gitkeep
  ```
- [ ] **Step 3: Create types directory**
  Run:
  ```bash
  mkdir -p types
  touch types/.gitkeep
  ```
- [ ] **Step 4: Commit directory placeholders**
  Run: `git add components/shared components/tables components/layout components/features lib/constants lib/utils types && git commit -m "style: establish empty scalable admin architecture directories"`
  Expected: Clean directories added.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the codebase compiles successfully and that all customer pages and layouts build without errors.
- Command: `npm run build`

### Manual Verification
- Verify that customer routes `/login`, `/booking`, `/profile`, `/services` still function and render properly by running a dev server check or browser test if needed.
