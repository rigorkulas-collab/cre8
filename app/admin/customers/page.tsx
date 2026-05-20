"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Drawer from "@/components/shared/Drawer";
import TableToolbar from "@/components/tables/TableToolbar";
import { cn } from "@/lib/utils";
import { 
  Users, 
  CheckCircle, 
  Calendar, 
  UserPlus, 
  Plus, 
  Trash2, 
  Mail, 
  Phone 
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  status: "active" | "inactive";
  notes?: string;
  loyaltyPoints: number;
  loyaltyTier: string;
}

const initialCustomers: Customer[] = [
  { id: "CST-001", name: "Sophia Martinez", email: "sophia.martinez@gmail.com", phone: "+63 917 123 4567", totalBookings: 12, status: "active", notes: "Regular client. Prefers organic hair treatments.", loyaltyPoints: 180, loyaltyTier: "Silver Member" },
  { id: "CST-002", name: "Liam Johnson", email: "liam.johnson@yahoo.com", phone: "+63 918 234 5678", totalBookings: 5, status: "active", notes: "Needs soft-bristled brush usage.", loyaltyPoints: 50, loyaltyTier: "Bronze Member" },
  { id: "CST-003", name: "Emma Watson", email: "emma.watson@gmail.com", phone: "+63 919 345 6789", totalBookings: 8, status: "active", notes: "Always books scalp treatments.", loyaltyPoints: 240, loyaltyTier: "Silver Member" },
  { id: "CST-004", name: "Olivia Brown", email: "olivia.brown@hotmail.com", phone: "+63 920 456 7890", totalBookings: 3, status: "active", notes: "Wants light layering style.", loyaltyPoints: 90, loyaltyTier: "Bronze Member" },
  { id: "CST-005", name: "Noah Davis", email: "noah.davis@outlook.com", phone: "+63 921 567 8901", totalBookings: 15, status: "active", notes: "Usually schedules on weekends.", loyaltyPoints: 420, loyaltyTier: "Gold Member" },
  { id: "CST-006", name: "Isabella Garcia", email: "isabella.garcia@gmail.com", phone: "+63 922 678 9012", totalBookings: 2, status: "inactive", notes: "Relocated, set to inactive.", loyaltyPoints: 10, loyaltyTier: "Bronze Member" },
  { id: "CST-007", name: "Mason Rodriguez", email: "mason.rodriguez@gmail.com", phone: "+63 923 789 0123", totalBookings: 9, status: "active", notes: "Prefers David Miller for clipper cuts.", loyaltyPoints: 120, loyaltyTier: "Silver Member" },
  { id: "CST-008", name: "Zachary Cruz", email: "zachary@example.com", phone: "+63 917 123 4567", totalBookings: 4, status: "active", notes: "Prefers pomade finish, side part haircuts.", loyaltyPoints: 150, loyaltyTier: "Silver Member" }
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Tab State
  const [activeTab, setActiveTab] = useState<"directory" | "tiers" | "history">("directory");

  // Loyalty Config & History State
  const [loyaltyTiers, setLoyaltyTiers] = useState<Array<{ id: string; title: string; points: number; discount: number }>>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [pointsInputVal, setPointsInputVal] = useState<number>(0);

  // Drawer States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formNotes, setFormNotes] = useState("");

  // Load and sync localStorage states
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCusts = localStorage.getItem("cre8_customers");
      if (storedCusts) {
        setCustomers(JSON.parse(storedCusts));
      } else {
        localStorage.setItem("cre8_customers", JSON.stringify(initialCustomers));
        setCustomers(initialCustomers);
      }

      const storedTiers = localStorage.getItem("cre8_loyalty_tiers");
      if (storedTiers) {
        setLoyaltyTiers(JSON.parse(storedTiers));
      } else {
        const initialTiers = [
          { id: "rew-100", title: "₱150 Voucher", points: 100, discount: 150 },
          { id: "rew-200", title: "₱350 Voucher", points: 200, discount: 350 },
          { id: "rew-300", title: "₱600 Voucher", points: 300, discount: 600 }
        ];
        localStorage.setItem("cre8_loyalty_tiers", JSON.stringify(initialTiers));
        setLoyaltyTiers(initialTiers);
      }

      const storedReds = localStorage.getItem("cre8_customer_redemptions");
      if (storedReds) {
        setRedemptions(JSON.parse(storedReds));
      } else {
        const mockRedemptions = [
          { id: "RED-1001", customerName: "Sophia Martinez", customerEmail: "sophia.martinez@gmail.com", rewardTitle: "₱150 Voucher", pointsSpent: 100, date: "May 15, 2026" },
          { id: "RED-1002", customerName: "Noah Davis", customerEmail: "noah.davis@outlook.com", rewardTitle: "₱350 Voucher", pointsSpent: 200, date: "May 12, 2026" }
        ];
        localStorage.setItem("cre8_customer_redemptions", JSON.stringify(mockRedemptions));
        setRedemptions(mockRedemptions);
      }
    }
  }, [activeTab]);

  const updateCustomersState = (updatedList: Customer[]) => {
    setCustomers(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("cre8_customers", JSON.stringify(updatedList));
    }
  };

  const updateTiersState = (updatedTiers: any[]) => {
    setLoyaltyTiers(updatedTiers);
    if (typeof window !== "undefined") {
      localStorage.setItem("cre8_loyalty_tiers", JSON.stringify(updatedTiers));
    }
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = customers.length;
    const activeCount = customers.filter(c => c.status === "active").length;
    
    const totalVisits = customers.reduce((sum, c) => sum + c.totalBookings, 0);
    const avgVisits = total > 0 ? (totalVisits / total).toFixed(1) : "0";

    const premiumCount = customers.filter(c => c.loyaltyPoints >= 100).length;

    return {
      total,
      activeCount,
      avgVisits: `${avgVisits} Visits`,
      premiumCount: `${premiumCount} Loyalty members`
    };
  }, [customers]);

  // Columns definition
  const columns: ColumnDef<Customer>[] = [
    {
      header: "Customer Name",
      accessor: "name",
      className: "font-semibold text-gray-900 dark:text-gray-100",
    },
    {
      header: "Email Address",
      accessor: "email",
      className: "text-gray-500 dark:text-gray-400",
    },
    {
      header: "Phone Number",
      accessor: "phone",
      className: "text-gray-500 dark:text-gray-400 font-medium",
    },
    {
      header: "Total Bookings",
      accessor: "totalBookings",
      className: "font-semibold text-gray-900 dark:text-gray-100",
      align: "center",
    },
    {
      header: "Loyalty Tier",
      accessor: "loyaltyTier",
      className: "font-semibold text-amber-600 dark:text-amber-500",
    },
    {
      header: "Loyalty Points",
      accessor: (row) => `${row.loyaltyPoints} pts`,
      className: "font-extrabold text-gray-900 dark:text-gray-100",
      align: "center",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      align: "center",
    },
  ];

  const redemptionColumns: ColumnDef<any>[] = [
    {
      header: "Log ID",
      accessor: "id",
      className: "font-mono text-gray-500 dark:text-gray-450",
    },
    {
      header: "Customer Name",
      accessor: "customerName",
      className: "font-semibold text-gray-900 dark:text-gray-100",
    },
    {
      header: "Email Channel",
      accessor: "customerEmail",
      className: "text-gray-500 dark:text-gray-400",
    },
    {
      header: "Redeemed Reward",
      accessor: "rewardTitle",
      className: "font-semibold text-gray-800 dark:text-gray-200",
    },
    {
      header: "Points Spent",
      accessor: (row) => `${row.pointsSpent} pts`,
      className: "font-extrabold text-amber-600 dark:text-amber-550",
      align: "center",
    },
    {
      header: "Redeemed Date",
      accessor: "date",
      className: "text-gray-500 dark:text-gray-400",
      align: "right",
    },
  ];

  // Live query search and status filtering
  const filteredCustomers = useMemo(() => {
    let result = customers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          (c.notes && c.notes.toLowerCase().includes(query))
      );
    }

    if (selectedStatus !== "All") {
      const activeMatch = selectedStatus === "Active";
      result = result.filter(c => (c.status === "active") === activeMatch);
    }

    return result;
  }, [customers, searchQuery, selectedStatus]);

  // Drawer Form Triggers
  const openAddDrawer = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormStatus("active");
    setFormNotes("");
    setIsAddDrawerOpen(true);
  };

  const openDetailsDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(false);

    setFormName(customer.name);
    setFormEmail(customer.email);
    setFormPhone(customer.phone);
    setFormStatus(customer.status);
    setFormNotes(customer.notes || "");
    setPointsInputVal(customer.loyaltyPoints);
  };

  // Add Customer Handler
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const newCustomer: Customer = {
      id: `CST-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      email: formEmail,
      phone: formPhone || "N/A",
      totalBookings: 0,
      status: formStatus,
      notes: formNotes,
      loyaltyPoints: 0,
      loyaltyTier: "Bronze Member"
    };

    updateCustomersState([newCustomer, ...customers]);
    setIsAddDrawerOpen(false);
  };

  // Update Customer Handler
  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !formName.trim() || !formEmail.trim()) return;

    const updated = customers.map(c =>
      c.id === selectedCustomer.id
        ? {
            ...c,
            name: formName,
            email: formEmail,
            phone: formPhone || "N/A",
            status: formStatus,
            notes: formNotes,
          }
        : c
    );
    updateCustomersState(updated);

    setSelectedCustomer({
      id: selectedCustomer.id,
      name: formName,
      email: formEmail,
      phone: formPhone || "N/A",
      totalBookings: selectedCustomer.totalBookings,
      status: formStatus,
      notes: formNotes,
      loyaltyPoints: selectedCustomer.loyaltyPoints,
      loyaltyTier: selectedCustomer.loyaltyTier
    });
    setIsEditMode(false);
  };

  // Delete Customer Handler
  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    updateCustomersState(updated);
    setSelectedCustomer(null);
  };

  // Toggle Customer Status
  const handleToggleStatus = (customer: Customer) => {
    const nextStatus: "active" | "inactive" = customer.status === "active" ? "inactive" : "active";
    const updated = customers.map(c => (c.id === customer.id ? { ...c, status: nextStatus } : c));
    updateCustomersState(updated);
    setSelectedCustomer(prev => (prev ? { ...prev, status: nextStatus } : null));
  };

  // Points adjustment helpers
  const handleAdjustPoints = (customer: Customer, delta: number) => {
    const newPoints = Math.max(0, pointsInputVal + delta);
    setPointsInputVal(newPoints);
  };

  const handleSetPointsDirect = (customer: Customer) => {
    let newTier = "Bronze Member";
    if (pointsInputVal >= 300) {
      newTier = "Gold Member";
    } else if (pointsInputVal >= 100) {
      newTier = "Silver Member";
    }

    const updated = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            loyaltyPoints: pointsInputVal,
            loyaltyTier: newTier
          }
        : c
    );
    updateCustomersState(updated);

    setSelectedCustomer({
      ...customer,
      loyaltyPoints: pointsInputVal,
      loyaltyTier: newTier
    });

    if (customer.email === "zachary@example.com") {
      localStorage.setItem("cre8_customer_loyalty", JSON.stringify({
        points: pointsInputVal,
        tier: newTier
      }));
    }
  };

  const customerRedemptions = useMemo(() => {
    if (!selectedCustomer) return [];
    return redemptions.filter(r => r.customerEmail === selectedCustomer.email);
  }, [selectedCustomer, redemptions]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Slot */}
        <SectionHeader
          title="Customers"
          description="Manage client profile records, contact channels, notes, and activity states."
          action={
            <button
              onClick={openAddDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add Customer
            </button>
          }
        />

        {/* Dashboard Vitals */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Clients"
            value={`${metrics.total} Customers`}
            description="All signed-up guests"
            icon={Users}
            iconColor="blue"
          />
          <StatsCard
            title="Active Sign-ups"
            value={`${metrics.activeCount} Active`}
            description="Regular engagement state"
            icon={CheckCircle}
            iconColor="emerald"
          />
          <StatsCard
            title="Avg. Visit Count"
            value={metrics.avgVisits}
            description="Total bookings per client"
            icon={Calendar}
            iconColor="indigo"
          />
          <StatsCard
            title="Loyalty Tier"
            value={metrics.premiumCount}
            description="Clients with 10+ bookings"
            icon={UserPlus}
            iconColor="amber"
          />
        </div>
        {/* Tab selection bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 select-none mt-2 shrink-0">
          <button
            onClick={() => setActiveTab("directory")}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer",
              activeTab === "directory"
                ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100 font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-250"
            )}
          >
            <Users className="h-4 w-4" />
            Client Directory
          </button>
          <button
            onClick={() => setActiveTab("tiers")}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer",
              activeTab === "tiers"
                ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100 font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-250"
            )}
          >
            <Plus className="h-4 w-4 text-emerald-500" />
            Loyalty Reward Tiers
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer",
              activeTab === "history"
                ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100 font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-250"
            )}
          >
            <Calendar className="h-4 w-4 text-indigo-500" />
            Redemption History Log
          </button>
        </div>

        {/* Operational List Table Section */}
        {activeTab === "directory" && (
          <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
            {/* Action Toolbar */}
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search clients, emails, phone numbers, notes..."
              filters={
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all cursor-pointer shadow-sm pr-8"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active State</option>
                  <option value="Inactive">Inactive State</option>
                </select>
              }
              actions={
                <span className="text-xs font-semibold text-gray-400 select-none">
                  Showing {filteredCustomers.length} of {customers.length}
                </span>
              }
            />

            {/* Customer Data Grid */}
            <div className="overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredCustomers}
                isLoading={false}
                onRowClick={openDetailsDrawer}
              />
            </div>
          </div>
        )}

        {/* Loyalty Reward Tiers Config */}
        {activeTab === "tiers" && (
          <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800 p-6 shadow-2xs">
            <div className="flex justify-between items-center pb-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                  Global Reward Redemption Milestones
                </h3>
                <p className="text-xs text-gray-500">
                  Define points thresholds and cash discount equivalents for customer checkout bookings.
                </p>
              </div>
            </div>

            {/* List of Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loyaltyTiers.map((tier) => (
                <div key={tier.id} className="border border-gray-250 dark:border-gray-700/60 rounded-xl p-5 flex flex-col justify-between gap-4 bg-gray-50/20 dark:bg-gray-800/10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{tier.title}</span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                        Cost: {tier.points} Points
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = loyaltyTiers.filter(t => t.id !== tier.id);
                        updateTiersState(updated);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Reward Tier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Provides a <span className="font-extrabold text-emerald-600">₱{tier.discount} discount</span> deduction.
                  </div>
                </div>
              ))}

              {/* Add New Tier Card */}
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-4 bg-white dark:bg-gray-900/30 justify-center">
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">Create New Milestone</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Voucher Title (e.g. ₱200 Voucher)"
                    id="new-tier-title"
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Points Required"
                      id="new-tier-points"
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="Discount ₱"
                      id="new-tier-discount"
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const titleEl = document.getElementById("new-tier-title") as HTMLInputElement;
                      const pointsEl = document.getElementById("new-tier-points") as HTMLInputElement;
                      const discountEl = document.getElementById("new-tier-discount") as HTMLInputElement;

                      if (titleEl && pointsEl && discountEl && titleEl.value && pointsEl.value && discountEl.value) {
                        const newTier = {
                          id: `rew-${Math.floor(100 + Math.random() * 900)}`,
                          title: titleEl.value,
                          points: parseInt(pointsEl.value) || 0,
                          discount: parseInt(discountEl.value) || 0
                        };
                        updateTiersState([...loyaltyTiers, newTier]);
                        titleEl.value = "";
                        pointsEl.value = "";
                        discountEl.value = "";
                      } else {
                        alert("Please fill in all fields!");
                      }
                    }}
                    className="w-full py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Add Milestone Tier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800 p-6 shadow-2xs">
            <div className="flex justify-between items-center pb-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                  Reward Redemptions History
                </h3>
                <p className="text-xs text-gray-500">
                  Audited logs of customer loyalty reward point redemptions.
                </p>
              </div>
            </div>

            <div className="overflow-hidden">
              <DataTable
                columns={redemptionColumns}
                data={redemptions}
                isLoading={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Details Side-Sheet Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={isEditMode ? "Edit Profile Records" : "Client Profile Record"}
        description={isEditMode ? "Modify customer contact channels, statuses, and service notes." : "Detailed service metrics, contact info, and structural notes."}
        size="md"
        footer={
          selectedCustomer && (
            <div className="flex w-full items-center justify-between gap-3 select-none">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Back to Profile
                  </button>
                  <button
                    onClick={handleUpdateCustomer}
                    disabled={!formName.trim() || !formEmail.trim()}
                    className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Save Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Client
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedCustomer)}
                      className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {selectedCustomer.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3.5 py-2 text-xs font-bold bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {isEditMode ? (
              <form onSubmit={handleUpdateCustomer} className="space-y-5 animate-fade-in-quick">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sophia Martinez"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. sophia.martinez@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +63 917 123 4567"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Client Status
                  </label>
                  <div className="flex gap-4 select-none">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="radio"
                        name="custStatus"
                        checked={formStatus === "active"}
                        onChange={() => setFormStatus("active")}
                        className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                      />
                      Active State
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="radio"
                        name="custStatus"
                        checked={formStatus === "inactive"}
                        onChange={() => setFormStatus("inactive")}
                        className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                      />
                      Inactive State
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Internal Client Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Prefers organic conditioners, zero scented spray, or general appointment requests..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-200 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in-quick">
                {/* Top card block */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                      Client ID
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                      {selectedCustomer.id}
                    </span>
                  </div>
                  <StatusBadge status={selectedCustomer.status} />
                </div>

                {/* Profile detail grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Full Name
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedCustomer.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Visits Logged
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {selectedCustomer.totalBookings} Appointments
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Email Channel
                    </span>
                    <a 
                      href={`mailto:${selectedCustomer.email}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      {selectedCustomer.email}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Phone Channel
                    </span>
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      {selectedCustomer.phone}
                    </a>
                  </div>
                </div>

                {/* Loyalty points adjustment block */}
                <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                        Loyalty Points Balance
                      </span>
                      <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mt-0.5 font-sans">
                        {selectedCustomer.loyaltyPoints} Points • <span className="text-xs font-semibold text-gray-500">{selectedCustomer.loyaltyTier}</span>
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-amber-200/20 dark:bg-amber-850/20" />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(selectedCustomer, -10)}
                      className="h-9 w-9 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(selectedCustomer, -50)}
                      className="h-9 w-9 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      -50
                    </button>
                    <input
                      type="number"
                      value={pointsInputVal}
                      onChange={(e) => setPointsInputVal(parseInt(e.target.value) || 0)}
                      className="w-20 text-center px-2 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg font-extrabold text-xs text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(selectedCustomer, 10)}
                      className="h-9 w-9 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(selectedCustomer, 50)}
                      className="h-9 w-9 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPointsDirect(selectedCustomer)}
                      className="px-3.5 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs ml-auto"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Individual customer redemption history log */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Redemption History ({customerRedemptions.length})
                  </span>
                  {customerRedemptions.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                      {customerRedemptions.map((log: any) => (
                        <div key={log.id} className="flex justify-between items-center text-xs p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-gray-900 dark:text-gray-200">{log.rewardTitle}</span>
                            <span className="text-[10px] text-gray-400">{log.date}</span>
                          </div>
                          <span className="font-bold text-amber-600 dark:text-amber-500">-{log.pointsSpent} pts</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-semibold text-gray-400 italic">
                      No points redemptions recorded for this client.
                    </p>
                  )}
                </div>

                {/* Notes box */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Special Service Notes
                  </span>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/30 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-700/50 rounded-lg p-4">
                    {selectedCustomer.notes || "No service notes registered for this client."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Add Customer Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add Customer Profile"
        description="Create new user record with contact preferences and custom treatment notes."
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
              onClick={handleCreateCustomer}
              disabled={!formName.trim() || !formEmail.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Create Profile
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateCustomer} className="space-y-5 animate-fade-in-quick">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Sophia Martinez"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. sophia.martinez@gmail.com"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Phone Number
            </label>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="e.g. +63 917 123 4567"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Client Status
            </label>
            <div className="flex gap-4 select-none">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addCustStatus"
                  checked={formStatus === "active"}
                  onChange={() => setFormStatus("active")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                Active State
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addCustStatus"
                  checked={formStatus === "inactive"}
                  onChange={() => setFormStatus("inactive")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                Inactive State
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Internal Client Notes
            </label>
            <textarea
              rows={4}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Prefers organic conditioners, zero scented spray, or general appointment requests..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>
    </AdminLayout>
  );
}
