# Premium Desktop Salon Operations Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a modern, desktop-optimized, content-rich, and unified Admin & Staff Dashboard for CRE8 Salon Studio operations without any database or backend dependencies, using premium, gold-free typography and clean `bg-white` styling.

**Architecture:** Split dashboard components modularly by separating layout wrappers (`AdminLayout`, `AdminSidebar`, `AdminTopbar`) from functional dashboard panels (`StatsCard`, `AppointmentTable`, `RealtimeTracker`, `ServiceAnalyticsCard`, `ActivityFeed`, `QuickActionCard`). All layouts use unified borders (`border-[#E5E7EB]`) and standard weights (`font-bold`).

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, Radix UI Primitives.

---

## User Review Required

Document anything that requires user review or feedback.
> [!IMPORTANT]
> The admin portal fully adopts the **Gold-Free Neutral Palette** and matches the **Pure White Customer Background** (`bg-white`) for absolute brand consistency across both sides of the application.

## Proposed Changes

We will create new components inside `components/admin/layout/`, `components/admin/dashboard/`, `components/admin/tables/`, and `components/admin/shared/`, then assemble them in `app/admin/dashboard/page.tsx`.

---

### Component 1: Shared UI Primitives

#### [NEW] [PageHeader.tsx](file:///home/zachary/Desktop/cre8/components/admin/shared/PageHeader.tsx)
Renders page headers with clean text size and action slots.
```tsx
"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm font-medium text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
```

#### [NEW] [EmptyState.tsx](file:///home/zachary/Desktop/cre8/components/admin/shared/EmptyState.tsx)
Provides a fallback view for search or filter operations yielding zero matches.
```tsx
"use client";

import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = "No results found", 
  description = "Try adjusting your filters or search terms." 
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50/50">
      <Inbox className="w-10 h-10 text-gray-400 mb-3" />
      <h3 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-500 font-medium mt-1 max-w-xs">{description}</p>
    </div>
  );
}
```

---

### Component 2: Layout Infrastructure

#### [NEW] [AdminSidebar.tsx](file:///home/zachary/Desktop/cre8/components/admin/layout/AdminSidebar.tsx)
Sleek, fixed vertical sidebar housing studio branding, active route highlighting, and admin logout controls.
```tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scissors, LayoutDashboard, Calendar, Sparkles, Users, Clock, DollarSign, BarChart3, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Staff Schedule", href: "/admin/schedule", icon: Clock },
  { label: "Payments", href: "/admin/payments", icon: DollarSign },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Promotions", href: "/admin/promotions", icon: Sparkles },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 border-r border-[#E5E7EB] h-screen bg-white sticky top-0 flex flex-col justify-between select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="h-20 px-6 border-b border-[#E5E7EB] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-md">
          <Scissors className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-gray-900">CRE8 Studio</span>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Flagship Portal</span>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href === "/admin/dashboard" ? "/admin/dashboard" : "#"}
              onClick={(e) => {
                if (item.href !== "/admin/dashboard") {
                  e.preventDefault();
                  alert(`Navigating to ${item.label} management grid... (Mock feature)`);
                }
              }}
              className={cn(
                "h-10 px-3.5 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer",
                isActive 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-[#E5E7EB] flex flex-col gap-3 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs border border-[#E5E7EB]">
            AC
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
              Admin Concierge
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <span className="text-[10px] font-semibold text-gray-500">System Administrator</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to log out of the flagship management session?")) {
              router.push("/admin/login");
            }
          }}
          className="h-10 w-full px-3.5 rounded-xl border border-red-200 bg-red-50/50 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Session</span>
        </button>
      </div>
    </aside>
  );
}
```

