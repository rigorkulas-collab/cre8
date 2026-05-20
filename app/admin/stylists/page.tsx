"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Drawer from "@/components/shared/Drawer";
import TableToolbar from "@/components/tables/TableToolbar";
import { 
  Users, 
  Clock, 
  Calendar, 
  CalendarOff, 
  Plus, 
  Trash2, 
  Save, 
  UserCheck, 
  Briefcase,
  PieChart
} from "lucide-react";
import { mockStylists } from "@/lib/mock-data/mockStaff";

interface ShiftTime {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface StylistShifts {
  stylistId: string;
  stylistName: string;
  role: string;
  schedule: {
    [day: string]: ShiftTime;
  };
}

interface LeaveBlock {
  id: string;
  stylistId: string;
  stylistName: string;
  date: string;
  reason: string;
}

interface StylistProfile {
  id: string;
  name: string;
  role: string;
  rating: string;
}

const defaultWeeklySchedule = {
  Monday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
  Tuesday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
  Wednesday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
  Thursday: { isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
  Friday: { isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
  Saturday: { isOpen: true, openTime: "08:00 AM", closeTime: "09:00 PM" },
  Sunday: { isOpen: false, openTime: "08:00 AM", closeTime: "08:00 PM" }
};

const defaultStylistShifts: StylistShifts[] = [
  {
    stylistId: "STL-001",
    stylistName: "Alex River",
    role: "Senior Stylist",
    schedule: {
      ...defaultWeeklySchedule,
      Sunday: { isOpen: false, openTime: "08:00 AM", closeTime: "08:00 PM" }
    }
  },
  {
    stylistId: "STL-002",
    stylistName: "Jo Jordan",
    role: "Nail Artist",
    schedule: {
      ...defaultWeeklySchedule,
      Monday: { isOpen: false, openTime: "09:00 AM", closeTime: "08:00 PM" },
      Sunday: { isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" }
    }
  },
  {
    stylistId: "STL-003",
    stylistName: "Maria Cruz",
    role: "Skin Therapist",
    schedule: {
      ...defaultWeeklySchedule,
      Tuesday: { isOpen: false, openTime: "09:00 AM", closeTime: "08:00 PM" },
      Sunday: { isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" }
    }
  }
];

const defaultLeaves: LeaveBlock[] = [
  {
    id: "LV-001",
    stylistId: "STL-003",
    stylistName: "Maria Cruz",
    date: "2026-05-22",
    reason: "Family Vacation Out of Town"
  }
];

export default function AdminStylistsPage() {
  const [activeTab, setActiveTab] = useState<"shifts" | "leaves">("shifts");
  const [stylists, setStylists] = useState<StylistProfile[]>([]);
  const [shifts, setShifts] = useState<StylistShifts[]>([]);
  const [leaves, setLeaves] = useState<LeaveBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  
  // Drawer States
  const [selectedStylistShifts, setSelectedStylistShifts] = useState<StylistShifts | null>(null);
  const [isLeaveDrawerOpen, setIsLeaveDrawerOpen] = useState(false);
  const [isStylistDrawerOpen, setIsStylistDrawerOpen] = useState(false);

  // Form States for Leave
  const [formStylistId, setFormStylistId] = useState("");
  const [formLeaveDate, setFormLeaveDate] = useState("");
  const [formLeaveReason, setFormLeaveReason] = useState("");

  // Form States for Stylist Profile Creation
  const [formStylistName, setFormStylistName] = useState("");
  const [formStylistRole, setFormStylistRole] = useState("");
  const [formStylistRating, setFormStylistRating] = useState("4.9");

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load stylists profiles
      const storedStylists = localStorage.getItem("cre8_stylists");
      let activeStylistList: StylistProfile[] = [];
      if (storedStylists) {
        activeStylistList = JSON.parse(storedStylists);
        setStylists(activeStylistList);
      } else {
        activeStylistList = mockStylists.filter(s => s.id !== "STL-004");
        setStylists(activeStylistList);
        localStorage.setItem("cre8_stylists", JSON.stringify(activeStylistList));
      }

      // Load shifts schedule
      const storedShifts = localStorage.getItem("cre8_stylist_shifts");
      if (storedShifts) {
        setShifts(JSON.parse(storedShifts));
      } else {
        setShifts(defaultStylistShifts);
        localStorage.setItem("cre8_stylist_shifts", JSON.stringify(defaultStylistShifts));
      }

      // Load leaves list
      const storedLeaves = localStorage.getItem("cre8_stylist_leaves");
      if (storedLeaves) {
        setLeaves(JSON.parse(storedLeaves));
      } else {
        setLeaves(defaultLeaves);
        localStorage.setItem("cre8_stylist_leaves", JSON.stringify(defaultLeaves));
      }

      // Read appointments for utilization metrics
      const storedApts = localStorage.getItem("cre8_appointments");
      if (storedApts) {
        const apts = JSON.parse(storedApts);
        setAppointmentsCount(apts.length);
      }
    }
  }, []);

  // Compute operational metrics
  const metrics = useMemo(() => {
    const totalStylists = stylists.length;

    // Scheduled today: check weekday name of today
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = new Date().getDay();
    const todayName = days[todayIndex];
    
    let workingToday = 0;
    shifts.forEach(s => {
      if (s.schedule[todayName]?.isOpen) {
        // also check if on leave today
        const todayISO = new Date().toISOString().split("T")[0];
        const hasLeave = leaves.some(l => l.stylistId === s.stylistId && l.date === todayISO);
        if (!hasLeave) workingToday++;
      }
    });

    // Today's Capacity Utilization
    let totalAvailableSlots = 0;
    shifts.forEach(s => {
      const daySched = s.schedule[todayName];
      if (daySched?.isOpen) {
        const todayISO = new Date().toISOString().split("T")[0];
        const hasLeave = leaves.some(l => l.stylistId === s.stylistId && l.date === todayISO);
        if (!hasLeave) {
          const openH = parseInt(daySched.openTime.split(":")[0]) + (daySched.openTime.includes("PM") && !daySched.openTime.startsWith("12") ? 12 : 0);
          const closeH = parseInt(daySched.closeTime.split(":")[0]) + (daySched.closeTime.includes("PM") && !daySched.closeTime.startsWith("12") ? 12 : 0);
          totalAvailableSlots += Math.max(0, closeH - openH);
        }
      }
    });

    let todayAptCount = 0;
    if (typeof window !== "undefined") {
      const storedApts = localStorage.getItem("cre8_appointments");
      if (storedApts) {
        const apts = JSON.parse(storedApts);
        const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        todayAptCount = apts.filter((a: any) => a.date === todayStr && a.status !== "cancelled").length;
      }
    }

    const utilization = totalAvailableSlots > 0 
      ? Math.round((todayAptCount / totalAvailableSlots) * 100) 
      : 0;

    return {
      totalStylists,
      workingToday,
      activeLeaves: leaves.length,
      utilization: `${utilization}%`,
      todayAptCount
    };
  }, [stylists, shifts, leaves]);

  // Handle saving stylist shifts
  const handleSaveShifts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStylistShifts) return;

    const updated = shifts.map(s => 
      s.stylistId === selectedStylistShifts.stylistId ? selectedStylistShifts : s
    );
    setShifts(updated);
    localStorage.setItem("cre8_stylist_shifts", JSON.stringify(updated));
    setSelectedStylistShifts(null);
  };

