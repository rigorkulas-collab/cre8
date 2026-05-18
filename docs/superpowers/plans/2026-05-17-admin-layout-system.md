# Admin Layout System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-fidelity, premium, responsive Admin Layout System (`AdminLayout`, `AdminSidebar`, `AdminTopbar`, `AdminContent`) in `components/layout/` as the visual and structural foundation of all salon admin pages.

**Architecture:** Build a flexible, responsive layout system using React state to manage mobile sidebar toggling. Implement a desktop-fixed sidebar, a sticky topbar with path-based dynamic header titles, and a smooth main content scroll pane with fade-in micro-animations.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Radix UI.

---

## User Review Required

> [!IMPORTANT]
> - **Theme Coordination:** The sidebar will use a premium "Charcoal Lux" dark aesthetics palette (`#111827` to `#1F2937`) to make it feel extremely executive and state-of-the-art, contrasting beautifully with the clean gold-accented light-mode content pages.
> - **Dynamic Page Titles:** The Topbar will automatically parse the browser URL pathname using Next.js `usePathname()` to display the current active section title in a clean premium header font.

## Open Questions

> [!NOTE]
> There are no remaining open questions. The requirements call for building the layout components inside `components/layout/`.

---

## Proposed Changes

### [Admin Layout Components]

- `components/layout/AdminSidebar.tsx` [NEW]
- `components/layout/AdminTopbar.tsx` [NEW]
- `components/layout/AdminContent.tsx` [NEW]
- `components/layout/AdminLayout.tsx` [NEW]

---

## Task List

### Task 1: Create AdminSidebar Component

**Files:**
- Create: `components/layout/AdminSidebar.tsx`

- [ ] **Step 1: Write AdminSidebar component file**
  Create `components/layout/AdminSidebar.tsx` with premium dark mode aesthetic, full navigation menu list with matching icons, active state detection via `usePathname`, and a collapsible mobile interface.
  ```tsx
  "use client";

  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { 
    LayoutDashboard, 
    Calendar, 
    Scissors, 
    Users, 
    CreditCard, 
    BarChart3, 
    Settings, 
    X,
    Sparkles
  } from "lucide-react";
  import { cn } from "@/lib/utils";

  interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Sidebar Container */}
        <aside className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-gray-200 border-r border-[#1F2937] transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Sidebar Header / Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-[#1F2937]">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D1BFA7] text-[#111827]">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white">CRE8 <span className="text-xs font-normal text-[#D1BFA7]">STAFF</span></span>
            </Link>
            <button 
              className="lg:hidden rounded-md p-1.5 hover:bg-[#1F2937] text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-[#D1BFA7] text-[#111827] shadow-md shadow-[#D1BFA7]/10" 
                      : "text-gray-400 hover:bg-[#1F2937] hover:text-gray-100"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive ? "text-[#111827]" : "text-gray-400 group-hover:text-gray-200"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer User Info */}
          <div className="border-t border-[#1F2937] p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#1F2937] flex items-center justify-center border border-[#D1BFA7]/30 text-[#D1BFA7] font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@salon.com</p>
            </div>
          </div>
        </aside>
      </>
    );
  }
  ```

---

### Task 2: Create AdminTopbar Component

**Files:**
- Create: `components/layout/AdminTopbar.tsx`

- [ ] **Step 1: Write AdminTopbar component file**
  Create `components/layout/AdminTopbar.tsx` with dynamic page title parsing, sidebar toggle button, and modular header UI.
  ```tsx
  "use client";

  import { usePathname } from "next/navigation";
  import { Menu, Bell, Search, LogOut } from "lucide-react";
  import Link from "next/link";

  interface AdminTopbarProps {
    onMenuClick: () => void;
  }

  export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
    const pathname = usePathname();

    // Map Pathname to clean Title
    const getPageTitle = (path: string) => {
      const segment = path.split("/").pop() || "";
      if (!segment || segment === "admin") return "Dashboard";
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    return (
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e5e7eb] bg-white px-6 shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 lg:text-2xl">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Minimal Search bar (Mock) */}
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="search"
              placeholder="Search appointments..."
              className="w-60 rounded-full border border-gray-200 py-1.5 pl-9 pr-4 text-xs focus:border-[#D1BFA7] focus:ring-1 focus:ring-[#D1BFA7] focus:outline-none transition-all duration-200 bg-gray-50/50"
            />
          </div>

          {/* Alerts Bell (Mock) */}
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Quick Logout Button */}
          <Link
            href="/login"
            className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            title="Log Out Staff"
          >
            <LogOut className="h-5 w-5" />
          </Link>
        </div>
      </header>
    );
  }
  ```

---

### Task 3: Create AdminContent Component

**Files:**
- Create: `components/layout/AdminContent.tsx`

- [ ] **Step 1: Write AdminContent component file**
  Create `components/layout/AdminContent.tsx` with responsive layout padding and elegant fade-in transition animation.
  ```tsx
  "use client";

  interface AdminContentProps {
    children: React.ReactNode;
  }

  export default function AdminContent({ children }: AdminContentProps) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50/40 p-6 animate-fade-in">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    );
  }
  ```

---

### Task 4: Create AdminLayout Component

**Files:**
- Create: `components/layout/AdminLayout.tsx`

- [ ] **Step 1: Write AdminLayout component file**
  Create `components/layout/AdminLayout.tsx` which integrates `AdminSidebar`, `AdminTopbar`, and `AdminContent` with responsive layout wrapper state.
  ```tsx
  "use client";

  import React, { useState } from "react";
  import AdminSidebar from "./AdminSidebar";
  import AdminTopbar from "./AdminTopbar";
  import AdminContent from "./AdminContent";

  interface AdminLayoutProps {
    children: React.ReactNode;
  }

  export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
      <div className="min-h-screen bg-white">
        {/* Sidebar Component */}
        <AdminSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />

        {/* Right main pane */}
        <div className="flex flex-col min-h-screen lg:pl-64">
          <AdminTopbar 
            onMenuClick={() => setIsMobileSidebarOpen(true)} 
          />
          <AdminContent>
            {children}
          </AdminContent>
        </div>
      </div>
    );
  }
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the codebase compiles successfully and that all layout components build without errors.
- Command: `npm run build`

### Manual Verification
- We will double-check that the files are properly generated in `components/layout/` and imported without TypeScript issues.
