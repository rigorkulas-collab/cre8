# Admin Portal Phase 3 Reports Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the Reports & Analytics core page at `/admin/reports` with a 6-KPI summary stats row, a comprehensive filter bar (Date range, Staff, and Category), and a premium pure-CSS Revenue bar chart.

**Architecture:** Create `app/admin/reports/page.tsx` within the Next.js App Router context. Ensure all filters dynamically update static local mockup states instantaneously without timing loaders, using clean, high-contrast, gold-free Charcoal and Slate tones with zero animation delays.

**Tech Stack:** Next.js, React 19, Tailwind CSS, Lucide React

---

## File Map

- **New**: `app/admin/reports/page.tsx`

---

## Tasks

### Task 1: Create the Reports Route Page with Unified Shell Layout

**Files:**
- Create: `app/admin/reports/page.tsx`

- [ ] **Step 1: Write the initial Next.js Route Page file**
  Implement the brand new Reports view page wrapped in `AdminLayout`, incorporating standard filter states, 6-KPI metrics, a custom pure-CSS Revenue Chart grid, and zero-animation interactive dropdown elements.

  *Complete File Content for `app/admin/reports/page.tsx`:*
  ```tsx
  "use client";

  import React, { useState } from "react";
  import AdminLayout from "@/components/admin/layout/AdminLayout";
  import PageHeader from "@/components/admin/shared/PageHeader";
  import { 
    BarChart3, 
    DollarSign, 
    Calendar, 
    Clock, 
    Users, 
    TrendingUp, 
    RotateCcw, 
    ChevronDown, 
    Printer, 
    Download,
    TrendingDown,
    Award
  } from "lucide-react";

  // Mock static datasets representing the salon operations
  const MOCK_REVENUE_DATA = {
    today: [
      { label: "09:00", value: 12000, bookings: 4 },
      { label: "11:00", value: 24500, bookings: 6 },
      { label: "13:00", value: 18000, bookings: 5 },
      { label: "15:00", value: 32000, bookings: 9 },
      { label: "17:00", value: 41200, bookings: 12 },
      { label: "19:00", value: 26550, bookings: 8 },
    ],
    yesterday: [
      { label: "09:00", value: 9500, bookings: 3 },
      { label: "11:00", value: 18000, bookings: 4 },
      { label: "13:00", value: 22000, bookings: 7 },
      { label: "15:00", value: 28500, bookings: 8 },
      { label: "17:00", value: 36000, bookings: 10 },
      { label: "19:00", value: 24000, bookings: 7 },
    ],
    last7: [
      { label: "Mon", value: 22400, bookings: 8 },
      { label: "Tue", value: 28500, bookings: 10 },
      { label: "Wed", value: 31200, bookings: 11 },
      { label: "Thu", value: 29800, bookings: 9 },
      { label: "Fri", value: 48500, bookings: 16 },
      { label: "Sat", value: 58200, bookings: 19 },
      { label: "Sun", value: 41250, bookings: 13 },
    ],
    last30: [
      { label: "Week 1", value: 154000, bookings: 52 },
      { label: "Week 2", value: 168500, bookings: 58 },
      { label: "Week 3", value: 189200, bookings: 64 },
      { label: "Week 4", value: 212500, bookings: 72 },
    ],
  };

  const MOCK_KPIS = {
    today: [
      { title: "Gross Revenue", value: "₱154,250", change: "+12.4%", isPositive: true, subtext: "vs yesterday", icon: DollarSign },
      { title: "Completed Bookings", value: "512", change: "+8.1%", isPositive: true, subtext: "vs yesterday", icon: Calendar },
      { title: "Average Ticket", value: "₱301.27", change: "+3.9%", isPositive: true, subtext: "vs yesterday", icon: TrendingUp },
      { title: "Occupancy Rate", value: "84.5%", change: "+2.1%", isPositive: true, subtext: "vs yesterday", icon: Clock },
      { title: "Refund Volume", value: "₱1,200", change: "-15.0%", isPositive: true, subtext: "vs yesterday", icon: RotateCcw },
      { title: "Customer Retention", value: "91.2%", change: "+1.8%", isPositive: true, subtext: "vs yesterday", icon: Users },
    ],
    yesterday: [
      { title: "Gross Revenue", value: "₱138,000", change: "-2.4%", isPositive: false, subtext: "vs same day last week", icon: DollarSign },
      { title: "Completed Bookings", value: "480", change: "-1.5%", isPositive: false, subtext: "vs same day last week", icon: Calendar },
      { title: "Average Ticket", value: "₱287.50", change: "+0.8%", isPositive: true, subtext: "vs same day last week", icon: TrendingUp },
      { title: "Occupancy Rate", value: "82.4%", change: "-0.5%", isPositive: false, subtext: "vs same day last week", icon: Clock },
      { title: "Refund Volume", value: "₱2,500", change: "+20.0%", isPositive: false, subtext: "vs same day last week", icon: RotateCcw },
      { title: "Customer Retention", value: "89.4%", change: "+0.5%", isPositive: true, subtext: "vs same day last week", icon: Users },
    ],
    last7: [
      { title: "Gross Revenue", value: "₱1,085,420", change: "+15.8%", isPositive: true, subtext: "vs previous 7 days", icon: DollarSign },
      { title: "Completed Bookings", value: "3,584", change: "+11.2%", isPositive: true, subtext: "vs previous 7 days", icon: Calendar },
      { title: "Average Ticket", value: "₱302.85", change: "+4.1%", isPositive: true, subtext: "vs previous 7 days", icon: TrendingUp },
      { title: "Occupancy Rate", value: "86.2%", change: "+3.5%", isPositive: true, subtext: "vs previous 7 days", icon: Clock },
      { title: "Refund Volume", value: "₱8,400", change: "-8.5%", isPositive: true, subtext: "vs previous 7 days", icon: RotateCcw },
      { title: "Customer Retention", value: "92.0%", change: "+2.2%", isPositive: true, subtext: "vs previous 7 days", icon: Users },
    ],
    last30: [
      { title: "Gross Revenue", value: "₱4,850,910", change: "+18.2%", isPositive: true, subtext: "vs previous 30 days", icon: DollarSign },
      { title: "Completed Bookings", value: "15,820", change: "+14.6%", isPositive: true, subtext: "vs previous 30 days", icon: Calendar },
      { title: "Average Ticket", value: "₱306.63", change: "+3.2%", isPositive: true, subtext: "vs previous 30 days", icon: TrendingUp },
      { title: "Occupancy Rate", value: "87.8%", change: "+4.0%", isPositive: true, subtext: "vs previous 30 days", icon: Clock },
      { title: "Refund Volume", value: "₱32,000", change: "-12.3%", isPositive: true, subtext: "vs previous 30 days", icon: RotateCcw },
      { title: "Customer Retention", value: "93.4%", change: "+2.9%", isPositive: true, subtext: "vs previous 30 days", icon: Users },
    ],
  };

  const STAFF_LIST = ["All Staff Members", "Aria Vance", "Elena Rostova", "Marcus Chen", "Chloe Bennett", "Jordan Taylor"];
  const SERVICE_CATEGORIES = ["All Categories", "Haircuts", "Nail Spa", "Massages", "Facials & Esthetics", "Hair Treatments"];

  export default function ReportsPage() {
    const [dateRange, setDateRange] = useState<"today" | "yesterday" | "last7" | "last30">("last7");
    const [selectedStaff, setSelectedStaff] = useState("All Staff Members");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Dynamic computations based on current state parameters
    const activeKPIs = MOCK_KPIS[dateRange];
    const chartData = MOCK_REVENUE_DATA[dateRange];
    const totalSelectedPeriodRevenue = chartData.reduce((acc, curr) => acc + curr.value, 0);

    const getFormattedDateLabel = () => {
      switch (dateRange) {
        case "today": return "Today (Real-time feeds)";
        case "yesterday": return "Yesterday";
        case "last7": return "Last 7 Days (Default)";
        case "last30": return "Last 30 Days";
      }
    };

    return (
      <AdminLayout>
        {/* Header Section */}
        <PageHeader 
          title="Reports & System Analytics" 
          description="High-fidelity operational trends, revenue distribution indicators, and staff benchmarks."
          actions={
            <div className="flex items-center gap-2 select-none">
              <button 
                onClick={() => alert("Simulation: Preparing print preview matrix...")}
                className="h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5 text-gray-500" />
                <span>Print Canvas</span>
              </button>
              <button 
                onClick={() => alert("Simulation: Commencing secure XLS schema download...")}
                className="h-9 px-3.5 rounded-xl bg-gray-900 hover:bg-black text-xs font-bold text-white flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          }
        />

        {/* FilterBar Grid Section */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between select-none">
          {/* Quick Date Range Buttons Group */}
          <div className="flex items-center border border-gray-200 rounded-xl p-0.5 bg-gray-50/50 w-full sm:w-auto overflow-x-auto">
            {(["today", "yesterday", "last7", "last30"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`h-8 px-4 rounded-lg text-xs font-bold capitalize cursor-pointer shrink-0 ${
                  dateRange === range
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {range === "last7" ? "7 Days" : range === "last30" ? "30 Days" : range}
              </button>
            ))}
          </div>

          {/* Operational Dropdown Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Staff Dropdown Filter */}
            <div className="relative w-full sm:w-48">
              <button
                onClick={() => {
                  setIsStaffDropdownOpen(!isStaffDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                }}
                className="h-9 w-full px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{selectedStaff}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>
              {isStaffDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStaffDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 text-left max-h-48 overflow-y-auto">
                    {STAFF_LIST.map((staff) => (
                      <button
                        key={staff}
                        onClick={() => {
                          setSelectedStaff(staff);
                          setIsStaffDropdownOpen(false);
                        }}
                        className={`w-full h-8 px-2.5 rounded-lg text-xs font-bold text-left cursor-pointer ${
                          selectedStaff === staff 
                            ? "bg-gray-900 text-white" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {staff}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Service Category Dropdown Filter */}
            <div className="relative w-full sm:w-48">
              <button
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsStaffDropdownOpen(false);
                }}
                className="h-9 w-full px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>
              {isCategoryDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 text-left max-h-48 overflow-y-auto">
                    {SERVICE_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full h-8 px-2.5 rounded-lg text-xs font-bold text-left cursor-pointer ${
                          selectedCategory === category 
                            ? "bg-gray-900 text-white" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 6-KPI Modern Summary Grid Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 select-none">
          {activeKPIs.map((kpi, idx) => {
            const IconComponent = kpi.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-xs"
              >
                {/* Header Item */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{kpi.title}</span>
                  <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <IconComponent className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </div>

                {/* Values Block */}
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-lg font-black text-gray-900 tracking-tight">{kpi.value}</span>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className={`text-[10px] font-extrabold flex items-center gap-0.5 ${kpi.isPositive ? "text-emerald-600" : "text-red-500"}`}>
                      {kpi.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {kpi.change}
                    </span>
                    <span className="text-[9px] font-semibold text-gray-400">{kpi.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Revenue Grid: Pure-CSS Chart Card */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-6 shadow-xs select-none">
          {/* Chart Card Title Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-gray-900 tracking-tight">Revenue Operations Trend</span>
              <span className="text-xs font-semibold text-gray-400 mt-0.5">
                Summary details compiled for {getFormattedDateLabel()}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-left">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accumulated Sales</span>
                <span className="text-base font-black text-emerald-600">₱{totalSelectedPeriodRevenue.toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Channel Status</span>
                <span className="text-xs font-bold text-gray-900">100% Verified Ledger</span>
              </div>
            </div>
          </div>

          {/* Core Pure CSS Bar Chart Visualisation Canvas */}
          <div className="w-full flex flex-col gap-4">
            {/* Chart Grid Bars Columns Area */}
            <div className="w-full h-64 border-b border-gray-200 relative flex items-end justify-between px-2 pt-6">
              {/* Horizontal Background Support Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none z-0">
                <div className="w-full border-t border-dashed border-gray-100 pt-0.5 text-[8px] font-black text-gray-300">MAX</div>
                <div className="w-full border-t border-dashed border-gray-100 pt-0.5 text-[8px] font-black text-gray-300">50%</div>
                <div className="w-full z-0" />
              </div>

              {/* Dynamically Styled Rendered Column Bars */}
              {chartData.map((data, idx) => {
                // Compute height percentage using max val to ensure layout bounds consistency
                const maxVal = Math.max(...chartData.map(d => d.value));
                const heightPercent = maxVal > 0 ? (data.value / maxVal) * 85 : 0; // Caps at 85% for top labels spacing

                return (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-col items-center justify-end h-full relative group/bar z-10 px-2 sm:px-4"
                  >
                    {/* Hover Value Tooltip Indicator (Pure-CSS instant display) */}
                    <div className="absolute bottom-full mb-1 opacity-0 pointer-events-none group-hover/bar:opacity-100 group-hover/bar:pointer-events-auto bg-gray-900 text-white rounded-lg p-2 flex flex-col gap-0.5 text-center min-w-28 shadow-lg z-30 select-none">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Transactions Value</span>
                      <span className="text-xs font-black text-emerald-400">₱{data.value.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-white mt-0.5">{data.bookings} Appointments</span>
                    </div>

                    {/* Aligned Bar Column */}
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-t-lg bg-gray-900 hover:bg-slate-700 cursor-pointer relative flex flex-col justify-end"
                    >
                      {/* Sub-label visible on the top of the bar */}
                      <span className="absolute -top-5 w-full text-center text-[9px] font-black text-gray-900">
                        ₱{(data.value / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart X-Axis Labels Row */}
            <div className="w-full flex items-center justify-between px-2 text-center text-[10px] font-bold text-gray-400 select-none">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1">
                  {data.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  ```

---

## Verification Plan

### Automated Compilation Check
- Run local development compilation command to confirm zero TS or bundler errors in the new reports endpoint.
- Run: `npm run build` in the terminal to verify syntax validity.
