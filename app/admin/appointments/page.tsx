"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";

import TableToolbar from "@/components/tables/TableToolbar";
import AppointmentDetailsDrawer from "@/components/shared/AppointmentDetailsDrawer";
import Drawer from "@/components/shared/Drawer";
import { mockServices } from "@/lib/mock-data/mockServices";
import { 
  Calendar, 
  Users, 
  Scissors, 
  Check, 
  X, 
  Eye, 
  TrendingUp,
  Plus,
  LayoutGrid,
  CalendarDays,
  Clock
} from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  time: string;
  staffName: string;
  status: string;
  price: string;
  notes?: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "APT-001",
    customerName: "Sophia Martinez",
    serviceName: "Hair Color",
    time: "10:30 AM",
    staffName: "Elena Rostova",
    status: "confirmed",
    price: "₱2,500",
    notes: "Customer requested styling with standard soft curling iron treatment. Prefers zero scented products if available.",
  },
  {
    id: "APT-002",
    customerName: "Liam Johnson",
    serviceName: "Deep Facial Glow",
    time: "11:45 AM",
    staffName: "David Miller",
    status: "pending",
    price: "₱1,200",
    notes: "Requires classic volumetric blow dry styling for a professional dinner engagement.",
  },
  {
    id: "APT-003",
    customerName: "Emma Watson",
    serviceName: "Keratin Rebond",
    time: "01:15 PM",
    staffName: "Elena Rostova",
    status: "completed",
    price: "₱3,500",
    notes: "Needs standard aftercare instructions printed out upon check-out.",
  },
  {
    id: "APT-004",
    customerName: "Olivia Brown",
    serviceName: "Premium Cut",
    time: "02:30 PM",
    staffName: "Sarah Jenkins",
    status: "confirmed",
    price: "₱500",
    notes: "Wants a subtle 2-inch trimming and layering style.",
  },
  {
    id: "APT-005",
    customerName: "Noah Davis",
    serviceName: "Deep Facial Glow",
    time: "03:45 PM",
    staffName: "David Miller",
    status: "cancelled",
    price: "₱1,200",
    notes: "Cancelled via portal, rescheduled to coming Thursday.",
  },
  {
    id: "APT-006",
    customerName: "Isabella Garcia",
    serviceName: "Hair Color",
    time: "04:30 PM",
    staffName: "Sarah Jenkins",
    status: "pending",
    price: "₱2,500",
    notes: "Touch up root area only, client has sensitive scalp.",
  },
  {
    id: "APT-007",
    customerName: "Mason Rodriguez",
    serviceName: "Beard Sculpt",
    time: "05:15 PM",
    staffName: "David Miller",
    status: "confirmed",
    price: "₱350",
    notes: "Standard fade and side-sweep clipper trim.",
  }
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load services
      const storedServices = localStorage.getItem("cre8_services");
      let services = [];
      if (storedServices) {
        try {
          services = JSON.parse(storedServices);
        } catch (e) {
          console.error(e);
        }
      }
      if (!services || services.length === 0) {
        services = mockServices;
      }
      setServicesList(services);
      if (services.length > 0) {
        setSelectedServices([services[0].id]);
      }

      // Load appointments
      const stored = localStorage.getItem("cre8_appointments");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped: Appointment[] = parsed.map(apt => ({
              id: apt.id,
              customerName: apt.customerName || "Zachary Cruz",
              serviceName: apt.serviceName,
              staffName: apt.stylistName || "Elena Rostova",
              time: apt.time,
              status: apt.status,
              price: apt.price,
              notes: apt.notes || ""
            }));

            const combined = [...mapped];
            initialAppointments.forEach(initApt => {
              if (!combined.some(a => a.id === initApt.id)) {
                combined.push(initApt);
              }
            });
            setAppointments(combined);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // New Appointment Form States
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [newStaff, setNewStaff] = useState("Alex Rivera");
  const [newTime, setNewTime] = useState("09:00 AM");
  const [newNotes, setNewNotes] = useState("");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim() || selectedServices.length === 0) return;

    const chosenServicesObj = servicesList.filter(s => selectedServices.includes(s.id));
    const combinedServiceName = chosenServicesObj.map(s => s.name).join(" + ");
    const combinedServiceIds = chosenServicesObj.map(s => s.id).join(",");
    
    // Sum prices
    const totalRawPrice = chosenServicesObj.reduce((sum, s) => {
      const val = parseInt(s.price.replace(/[^0-9]/g, ""), 10) || 0;
      return sum + val;
    }, 0);
    const combinedPriceStr = `₱${totalRawPrice.toLocaleString()}`;

    // Sum durations
    const totalRawDuration = chosenServicesObj.reduce((sum, s) => {
      const val = parseInt(s.duration.replace(/[^0-9]/g, ""), 10) || 0;
      return sum + val;
    }, 0);
    const combinedDurationStr = `${totalRawDuration} Min`;

    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomer,
      serviceName: combinedServiceName,
      staffName: newStaff,
      time: newTime,
      price: combinedPriceStr,
      status: "confirmed", // default to confirmed when created by admin directly
      notes: newNotes,
    };

    setAppointments(prev => {
      const next = [newApt, ...prev];
      if (typeof window !== "undefined") {
        const customerApt = {
          id: newApt.id,
          serviceId: combinedServiceIds,
          serviceName: newApt.serviceName,
          category: chosenServicesObj[0]?.category || "Hair",
          stylistName: newApt.staffName,
          date: "May 20, 2026",
          time: newApt.time,
          price: newApt.price,
          duration: combinedDurationStr,
          status: newApt.status,
          refCode: `CRE8-${newApt.id.substring(4)}`,
          notes: newApt.notes,
          customerName: newApt.customerName
        };
        const stored = localStorage.getItem("cre8_appointments");
        const currentList = stored ? JSON.parse(stored) : [];
        localStorage.setItem("cre8_appointments", JSON.stringify([customerApt, ...currentList]));
      }
      return next;
    });
    
    // reset form states
    setNewCustomer("");
    setSelectedServices(servicesList.length > 0 ? [servicesList[0].id] : []);
    setNewStaff("Alex Rivera");
    setNewTime("09:00 AM");
    setNewNotes("");
    setIsNewDrawerOpen(false);
  };

  // Status Action Handlers
  const sendNotification = (id: string, type: "confirmed" | "cancelled" | "completed" | "message", customMessage?: string) => {
    if (typeof window === "undefined") return;
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;

    const stored = localStorage.getItem("cre8_notifications");
    const notifications = stored ? JSON.parse(stored) : [];
    const dateStr = (apt as any).date || "Today";

    let content = "";
    if (type === "confirmed") {
      content = `Your booking for ${apt.serviceName} with ${apt.staffName} on ${dateStr} at ${apt.time} has been CONFIRMED by our admin.`;
    } else if (type === "cancelled") {
      content = `Your booking for ${apt.serviceName} with ${apt.staffName} on ${dateStr} at ${apt.time} has been CANCELLED.`;
    } else if (type === "completed") {
      content = `Thank you for visiting! Your session for ${apt.serviceName} with ${apt.staffName} is complete. Please leave a review!`;
    } else if (type === "message") {
      content = customMessage || `Admin update regarding your booking for ${apt.serviceName}.`;
    }

    const newNotification = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      appointmentId: id,
      title: type === "message" ? "Message from Salon Admin" : `Booking ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      read: false
    };

    localStorage.setItem("cre8_notifications", JSON.stringify([newNotification, ...notifications]));
  };

  const handleApprove = (id: string) => {
    setAppointments(prev => {
      const next = prev.map(apt => 
        apt.id === id ? { ...apt, status: "confirmed" } : apt
      );
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cre8_appointments");
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((a: any) => a.id === id ? { ...a, status: "confirmed" } : a);
          localStorage.setItem("cre8_appointments", JSON.stringify(updated));
        }
      }
      return next;
    });
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "confirmed" } : null);
    }
    sendNotification(id, "confirmed");
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => {
      const next = prev.map(apt => 
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      );
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cre8_appointments");
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((a: any) => a.id === id ? { ...a, status: "cancelled" } : a);
          localStorage.setItem("cre8_appointments", JSON.stringify(updated));
        }
      }
      return next;
    });
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "cancelled" } : null);
    }
    sendNotification(id, "cancelled");
  };

  const handleComplete = (id: string) => {
    setAppointments(prev => {
      const next = prev.map(apt => 
        apt.id === id ? { ...apt, status: "completed" } : apt
      );
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cre8_appointments");
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((a: any) => a.id === id ? { ...a, status: "completed" } : a);
          localStorage.setItem("cre8_appointments", JSON.stringify(updated));
        }
      }
      return next;
    });
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "completed" } : null);
    }
    sendNotification(id, "completed");
  };

  const handleSendCustomAlert = (id: string, message: string) => {
    sendNotification(id, "message", message);
  };



  // Define Table Column Metadata
  const columns: ColumnDef<Appointment>[] = [
    {
      header: "Customer",
      accessor: "customerName",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Service",
      accessor: "serviceName",
      className: "text-gray-900",
    },
    {
      header: "Time",
      accessor: (row) => `Today, ${row.time}`,
      className: "text-gray-500 font-medium",
    },
    {
      header: "Stylist",
      accessor: "staffName",
      className: "text-gray-900 font-medium",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      align: "center",
    },
    {
      header: "Price",
      accessor: "price",
      className: "font-bold text-gray-900",
      align: "right",
    },
  ];

  // Dynamic Metrics Computations
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const active = appointments.filter(a => a.status === "confirmed").length;
    const completed = appointments.filter(a => a.status === "completed").length;

    return { total, pending, active, completed };
  }, [appointments]);

  // Real-time Search Filtering
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return appointments;
    const query = searchQuery.toLowerCase();
    return appointments.filter(
      apt =>
        apt.customerName.toLowerCase().includes(query) ||
        apt.serviceName.toLowerCase().includes(query) ||
        apt.staffName.toLowerCase().includes(query)
    );
  }, [appointments, searchQuery]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Block */}
        <SectionHeader 
          title="Appointments" 
          description="Manage salon booking requests, styling schedules, and stylist assignments."
          action={
            <button
              onClick={() => setIsNewDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              New Appointment
            </button>
          }
        />

        {/* Dashboard KPIs Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Bookings"
            value={stats.total}
            description="Overall appointments scheduled"
            icon={Calendar}
            iconColor="indigo"
          />
          <StatsCard 
            title="Pending Approval"
            value={stats.pending}
            description="Bookings awaiting verification"
            icon={Users}
            change={{ value: `${stats.pending} pending`, type: stats.pending > 0 ? "increase" : "neutral" }}
            iconColor="amber"
          />
          <StatsCard 
            title="Confirmed Styles"
            value={stats.active}
            description="Upcoming sessions today"
            icon={Scissors}
            iconColor="blue"
          />
          <StatsCard 
            title="Completed Visits"
            value={stats.completed}
            description="Finished styles today"
            icon={Check}
            iconColor="emerald"
          />
        </div>

        {/* Main Operational Container */}
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
          {/* Toolbar with inline view toggle */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by customer, service, or stylist..."
            actions={
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  Showing {filteredAppointments.length} of {appointments.length}
                </span>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-0.5">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 cursor-pointer select-none ${
                      viewMode === "table"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 cursor-pointer select-none ${
                      viewMode === "calendar"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
            }
          />

          {/* TABLE VIEW */}
          {viewMode === "table" && (
            <div className="overflow-hidden">
              <DataTable 
                columns={columns}
                data={filteredAppointments}
                isLoading={false}
                onRowClick={(row) => setSelectedAppointment(row)}
              />
            </div>
          )}

          {/* CALENDAR VIEW */}
          {viewMode === "calendar" && (
            <div className="flex flex-col gap-0 animate-admin-in">
              {/* Day header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h3>
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  {filteredAppointments.length} appointments
                </span>
              </div>

              {/* Time slot rows */}
              <div className="flex flex-col border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                {["09:00 AM", "10:30 AM", "11:45 AM", "01:00 PM", "01:15 PM", "02:30 PM", "03:45 PM", "04:30 PM", "05:15 PM"].map((slot) => {
                  const slotAppts = filteredAppointments.filter(a => a.time === slot);
                  return (
                    <div key={slot} className="flex min-h-[56px] border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 group hover:bg-gray-50/40 dark:hover:bg-gray-800/30 transition-colors">
                      {/* Time label */}
                      <div className="w-24 shrink-0 flex items-start pt-3.5 px-4 border-r border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {slot}
                        </span>
                      </div>

                      {/* Appointment cards for this slot */}
                      <div className="flex-1 flex flex-wrap gap-2 p-2.5 min-h-[56px]">
                        {slotAppts.length > 0 ? slotAppts.map((apt) => (
                          <button
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all duration-150 hover:shadow-sm active:scale-[0.99] cursor-pointer select-none ${
                              apt.status === "confirmed" ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900 hover:border-indigo-300" :
                              apt.status === "pending" ? "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900 hover:border-amber-300" :
                              apt.status === "completed" ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300" :
                              "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col gap-0">
                              <span className={`text-xs font-bold leading-tight ${
                                apt.status === "confirmed" ? "text-indigo-900 dark:text-indigo-200" :
                                apt.status === "pending" ? "text-amber-900 dark:text-amber-200" :
                                apt.status === "completed" ? "text-emerald-900 dark:text-emerald-200" :
                                "text-gray-600 dark:text-gray-300"
                              }`}>
                                {apt.customerName}
                              </span>
                              <span className={`text-[10px] font-medium leading-tight ${
                                apt.status === "confirmed" ? "text-indigo-600 dark:text-indigo-400" :
                                apt.status === "pending" ? "text-amber-600 dark:text-amber-400" :
                                apt.status === "completed" ? "text-emerald-600 dark:text-emerald-400" :
                                "text-gray-400 dark:text-gray-500"
                              }`}>
                                {apt.serviceName} · {apt.staffName}
                              </span>
                            </div>
                          </button>
                        )) : (
                          <span className="text-[10px] text-gray-300 dark:text-gray-600 font-medium self-center ml-1">No appointments</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details side-sheet Drawer */}
      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onComplete={handleComplete}
        onSendCustomAlert={handleSendCustomAlert}
      />

      {/* Create New Appointment Drawer */}
      <Drawer
        isOpen={isNewDrawerOpen}
        onClose={() => setIsNewDrawerOpen(false)}
        title="New Booking Request"
        description="Fill out the customer details, service type, time slot, and staff assignment."
        size="md"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setIsNewDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAppointment}
              disabled={!newCustomer.trim() || selectedServices.length === 0}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer select-none"
            >
              Create Appointment
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateAppointment} className="space-y-5 animate-fade-in-quick">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Service Selector (Multi-select Checklist) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Select Services
              </label>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                {selectedServices.length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-850">
              {servicesList.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] select-none ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900"
                        : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-750 hover:bg-gray-50/50 dark:hover:bg-gray-700/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedServices(prev =>
                            prev.includes(service.id)
                              ? prev.filter(id => id !== service.id)
                              : [...prev, service.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-900/10 accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                          {service.name}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-450 dark:text-gray-500">
                          {service.category} · {service.duration}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {service.price}
                    </span>
                  </label>
                );
              })}
            </div>
            {selectedServices.length > 0 && (
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg border border-gray-100 dark:border-gray-805">
                <span>Combined Summary:</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {servicesList.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + (parseInt(s.duration.replace(/[^0-9]/g, ""), 10) || 0), 0)} Min
                  {" · "}
                  ₱{servicesList.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + (parseInt(s.price.replace(/[^0-9]/g, ""), 10) || 0), 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Stylist Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Assign Stylist
            </label>
            <select
              value={newStaff}
              onChange={(e) => setNewStaff(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Alex Rivera">Alex Rivera</option>
              <option value="Taylor Cruz">Taylor Cruz</option>
              <option value="Jordan Patels">Jordan Patels</option>
              <option value="Morgan Webb">Morgan Webb</option>
            </select>
          </div>

          {/* Time Slot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Scheduled Time
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          {/* Special notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Special Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Prefers vegan hair wash, hair treatment notes..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>
    </AdminLayout>
  );
}
