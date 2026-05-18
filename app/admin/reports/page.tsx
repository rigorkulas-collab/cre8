"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Drawer from "@/components/shared/Drawer";
import TableToolbar from "@/components/tables/TableToolbar";
import { 
  TrendingUp, 
  Layers, 
  Users, 
  Award, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Calendar 
} from "lucide-react";

interface ReportLog {
  id: string;
  title: string;
  scope: "Revenue" | "Bookings" | "Stylist Output" | "Inventory";
  date: string;
  status: "completed" | "pending" | "failed";
  format: "PDF" | "CSV";
  size: string;
  notes?: string;
}

const initialReports: ReportLog[] = [
  { id: "REP-201", title: "Monthly Revenue Summary - April 2026", scope: "Revenue", date: "May 01, 2026", status: "completed", format: "PDF", size: "1.4 MB", notes: "Standard gross/net breakdown including VAT reconciliations and GCash gateway processing margins." },
  { id: "REP-202", title: "Q1 Stylist Productivity Report", scope: "Stylist Output", date: "April 15, 2026", status: "completed", format: "PDF", size: "2.8 MB", notes: "Individual utilization logs, client retention metrics, and average tip summaries per stylist." },
  { id: "REP-203", title: "GCash/Maya Transaction Audit Log", scope: "Revenue", date: "April 10, 2026", status: "completed", format: "CSV", size: "640 KB", notes: "Raw transactional data sheet mapped by custom transaction reference tokens." },
  { id: "REP-204", title: "Nails & Facial Category Growth", scope: "Bookings", date: "April 05, 2026", status: "completed", format: "PDF", size: "980 KB", notes: "Comparison of non-hair service category logs and seasonal packages uplift ratios." },
  { id: "REP-205", title: "Weekly Settlement Reconciliation", scope: "Revenue", date: "Today, 09:00 AM", status: "pending", format: "CSV", size: "0 KB", notes: "Automated standard clearing verification report." }
];

const monthlyRevenueData = [
  { month: "Jun", amount: "₱125,000", height: "52%" },
  { month: "Jul", amount: "₱138,000", height: "60%" },
  { month: "Aug", amount: "₱130,500", height: "55%" },
  { month: "Sep", amount: "₱145,000", height: "65%" },
  { month: "Oct", amount: "₱152,000", height: "68%" },
  { month: "Nov", amount: "₱168,000", height: "78%" },
  { month: "Dec", amount: "₱210,000", height: "100%" },
  { month: "Jan", amount: "₱142,000", height: "62%" },
  { month: "Feb", amount: "₱158,000", height: "72%" },
  { month: "Mar", amount: "₱175,000", height: "82%" },
  { month: "Apr", amount: "₱186,400", height: "90%" },
  { month: "May", amount: "₱24,650", height: "15%" }
];