#### [NEW] [AdminTopbar.tsx](file:///home/zachary/Desktop/cre8/components/admin/layout/AdminTopbar.tsx)
Topbar managing searches, dynamic dates, notifications, and profile menus.
```tsx
"use client";

import React, { useState } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface AdminTopbarProps {
  onSearch?: (term: string) => void;
}

export default function AdminTopbar({ onSearch }: AdminTopbarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header className="h-20 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search bookings, customers, services..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] text-xs font-medium placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
        />
      </div>

      {/* Utilities Container */}
      <div className="flex items-center gap-6">
        {/* Dynamic Date display */}
        <span className="hidden md:inline text-xs font-semibold text-gray-500">
          Sunday, May 17, 2026
        </span>

        {/* Notifications Icon Button */}
        <button 
          onClick={() => alert("Simulation: You have no unread operational alerts.")}
          className="w-10 h-10 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs border border-[#E5E7EB]">
                AC
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900">Admin Concierge</span>
                <span className="text-[10px] font-semibold text-emerald-600">Online</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-[#E5E7EB] shadow-lg p-1">
            <DropdownMenuLabel className="text-xs font-bold text-gray-900 px-3 py-2">Flagship Concierge</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5E7EB]" />
            <DropdownMenuItem 
              onClick={() => alert("Profile Modal: Zachary Crest (Flagship Concierge)")}
              className="text-xs font-semibold text-gray-700 hover:text-gray-900 rounded-lg py-2"
            >
              <User className="w-3.5 h-3.5 mr-2" />
              <span>Admin Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => alert("Settings Modal: Routing to global system configuration...")}
              className="text-xs font-semibold text-gray-700 hover:text-gray-900 rounded-lg py-2"
            >
              <Settings className="w-3.5 h-3.5 mr-2" />
              <span>System Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E5E7EB]" />
            <DropdownMenuItem 
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  window.location.href = "/admin/login";
                }
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg py-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              <span>Log Out of Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

#### [NEW] [AdminLayout.tsx](file:///home/zachary/Desktop/cre8/components/admin/layout/AdminLayout.tsx)
Core desktop shell organizing sidebar, sticky topbar, and scrollable content workspace.
```tsx
"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  onSearch?: (term: string) => void;
}