  // Handle registering a new blockout/leave
  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStylistId || !formLeaveDate || !formLeaveReason.trim()) return;

    const stylist = stylists.find(s => s.id === formStylistId);
    if (!stylist) return;

    const newLeave: LeaveBlock = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      stylistId: formStylistId,
      stylistName: stylist.name,
      date: formLeaveDate,
      reason: formLeaveReason
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    localStorage.setItem("cre8_stylist_leaves", JSON.stringify(updated));
    setIsLeaveDrawerOpen(false);
    
    // Clear forms
    setFormStylistId("");
    setFormLeaveDate("");
    setFormLeaveReason("");
  };

  // Handle creating a new stylist profile & default schedule
  const handleCreateStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStylistName.trim() || !formStylistRole.trim()) return;

    const newId = `STL-${Math.floor(100 + Math.random() * 900)}`;
    const newProfile: StylistProfile = {
      id: newId,
      name: formStylistName,
      role: formStylistRole,
      rating: formStylistRating || "4.9"
    };

    // Update Stylists
    const updatedStylists = [...stylists, newProfile];
    setStylists(updatedStylists);
    localStorage.setItem("cre8_stylists", JSON.stringify(updatedStylists));

    // Initialize Default Schedule
    const newShifts: StylistShifts = {
      stylistId: newId,
      stylistName: formStylistName,
      role: formStylistRole,
      schedule: {
        Monday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
        Tuesday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
        Wednesday: { isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
        Thursday: { isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
        Friday: { isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
        Saturday: { isOpen: true, openTime: "08:00 AM", closeTime: "09:00 PM" },
        Sunday: { isOpen: false, openTime: "08:00 AM", closeTime: "08:00 PM" }
      }
    };

    const updatedShifts = [...shifts, newShifts];
    setShifts(updatedShifts);
    localStorage.setItem("cre8_stylist_shifts", JSON.stringify(updatedShifts));

    // Reset drawer state
    setFormStylistName("");
    setFormStylistRole("");
    setFormStylistRating("4.9");
    setIsStylistDrawerOpen(false);
  };

  // Handle deleting a leave
  const handleDeleteLeave = (id: string) => {
    const updated = leaves.filter(l => l.id !== id);
    setLeaves(updated);
    localStorage.setItem("cre8_stylist_leaves", JSON.stringify(updated));
  };

  // Columns definition for Leaves table
  const leaveColumns: ColumnDef<LeaveBlock>[] = [
    {
      header: "Stylist Name",
      accessor: "stylistName",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Blocked Date",
      accessor: (row) => {
        const d = new Date(row.date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      },
      className: "text-gray-900 font-semibold",
    },
    {
      header: "Reason / Event Description",
      accessor: "reason",
      className: "text-gray-500",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteLeave(row.id);
          }}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
          title="Remove Blockout"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      align: "center",
    }
  ];

  // Filtering for shifts search
  const filteredShifts = useMemo(() => {
    if (!searchQuery.trim()) return shifts;
    const query = searchQuery.toLowerCase();
    return shifts.filter(s => 
      s.stylistName.toLowerCase().includes(query) || 
      s.role.toLowerCase().includes(query)
    );
  }, [shifts, searchQuery]);

  // Filtering for leaves search
  const filteredLeaves = useMemo(() => {
    if (!searchQuery.trim()) return leaves;
    const query = searchQuery.toLowerCase();
    return leaves.filter(l => 
      l.stylistName.toLowerCase().includes(query) || 
      l.reason.toLowerCase().includes(query)
    );
  }, [leaves, searchQuery]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <SectionHeader
          title="Stylist Rostering & Shifts"
          description="Schedule stylist working shifts, block off leaves/holidays, and monitor staff utilization metrics."
          action={
            activeTab === "shifts" ? (
              <button
                onClick={() => setIsStylistDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm animate-fade-in-quick"
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Stylist
              </button>
            ) : (
              <button
                onClick={() => setIsLeaveDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm animate-fade-in-quick"
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Leave/Blockout
              </button>
            )
          }
        />

        {/* Scheduling Metrics Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Capacity"
            value={metrics.utilization}
            description="Booked slots vs. shift availability"
            icon={PieChart}
            iconColor="indigo"
          />
          <StatsCard
            title="Specialists on Duty"
            value={`${metrics.workingToday} active`}
            description={`Out of ${metrics.totalStylists} rostered stylists`}
            icon={UserCheck}
            iconColor="emerald"
          />
          <StatsCard
            title="Bookings Today"
            value={`${metrics.todayAptCount} sessions`}
            description="Current daily scheduled volume"
            icon={Calendar}
            iconColor="blue"
          />
          <StatsCard
            title="Staff Leaves"
            value={`${metrics.activeLeaves} blocked`}
            description="Active holiday/sick leaves scheduled"
            icon={CalendarOff}
            iconColor="amber"
          />
        </div>

        {/* Tab Navigation & List */}
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
          
          {/* Sub-tab toggles */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 pb-px">
            <button
              onClick={() => {
                setActiveTab("shifts");
                setSearchQuery("");
              }}
              className={`pb-3 text-xs font-bold border-b-2 px-1 transition-all cursor-pointer ${
                activeTab === "shifts"
                  ? "border-gray-950 text-gray-950 dark:border-gray-100 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Weekly Shift Roster
            </button>
            <button
              onClick={() => {
                setActiveTab("leaves");
                setSearchQuery("");
              }}
              className={`ml-6 pb-3 text-xs font-bold border-b-2 px-1 transition-all cursor-pointer ${
                activeTab === "leaves"
                  ? "border-gray-950 text-gray-950 dark:border-gray-100 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Leaves & Holidays ({leaves.length})
            </button>
          </div>

          {/* TAB 1: WEEKLY SHIFT ROSTER */}
          {activeTab === "shifts" && (
            <div className="flex flex-col gap-5">
              <TableToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search stylists by name or specialization role..."
              />

              {/* Roster Grid View */}
              <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold">
                      <th className="py-3 px-4 min-w-[150px]">Stylist</th>
                      <th className="py-3 px-4 text-center">Mon</th>
                      <th className="py-3 px-4 text-center">Tue</th>
                      <th className="py-3 px-4 text-center">Wed</th>
                      <th className="py-3 px-4 text-center">Thu</th>
                      <th className="py-3 px-4 text-center">Fri</th>
                      <th className="py-3 px-4 text-center">Sat</th>
                      <th className="py-3 px-4 text-center">Sun</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                    {filteredShifts.map((stylist) => (
                      <tr 
                        key={stylist.stylistId}
                        onClick={() => setSelectedStylistShifts(JSON.parse(JSON.stringify(stylist)))}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 dark:text-gray-100">{stylist.stylistName}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{stylist.role}</span>
                          </div>
                        </td>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const sched = stylist.schedule[day];
                          return (
                            <td key={day} className="py-4 px-4 text-center">
                              {sched?.isOpen ? (
                                <div className="flex flex-col items-center">
                                  <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                    ON DUTY
                                  </span>
                                  <span className="text-[9px] font-medium text-gray-400 mt-1">
                                    {sched.openTime.replace(" AM", "").replace(" PM", "")} - {sched.closeTime.replace(" AM", "").replace(" PM", "")}
                                  </span>
                                </div>
                              ) : (
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                  OFF
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedStylistShifts(JSON.parse(JSON.stringify(stylist)))}
                            className="text-xs font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
                          >
                            Edit Hours
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LEAVES & HOLIDAYS */}
          {activeTab === "leaves" && (
            <div className="flex flex-col gap-5">
              <TableToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search active leaves, stylist profiles, or notes..."
              />

              <div className="overflow-hidden">
                <DataTable
                  columns={leaveColumns}
                  data={filteredLeaves}
                  isLoading={false}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DRAWER 1: EDIT WEEKLY SHIFT HOURS */}
      <Drawer
        isOpen={!!selectedStylistShifts}
        onClose={() => setSelectedStylistShifts(null)}
        title="Roster Shift Hours"
        description={`Set standard weekly operational hours and off-days for ${selectedStylistShifts?.stylistName}.`}
        size="lg"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setSelectedStylistShifts(null)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveShifts}
              className="px-3.5 py-2 inline-flex items-center gap-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Shifts
            </button>
          </div>
        }
      >
        {selectedStylistShifts && (
          <form onSubmit={handleSaveShifts} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 select-none">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
              const sched = selectedStylistShifts.schedule[day] || { isOpen: false, openTime: "09:00 AM", closeTime: "08:00 PM" };
              return (
                <div 
                  key={day}
                  className={`grid grid-cols-1 sm:grid-cols-12 items-center gap-4 px-4 py-3 rounded-lg border transition-all ${
                    sched.isOpen 
                      ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800" 
                      : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60"
                  }`}
                >
                  <div className="sm:col-span-4 flex items-center justify-between sm:justify-start gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSched = { ...selectedStylistShifts.schedule };
                        updatedSched[day] = { ...sched, isOpen: !sched.isOpen };
                        setSelectedStylistShifts({
                          ...selectedStylistShifts,
                          schedule: updatedSched
                        });
                      }}
                      className={`inline-flex text-[10px] font-bold py-1 px-2.5 rounded-md border tracking-tight uppercase shrink-0 transition-all cursor-pointer ${
                        sched.isOpen 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400" 
                          : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-500"
                      }`}
                    >
                      {sched.isOpen ? "Active" : "Off"}
                    </button>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none">{day}</span>
                  </div>

                  {sched.isOpen ? (
                    <>
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400">Open Shift</label>
                        <select
                          value={sched.openTime}
                          onChange={(e) => {
                            const updatedSched = { ...selectedStylistShifts.schedule };
                            updatedSched[day] = { ...sched, openTime: e.target.value };
                            setSelectedStylistShifts({
                              ...selectedStylistShifts,
                              schedule: updatedSched
                            });
                          }}
                          className="h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none cursor-pointer"
                        >
                          <option value="07:00 AM">07:00 AM</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400">Close Shift</label>
                        <select
                          value={sched.closeTime}
                          onChange={(e) => {
                            const updatedSched = { ...selectedStylistShifts.schedule };
                            updatedSched[day] = { ...sched, closeTime: e.target.value };
                            setSelectedStylistShifts({
                              ...selectedStylistShifts,
                              schedule: updatedSched
                            });
                          }}
                          className="h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none cursor-pointer"
                        >
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                          <option value="07:00 PM">07:00 PM</option>
                          <option value="08:00 PM">08:00 PM</option>
                          <option value="09:00 PM">09:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-8 text-[11px] font-medium text-gray-400 py-1">
                      Stylist is scheduled Off-Duty for this day.
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        )}
      </Drawer>

      {/* DRAWER 2: ADD HOLIDAY LEAVE / BLOCKOUT */}
      <Drawer
        isOpen={isLeaveDrawerOpen}
        onClose={() => setIsLeaveDrawerOpen(false)}
        title="Schedule Leave / Blockout"
        description="Register a vacation or sick day to temporarily disable calendar booking slots for a stylist."
        size="md"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setIsLeaveDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLeave}
              disabled={!formStylistId || !formLeaveDate || !formLeaveReason.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Block Out Date
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddLeave} className="space-y-5 animate-fade-in-quick">
          {/* Stylist Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Select Roster Stylist
            </label>
            <select
              required
              value={formStylistId}
              onChange={(e) => setFormStylistId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="">-- Choose Stylist --</option>
              {stylists.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Blockout Date
            </label>
            <input
              type="date"
              required
              value={formLeaveDate}
              onChange={(e) => setFormLeaveDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Leave Description / Reason
            </label>
            <textarea
              rows={4}
              required
              value={formLeaveReason}
              onChange={(e) => setFormLeaveReason(e.target.value)}
              placeholder="e.g. Medical Checkup, Annual Leave, Seminar..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>

      {/* DRAWER 3: ADD NEW STYLIST RASTER */}
      <Drawer
        isOpen={isStylistDrawerOpen}
        onClose={() => setIsStylistDrawerOpen(false)}
        title="Register Stylist Specialist"
        description="Add a new professional stylist, their role specialty, and initialize their weekly shift template."
        size="md"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setIsStylistDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStylist}
              disabled={!formStylistName.trim() || !formStylistRole.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Add Specialist
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateStylist} className="space-y-5 animate-fade-in-quick">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Stylist Full Name
            </label>
            <input
              type="text"
              required
              value={formStylistName}
              onChange={(e) => setFormStylistName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Specialty / Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Specialty Specialty (e.g. Hair Coloring, Balayage, Nail Artistry)
            </label>
            <input
              type="text"
              required
              value={formStylistRole}
              onChange={(e) => setFormStylistRole(e.target.value)}
              placeholder="e.g. Senior Color Specialist"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Initial Rating */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Initial Experience Rating
            </label>
            <select
              value={formStylistRating}
              onChange={(e) => setFormStylistRating(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="5.0">5.0 (Flawless)</option>
              <option value="4.9">4.9 (Exceptional)</option>
              <option value="4.8">4.8 (Highly Rated)</option>
              <option value="4.7">4.7 (Experienced)</option>
            </select>
          </div>
        </form>
      </Drawer>

    </AdminLayout>
  );
}