const stylistOutputs = [
  { name: "Elena Rostova", bookings: 48, revenue: "₱64,800", percentage: "90%", color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.25)]" },
  { name: "David Miller", bookings: 42, revenue: "₱51,200", percentage: "80%", color: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)]" },
  { name: "Sarah Jenkins", bookings: 36, revenue: "₱32,450", percentage: "65%", color: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.25)]" },
  { name: "Taylor Cruz", bookings: 22, revenue: "₱38,000", percentage: "40%", color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)]" }
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportLog[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState("All");
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Drawer States
  const [selectedReport, setSelectedReport] = useState<ReportLog | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Form States
  const [formTitle, setFormTitle] = useState("");
  const [formScope, setFormScope] = useState<"Revenue" | "Bookings" | "Stylist Output" | "Inventory">("Revenue");
  const [formRange, setFormRange] = useState("Last 30 Days");
  const [formFormat, setFormFormat] = useState<"PDF" | "CSV">("PDF");
  const [formNotes, setFormNotes] = useState("");

  // Table columns definition
  const columns: ColumnDef<ReportLog>[] = [
    {
      header: "Report ID",
      accessor: "id",
      className: "font-semibold text-gray-500",
    },
    {
      header: "Report Title",
      accessor: "title",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Category Scope",
      accessor: "scope",
      className: "text-gray-900 font-medium",
    },
    {
      header: "Generated On",
      accessor: "date",
      className: "text-gray-500",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      align: "center",
    },
    {
      header: "Format / Size",
      accessor: (row) => `${row.format} (${row.size})`,
      className: "font-medium text-gray-500",
      align: "right",
    },
  ];

  // Live filter query
  const filteredReports = useMemo(() => {
    let result = reports;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.id.toLowerCase().includes(query) ||
          r.title.toLowerCase().includes(query) ||
          r.scope.toLowerCase().includes(query) ||
          (r.notes && r.notes.toLowerCase().includes(query))
      );
    }

    if (selectedScope !== "All") {
      result = result.filter(r => r.scope === selectedScope);
    }

    return result;
  }, [reports, searchQuery, selectedScope]);

  // Form Open Triggers
  const openAddDrawer = () => {
    setFormTitle("");
    setFormScope("Revenue");
    setFormRange("Last 30 Days");
    setFormFormat("PDF");
    setFormNotes("");
    setIsAddDrawerOpen(true);
  };

  // Generate Report Handler
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newReport: ReportLog = {
      id: `REP-${Math.floor(200 + Math.random() * 800)}`,
      title: formTitle,
      scope: formScope,
      date: "Today, Just now",
      status: "pending",
      format: formFormat,
      size: "0 KB",
      notes: `${formNotes}\n\nParameters: [Date Range: ${formRange}]`,
    };

    setReports(prev => [newReport, ...prev]);
    setIsAddDrawerOpen(false);

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setReports(prev =>
        prev.map(r =>
          r.id === newReport.id
            ? { ...r, status: "completed", size: `${(Math.floor(100 + Math.random() * 800) / 10).toFixed(1)} MB` }
            : r
        )
      );
    }, 3000);
  };

  // Delete Report Handler
  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setSelectedReport(null);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <SectionHeader
          title="Analytics & Reports"
          description="Evaluate monthly salon performance trends, stylist volume summaries, and export custom audits."
          action={
            <button
              onClick={openAddDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Generate Report
            </button>
          }
        />

        {/* Dynamic Vitals Summary Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Bookings"
            value="148 Sessions"
            description="+18.2% vs. previous month"
            icon={TrendingUp}
            iconColor="indigo"
          />
          <StatsCard
            title="Monthly Revenue"
            value="₱186,400"
            description="Net processed this month"
            icon={Layers}
            iconColor="blue"
          />
          <StatsCard
            title="Avg. Ticket Size"
            value="₱1,260"
            description="Average spending per booking"
            icon={Users}
            iconColor="emerald"
          />
          <StatsCard
            title="Client Retention"
            value="78.4%"
            description="Re-booking customer loyalty ratio"
            icon={Award}
            iconColor="amber"
          />
        </div>

        {/* Dynamic Visualizations Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400">
                Growth Curve
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Monthly Net Revenue Trend
              </h3>
            </div>

            {/* Vertical Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-4 px-4 border-b border-gray-100 dark:border-gray-800 pb-3 select-none">
              {monthlyRevenueData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group relative">
                  {/* Bar Container with constrained height */}
                  <div className="w-full flex-1 flex items-end">
                    <div 
                      style={{ height: barsVisible ? data.height : "0%" }}
                      className="w-full bg-blue-500 border border-blue-400 hover:bg-blue-600 transition-[height] duration-700 ease-out cursor-pointer relative rounded-t-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                    >
                      {/* Tooltip */}
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[10px] font-bold py-1.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none z-10">
                        {data.amount}
                      </span>
                    </div>
                  </div>
                  {/* Label */}
                  <span className="text-xs font-semibold text-gray-400">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stylist Productivity Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400">
                Productivity Rankings
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Top Stylists Performance Today
              </h3>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-5 justify-center">
              {stylistOutputs.map((stylist, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-semibold select-none">
                    <span className="text-gray-900 dark:text-gray-100">{stylist.name}</span>
                    <span className="text-gray-500">
                      {stylist.bookings} cuts <span className="text-gray-300 dark:text-gray-600">|</span> <span className="font-bold text-gray-900 dark:text-gray-100">{stylist.revenue}</span>
                    </span>
                  </div>
                  {/* Smooth Progress Indicator */}
                  <div className="w-full bg-gray-50 dark:bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-100/50 dark:border-gray-700/50">
                    <div 
                      style={{ width: barsVisible ? stylist.percentage : "0%" }}
                      className={`${stylist.color} h-full rounded-full transition-[width] duration-700 ease-out`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Exports History Table Section */}
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
          {/* Action Toolbar */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search generated archives, titles, notes..."
            filters={
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all cursor-pointer shadow-sm pr-8"
              >
                <option value="All">All Categories</option>
                <option value="Revenue">Revenue Logs</option>
                <option value="Bookings">Booking Sheets</option>
                <option value="Stylist Output">Stylist Outputs</option>
              </select>
            }
            actions={
              <span className="text-xs font-semibold text-gray-400 select-none">
                Showing {filteredReports.length} of {reports.length}
              </span>
            }
          />

          {/* Historical Data Grid */}
          <div className="overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredReports}
              isLoading={false}
              onRowClick={setSelectedReport}
            />
          </div>
        </div>
      </div>

      {/* Report Specifications Drawer */}
      <Drawer
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Report Specifications"
        description="Detailed metadata parameters, target logs, and download channels."
        size="md"
        footer={
          selectedReport && (
            <div className="flex w-full items-center justify-between gap-3 select-none">
              <button
                onClick={() => handleDeleteReport(selectedReport.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                {selectedReport.status === "completed" && (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    Download
                  </a>
                )}
              </div>
            </div>
          )
        }
      >
        {selectedReport && (
          <div className="space-y-6 animate-fade-in-quick">
            {/* Header info */}
            <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                  Document ID
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                  {selectedReport.id}
                </span>
              </div>
              <StatusBadge status={selectedReport.status} />
            </div>

            {/* Spec details grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Report Title
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedReport.title}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Category Scope
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedReport.scope}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Format / Size
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedReport.format} ({selectedReport.size})
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Generated On
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedReport.date}
                </span>
              </div>
            </div>

            {/* Notes/Parameters box */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Parameters & Scopes
              </span>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/30 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-700/50 rounded-lg p-4 whitespace-pre-line">
                {selectedReport.notes || "No metadata constraints recorded for this report."}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Generate Custom Report Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Generate Report Archive"
        description="Filter specific dates, choose audit segments, and export structural spreadsheets or documents."
        size="md"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setIsAddDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateReport}
              disabled={!formTitle.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Generate Report
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateReport} className="space-y-5 animate-fade-in-quick">
          {/* Report Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Report Title
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Q2 Gross Cashflow Summary"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Scope */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Category Scope
            </label>
            <select
              value={formScope}
              onChange={(e) => setFormScope(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Revenue">Revenue Logs</option>
              <option value="Bookings">Booking Sheets</option>
              <option value="Stylist Output">Stylist Outputs</option>
              <option value="Inventory">Inventory Sheets</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Target Date Range
            </label>
            <select
              value={formRange}
              onChange={(e) => setFormRange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q1 Current Year">Q1 Current Year</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Export Format
            </label>
            <div className="flex gap-4 select-none">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addFormat"
                  checked={formFormat === "PDF"}
                  onChange={() => setFormFormat("PDF")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                PDF Document (.pdf)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addFormat"
                  checked={formFormat === "CSV"}
                  onChange={() => setFormFormat("CSV")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                Spreadsheet Log (.csv)
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Internal Generation Notes
            </label>
            <textarea
              rows={4}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Filter by specific stylist names, payment methods, or customize audit summaries..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>
    </AdminLayout>
  );
}
