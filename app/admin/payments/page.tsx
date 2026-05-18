"use client";

import React, { useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Drawer from "@/components/shared/Drawer";
import TableToolbar from "@/components/tables/TableToolbar";
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  DollarSign 
} from "lucide-react";

interface Payment {
  id: string;
  customerName: string;
  method: "Cash" | "Credit Card" | "GCash" | "Maya";
  date: string;
  status: "paid" | "pending" | "refunded" | "failed";
  amount: string;
  notes?: string;
}

const initialPayments: Payment[] = [
  { id: "TXN-1001", customerName: "Sophia Martinez", method: "GCash", date: "Today, 10:30 AM", status: "paid", amount: "₱2,500", notes: "Hair Color package payment processed successfully." },
  { id: "TXN-1002", customerName: "Liam Johnson", method: "Credit Card", date: "Today, 11:45 AM", status: "pending", amount: "₱1,200", notes: "Awaiting automatic charge verification." },
  { id: "TXN-1003", customerName: "Emma Watson", method: "Cash", date: "Yesterday, 01:15 PM", status: "paid", amount: "₱3,500", notes: "Walk-in cash settlement." },
  { id: "TXN-1004", customerName: "Olivia Brown", method: "GCash", date: "Yesterday, 02:30 PM", status: "paid", amount: "₱500", notes: "Premium Cut quick QR pay." },
  { id: "TXN-1005", customerName: "Noah Davis", method: "Maya", date: "Yesterday, 03:45 PM", status: "refunded", amount: "₱1,200", notes: "Refund processed due to client scheduling clash." },
  { id: "TXN-1006", customerName: "Isabella Garcia", method: "Credit Card", date: "May 15, 2026", status: "failed", amount: "₱2,500", notes: "Payment gateway timeout. Client notified." },
  { id: "TXN-1007", customerName: "Mason Rodriguez", method: "GCash", date: "May 15, 2026", status: "paid", amount: "₱350", notes: "Beard Sculpt standard settlement." }
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Drawer States
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form States
  const [formCustomerName, setFormCustomerName] = useState("");
  const [formMethod, setFormMethod] = useState<"Cash" | "Credit Card" | "GCash" | "Maya">("GCash");
  const [formAmount, setFormAmount] = useState("");
  const [formStatus, setFormStatus] = useState<"paid" | "pending" | "refunded" | "failed">("paid");
  const [formNotes, setFormNotes] = useState("");

  // Dynamic Metrics Calculations
  const metrics = useMemo(() => {
    // Dynamic Revenue: Sum of status 'paid'
    const totalPaid = payments
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + (parseInt(p.amount.replace(/[^\d]/g, "")) || 0), 0);

    const paidCount = payments.filter(p => p.status === "paid").length;
    const pendingCount = payments.filter(p => p.status === "pending").length;

    // Refunded/Failed losses
    const refundedLoss = payments
      .filter(p => p.status === "refunded" || p.status === "failed")
      .reduce((sum, p) => sum + (parseInt(p.amount.replace(/[^\d]/g, "")) || 0), 0);

    return {
      revenue: `₱${totalPaid.toLocaleString()}`,
      paidCount: `${paidCount} Completed`,
      pendingCount: `${pendingCount} Processing`,
      loss: `₱${refundedLoss.toLocaleString()}`
    };
  }, [payments]);

  // Columns definition
  const columns: ColumnDef<Payment>[] = [
    {
      header: "Transaction ID",
      accessor: "id",
      className: "font-semibold text-gray-500",
    },
    {
      header: "Customer",
      accessor: "customerName",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Method",
      accessor: "method",
      className: "text-gray-900 font-medium",
    },
    {
      header: "Date / Time",
      accessor: "date",
      className: "text-gray-500",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      align: "center",
    },
    {
      header: "Amount",
      accessor: "amount",
      className: "font-bold text-gray-900",
      align: "right",
    },
  ];

  // Search and status filters combination
  const filteredPayments = useMemo(() => {
    let result = payments;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.id.toLowerCase().includes(query) ||
          p.customerName.toLowerCase().includes(query) ||
          p.method.toLowerCase().includes(query) ||
          (p.notes && p.notes.toLowerCase().includes(query))
      );
    }

    if (selectedStatus !== "All") {
      const statusMatch = selectedStatus.toLowerCase();
      result = result.filter(p => p.status === statusMatch);
    }

    return result;
  }, [payments, searchQuery, selectedStatus]);

  // Handle Form Openings
  const openAddDrawer = () => {
    setFormCustomerName("");
    setFormMethod("GCash");
    setFormAmount("");
    setFormStatus("paid");
    setFormNotes("");
    setIsAddDrawerOpen(true);
  };

  const openDetailsDrawer = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditMode(false);

    setFormCustomerName(payment.customerName);
    setFormMethod(payment.method);
    setFormAmount(payment.amount.replace(/[^\d]/g, ""));
    setFormStatus(payment.status);
    setFormNotes(payment.notes || "");
  };

  // Record Manual Payment Handler
  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerName.trim() || !formAmount.trim()) return;

    const amountNum = parseInt(formAmount.replace(/[^\d]/g, "")) || 0;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPayment: Payment = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formCustomerName,
      method: formMethod,
      date: `Today, ${timeStr}`,
      status: formStatus,
      amount: `₱${amountNum.toLocaleString()}`,
      notes: formNotes,
    };

    setPayments(prev => [newPayment, ...prev]);
    setIsAddDrawerOpen(false);
  };

  // Update Payment Handler
  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !formCustomerName.trim() || !formAmount.trim()) return;

    const amountNum = parseInt(formAmount.replace(/[^\d]/g, "")) || 0;

    setPayments(prev =>
      prev.map(p =>
        p.id === selectedPayment.id
          ? {
              ...p,
              customerName: formCustomerName,
              method: formMethod,
              amount: `₱${amountNum.toLocaleString()}`,
              status: formStatus,
              notes: formNotes,
            }
          : p
      )
    );

    setSelectedPayment({
      id: selectedPayment.id,
      customerName: formCustomerName,
      method: formMethod,
      date: selectedPayment.date,
      amount: `₱${amountNum.toLocaleString()}`,
      status: formStatus,
      notes: formNotes,
    });
    setIsEditMode(false);
  };

  // Delete Payment Handler
  const handleDeletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    setSelectedPayment(null);
  };

  // Refund Single Payment
  const handleRefundPayment = (payment: Payment) => {
    setPayments(prev =>
      prev.map(p => (p.id === payment.id ? { ...p, status: "refunded" } : p))
    );
    setSelectedPayment(prev => (prev ? { ...prev, status: "refunded" } : null));
  };

  // Mark Pending as Paid
  const handleSettlePayment = (payment: Payment) => {
    setPayments(prev =>
      prev.map(p => (p.id === payment.id ? { ...p, status: "paid" } : p))
    );
    setSelectedPayment(prev => (prev ? { ...prev, status: "paid" } : null));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Slot */}
        <SectionHeader
          title="Payments"
          description="Monitor salon cashflow, track settlement processing, Maya/GCash logs, and record manual payments."
          action={
            <button
              onClick={openAddDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Record Payment
            </button>
          }
        />

        {/* Catalog Transaction Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gross Revenue"
            value={metrics.revenue}
            description="Total paid appointments today"
            icon={DollarSign}
            iconColor="blue"
          />
          <StatsCard
            title="Transactions"
            value={metrics.paidCount}
            description="Successful transactions processed"
            icon={CheckCircle}
            iconColor="emerald"
          />
          <StatsCard
            title="Awaiting Settlement"
            value={metrics.pendingCount}
            description="Pending payments in clearing"
            icon={RefreshCw}
            iconColor="indigo"
          />
          <StatsCard
            title="Refunds & Failures"
            value={metrics.loss}
            description="Total chargeback/failed volume"
            icon={AlertCircle}
            iconColor="rose"
          />
        </div>

        {/* Operational Transactions List Table Section */}
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
          {/* Action Toolbar */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search transactions, customer profiles, payment methods..."
            filters={
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all cursor-pointer shadow-sm pr-8"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            }
            actions={
              <span className="text-xs font-semibold text-gray-400 select-none">
                Showing {filteredPayments.length} of {payments.length}
              </span>
            }
          />

          {/* Transactions Data Grid */}
          <div className="overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredPayments}
              isLoading={false}
              onRowClick={openDetailsDrawer}
            />
          </div>
        </div>
      </div>

      {/* Details Side-Sheet Drawer */}
      <Drawer
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title={isEditMode ? "Edit Transaction Entry" : "Transaction Record"}
        description={isEditMode ? "Adjust customer booking payment logs, amount, and internal logs." : "Review full gateway payloads, timestamps, and payment statuses."}
        size="md"
        footer={
          selectedPayment && (
            <div className="flex w-full items-center justify-between gap-3 select-none">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Back to specs
                  </button>
                  <button
                    onClick={handleUpdatePayment}
                    disabled={!formCustomerName.trim() || !formAmount.trim()}
                    className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Save Entry
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDeletePayment(selectedPayment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Record
                  </button>
                  <div className="flex gap-2">
                    {selectedPayment.status === "pending" && (
                      <button
                        onClick={() => handleSettlePayment(selectedPayment)}
                        className="px-3.5 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Settle Payment
                      </button>
                    )}
                    {selectedPayment.status === "paid" && (
                      <button
                        onClick={() => handleRefundPayment(selectedPayment)}
                        className="px-3.5 py-2 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Refund Charge
                      </button>
                    )}
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Edit Entry
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        }
      >
        {selectedPayment && (
          <div className="space-y-6">
            {isEditMode ? (
              <form onSubmit={handleUpdatePayment} className="space-y-5 animate-fade-in-quick">
                {/* Customer Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    placeholder="e.g. Sophia Martinez"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Method */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Payment Method
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <option value="GCash">GCash</option>
                    <option value="Maya">Maya</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Transaction Amount (PHP ₱)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-400 pointer-events-none">
                      ₱
                    </span>
                    <input
                      type="text"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Payment Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Internal Billing Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Provide additional details regarding discount codes used, gateway failures, or partial deposits..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in-quick">
                {/* Header panel */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                      Transaction ID
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                      {selectedPayment.id}
                    </span>
                  </div>
                  <StatusBadge status={selectedPayment.status} />
                </div>

                {/* Specification grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Customer
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPayment.customerName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Payment Method
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPayment.method}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Timestamp
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPayment.date}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Billing Value
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {selectedPayment.amount}
                    </span>
                  </div>
                </div>

                {/* Billing Notes box */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Internal Billing Notes
                  </span>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/30 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-700/50 rounded-lg p-4">
                    {selectedPayment.notes || "No billing notes recorded for this transaction."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Record Payment Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Record Payment"
        description="Manually record GCash QR, cash, or credit card transactions for physical walk-in clients."
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
              onClick={handleCreatePayment}
              disabled={!formCustomerName.trim() || !formAmount.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Record Payment
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreatePayment} className="space-y-5 animate-fade-in-quick">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={formCustomerName}
              onChange={(e) => setFormCustomerName(e.target.value)}
              placeholder="e.g. Sophia Martinez"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Method */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Payment Method
            </label>
            <select
              value={formMethod}
              onChange={(e) => setFormMethod(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Transaction Amount (PHP ₱)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-400 pointer-events-none">
                ₱
              </span>
              <input
                type="text"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Payment Status
            </label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Internal Billing Notes
            </label>
            <textarea
              rows={4}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Provide additional details regarding discount codes used, gateway failures, or partial deposits..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>
    </AdminLayout>
  );
}