export default function AdminLayout({ children, onSearch }: AdminLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900 antialiased selection:bg-gray-900 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

### Component 3: Dashboard Widgets & Cards

#### [NEW] [StatsCard.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/StatsCard.tsx)
Renders a dashboard KPI indicator complete with soft-hover effects, trends, and neutral borders.
```tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: string;
  isPositive?: boolean;
  colorClass?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  isPositive = true,
  colorClass = "bg-gray-50 text-gray-900"
}: StatsCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 shadow-xs border-[#E5E7EB] hover:shadow-md hover:border-gray-300 transition-all duration-300 group cursor-pointer bg-white rounded-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={cn("p-2.5 rounded-xl transition-colors duration-300", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold tracking-tight text-gray-900 group-hover:text-black transition-colors">{value}</span>
        <span className={cn(
          "text-xs font-bold mt-1 flex items-center gap-1",
          isPositive ? "text-emerald-600" : "text-red-600"
        )}>
          {change}
        </span>
      </div>
    </Card>
  );
}
```

#### [NEW] [StatusBadge.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/StatusBadge.tsx)
Visual pill badge for appointment tracking statuses, matching the core aesthetics perfectly.
```tsx
"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export type AppointmentStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={cn("px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider shrink-0 border", getColors())}>
      {status}
    </Badge>
  );
}
```

#### [NEW] [QuickActionCard.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/QuickActionCard.tsx)
Displays functional quick action cards for high-speed workspace command execution.
```tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function QuickActionCard({ title, description, icon: Icon, onClick }: QuickActionProps) {
  return (
    <Card 
      onClick={onClick}
      className="p-5 flex items-start gap-4 border-[#E5E7EB] hover:border-gray-900 hover:shadow-sm cursor-pointer transition-all duration-300 bg-white rounded-2xl group"
    >
      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300 text-gray-900 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <span className="text-sm font-bold text-gray-900 tracking-tight">{title}</span>
        <span className="text-xs text-gray-500 font-medium leading-relaxed">{description}</span>
      </div>
    </Card>
  );
}
```

#### [NEW] [ServiceAnalyticsCard.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/ServiceAnalyticsCard.tsx)
Progress bar tracking service metrics and booking distribution.
```tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/progress";

interface ServiceData {
  name: string;
  count: number;
  revenue: string;
  percentage: number;
}

interface ServiceAnalyticsCardProps {
  services: ServiceData[];
}

export default function ServiceAnalyticsCard({ services }: ServiceAnalyticsCardProps) {
  return (
    <Card className="p-6 border-[#E5E7EB] bg-white rounded-2xl flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Top Treatments</h3>
        <p className="text-[11px] text-gray-500 font-semibold">Treatments by booking demand and performance</p>
      </div>

      <div className="flex flex-col gap-5">
        {services.map((svc) => (
          <div key={svc.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-800">{svc.name}</span>
              <div className="flex items-center gap-3 text-gray-900">
                <span>{svc.count} books</span>
                <span className="text-gray-400 font-semibold">•</span>
                <span>{svc.revenue}</span>
              </div>
            </div>
            <Progress value={svc.percentage} className="h-2 bg-gray-100 rounded-full [&>div]:bg-gray-900" />
          </div>
        ))}
      </div>
    </Card>
  );
}
```

#### [NEW] [RealtimeTracker.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/RealtimeTracker.tsx)
Dynamic operational timeline showing active, upcoming, and recently completed guest transactions.
```tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Clock, CheckCircle2, Play } from "lucide-react";
import StatusBadge, { AppointmentStatus } from "./StatusBadge";

interface TimelineEvent {
  id: number;
  time: string;
  customerName: string;
  service: string;
  status: AppointmentStatus;
}

interface RealtimeTrackerProps {
  events: TimelineEvent[];
}

export default function RealtimeTracker({ events }: RealtimeTrackerProps) {
  const getTimelineIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "In Progress":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 relative">
            <Play className="w-3.5 h-3.5 ml-0.5 fill-purple-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          </div>
        );
      case "Completed":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-200">
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <Card className="p-6 border-[#E5E7EB] bg-white rounded-2xl flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Real-Time Studio Tracker</h3>
        <p className="text-[11px] text-gray-500 font-semibold">Active, upcoming, and recently completed transactions</p>
      </div>

      <div className="relative pl-6 border-l border-gray-100 flex flex-col gap-6">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-4">
            {/* Absolute positioning matching the border-l line */}
            <div className="absolute -left-10 top-0.5 bg-white py-1">
              {getTimelineIcon(evt.status)}
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 tracking-tight">{evt.customerName}</span>
                <span className="text-[11px] font-semibold text-gray-500 mt-0.5">{evt.service} • {evt.time}</span>
              </div>
              <StatusBadge status={evt.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

#### [NEW] [ActivityFeed.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/ActivityFeed.tsx)
Sleek chronological operation log displaying new bookings, registrations, and payment events.
```tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { PlusCircle, CheckCircle2, UserPlus, CreditCard } from "lucide-react";

interface Activity {
  id: number;
  type: "booking" | "completed" | "register" | "payment";
  content: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "booking":
        return <PlusCircle className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "register":
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <Card className="p-6 border-[#E5E7EB] bg-white rounded-2xl flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Recent Activity Feed</h3>
        <p className="text-[11px] text-gray-500 font-semibold">Latest updates across scheduling and finances</p>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3.5">
            <div className="p-2 bg-gray-50 rounded-xl text-gray-900 shrink-0">
              {getActivityIcon(act.type)}
            </div>
            <div className="flex-1 flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 leading-relaxed">{act.content}</span>
              <span className="text-[10px] font-semibold text-gray-400 mt-1">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

### Component 4: Table Implementation

#### [NEW] [AppointmentTable.tsx](file:///home/zachary/Desktop/cre8/components/admin/tables/AppointmentTable.tsx)
Completely interactive data grids displaying today's appointments, supporting filtering and searching.
```tsx
"use client";

import React from "react";
import StatusBadge, { AppointmentStatus } from "../dashboard/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { MoreHorizontal, Search, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export interface Appointment {
  id: string;
  customerName: string;
  service: string;
  staffAssigned: string;
  time: string;
  status: AppointmentStatus;
}

interface AppointmentTableProps {
  appointments: Appointment[];
  onAction?: (action: string, appointment: Appointment) => void;
}

export default function AppointmentTable({ appointments, onAction }: AppointmentTableProps) {
  if (appointments.length === 0) {
    return <EmptyState title="No appointments scheduled" description="There are no appointments registered that match your criteria." />;
  }

  return (
    <div className="w-full border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E7EB] text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
              <th className="py-4 px-6">Customer Name</th>
              <th className="py-4 px-6">Service</th>
              <th className="py-4 px-6">Staff Assigned</th>
              <th className="py-4 px-6">Time</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-700">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="py-4.5 px-6 font-bold text-gray-900">{apt.customerName}</td>
                <td className="py-4.5 px-6">{apt.service}</td>
                <td className="py-4.5 px-6">{apt.staffAssigned}</td>
                <td className="py-4.5 px-6 font-bold text-gray-900">{apt.time}</td>
                <td className="py-4.5 px-6">
                  <StatusBadge status={apt.status} />
                </td>
                <td className="py-4.5 px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl border-[#E5E7EB] shadow-lg p-1">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => onAction && onAction("view", apt)}
                        className="text-xs font-semibold text-gray-700 hover:text-gray-900 rounded-lg py-2"
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#E5E7EB]" />
                      <DropdownMenuItem 
                        onClick={() => onAction && onAction("delete", apt)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg py-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        <span>Cancel Booking</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### Component 5: Page Architecture

#### [NEW] [page.tsx](file:///home/zachary/Desktop/cre8/app/admin/dashboard/page.tsx)
The main orchestration page importing layout, state, filtering logic, and details dialogs.
```tsx
"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import QuickActionCard from "@/components/admin/dashboard/QuickActionCard";
import ServiceAnalyticsCard from "@/components/admin/dashboard/ServiceAnalyticsCard";
import RealtimeTracker from "@/components/admin/dashboard/RealtimeTracker";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import AppointmentTable, { Appointment } from "@/components/admin/tables/AppointmentTable";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  PlusCircle, 
  UserPlus, 
  Sparkles, 
  BarChart3,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "lucide-react";

// Robust Mock Data Sets
const INITIAL_STATS = [
  { title: "Total Appointments", value: "42", icon: Calendar, change: "+12% vs last Sunday", isPositive: true, colorClass: "bg-blue-50 text-blue-600 border border-blue-100" },
  { title: "Pending Bookings", value: "8", icon: Clock, change: "Requires confirmation", isPositive: false, colorClass: "bg-amber-50 text-amber-600 border border-amber-100" },
  { title: "Total Revenue", value: "₱142,500", icon: DollarSign, change: "94% of daily target", isPositive: true, colorClass: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  { title: "Active Customers", value: "1,894", icon: Users, change: "+8 registrations today", isPositive: true, colorClass: "bg-purple-50 text-purple-600 border border-purple-100" },
];

const INITIAL_SERVICES = [
  { name: "Signature Haircut", count: 18, revenue: "₱9,000", percentage: 75 },
  { name: "Balayage Color Sculpt", count: 12, revenue: "₱30,000", percentage: 55 },
  { name: "Acupressure Scalp Therapy", count: 8, revenue: "₱6,800", percentage: 40 },
  { name: "Luxe Shellac Manicure", count: 4, revenue: "₱2,400", percentage: 20 },
];

const INITIAL_TIMELINE = [
  { id: 1, time: "10:30 AM (Active)", customerName: "Evelyn Carter", service: "Balayage & Hair Treatment", status: "In Progress" as const },
  { id: 2, time: "11:15 AM (Next Up)", customerName: "Julian Vance", service: "Signature Haircut & Beard Sculpt", status: "Confirmed" as const },
  { id: 3, time: "10:00 AM (Finished)", customerName: "Clara Reynolds", service: "Acupressure Scalp Therapy", status: "Completed" as const },
];

const INITIAL_ACTIVITIES = [
  { id: 1, type: "booking" as const, content: "New booking registered by Clara Reynolds", time: "12 mins ago" },
  { id: 2, type: "completed" as const, content: "Balayage treatment completed for Evelyn Carter", time: "45 mins ago" },
  { id: 3, type: "register" as const, content: "Julian Vance registered a new profile", time: "1 hour ago" },
  { id: 4, type: "payment" as const, content: "Payment verified for transaction ID #49281", time: "2 hours ago" },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "APT-001", customerName: "Clara Reynolds", service: "Acupressure Scalp Therapy", staffAssigned: "Marcus Rivera", time: "10:00 AM", status: "Completed" },
  { id: "APT-002", customerName: "Evelyn Carter", service: "Balayage & Hair Treatment", staffAssigned: "Dianne Gomez", time: "10:30 AM", status: "In Progress" },
  { id: "APT-003", customerName: "Julian Vance", service: "Signature Haircut & Beard Sculpt", staffAssigned: "Marcus Rivera", time: "11:15 AM", status: "Confirmed" },
  { id: "APT-004", customerName: "Oliver Reed", service: "Signature Haircut", staffAssigned: "Sarah Jenkins", time: "12:00 PM", status: "Pending" },
  { id: "APT-005", customerName: "Sophia Thorne", service: "Luxe Shellac Manicure", staffAssigned: "Elena Velez", time: "01:30 PM", status: "Confirmed" },
  { id: "APT-006", customerName: "Liam Sterling", service: "Deep Charcoal Facial", staffAssigned: "Elena Velez", time: "02:15 PM", status: "Cancelled" },
];

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selected Detail Modal State
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // Quick Action State simulation
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "booking":
        alert("Simulating administrative walkthrough: opening New Appointment creation slider...");
        break;
      case "customer":
        alert("Simulating administrative walkthrough: adding customer database profile...");
        break;
      case "service":
        alert("Simulating administrative walkthrough: launching catalog additions...");
        break;
      case "reports":
        alert("Simulating administrative walkthrough: compiling daily business diagnostics...");
        break;
    }
  };

  // Search & Filter orchestration
  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleTableAction = (action: string, apt: Appointment) => {
    if (action === "view") {
      setSelectedApt(apt);
    } else if (action === "delete") {
      if (confirm(`Are you sure you want to cancel the appointment for ${apt.customerName}?`)) {
        setAppointments(appointments.map(item => item.id === apt.id ? { ...item, status: "Cancelled" as const } : item));
      }
    }
  };

  // Compute filtered listings
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm) || 
                          apt.service.toLowerCase().includes(searchTerm) || 
                          apt.staffAssigned.toLowerCase().includes(searchTerm);
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && apt.status.toLowerCase() === activeTab;
  });

  return (
    <AdminLayout onSearch={handleSearch}>
      {/* Page Header Actions */}
      <PageHeader 
        title="Executive Operations Overview" 
        description="Live operational metrics, active bookings, and financials for today"
        actions={
          <Button 
            onClick={() => handleQuickAction("booking")}
            className="h-11 px-5 rounded-xl font-bold bg-gray-900 hover:bg-black text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Appointment</span>
          </Button>
        }
      />

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {INITIAL_STATS.map((stat) => (
          <StatsCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            isPositive={stat.isPositive}
            colorClass={stat.colorClass}
          />
        ))}
      </div>

      {/* Primary Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Operations & Tables */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Today's Appointments Workspace */}
          <Card className="p-6 border-[#E5E7EB] bg-white rounded-2xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Today's Appointment Schedule</h3>
                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Filter, coordinate, and supervise client reservations</p>
              </div>

              {/* Status Tab Navigation */}
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 w-fit self-start sm:self-auto">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === tab 
                        ? "bg-white text-gray-900 shadow-xs border border-gray-200" 
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Data Table */}
            <AppointmentTable 
              appointments={filteredAppointments} 
              onAction={handleTableAction} 
            />
          </Card>

          {/* Quick Actions Control Panel */}
          <div className="flex flex-col gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Operational Quick Actions</h3>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">High-speed workspace management commands</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard 
                title="Create Booking" 
                description="Coordinate new walk-in client schedules" 
                icon={PlusCircle} 
                onClick={() => handleQuickAction("booking")} 
              />
              <QuickActionCard 
                title="Add Customer" 
                description="Register fresh client profiles" 
                icon={UserPlus} 
                onClick={() => handleQuickAction("customer")} 
              />
              <QuickActionCard 
                title="Add Service" 
                description="Launch catalogs & treatments" 
                icon={Sparkles} 
                onClick={() => handleQuickAction("service")} 
              />
              <QuickActionCard 
                title="View Diagnostics" 
                description="Compile business & financial reports" 
                icon={BarChart3} 
                onClick={() => handleQuickAction("reports")} 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Operations Feeds */}
        <div className="flex flex-col gap-8">
          {/* Live Timeline Tracker */}
          <RealtimeTracker events={INITIAL_TIMELINE} />

          {/* Top Services Performance */}
          <ServiceAnalyticsCard services={INITIAL_SERVICES} />

          {/* Operation Activity Log */}
          <ActivityFeed activities={INITIAL_ACTIVITIES} />
        </div>
      </div>

      {/* high-fidelity detailed appointment overlay dialog */}
      {selectedApt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Appointment Summary</span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{selectedApt.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedApt(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-900 border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 cursor-pointer bg-white"
              >
                Close Summary
              </button>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client Name</span>
                  <span className="text-sm font-bold text-gray-900">{selectedApt.customerName}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Stylist</span>
                  <span className="text-sm font-bold text-gray-900">{selectedApt.staffAssigned}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Treatment</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedApt.service}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled Time</span>
                  <span className="text-sm font-bold text-gray-900">{selectedApt.time}</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Indicators</span>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    selectedApt.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    selectedApt.status === "Confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    selectedApt.status === "In Progress" ? "bg-purple-50 text-purple-700 border-purple-200" :
                    selectedApt.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {selectedApt.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
