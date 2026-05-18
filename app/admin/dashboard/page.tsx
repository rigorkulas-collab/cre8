"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";

import AppointmentDetailsDrawer from "@/components/shared/AppointmentDetailsDrawer";
import { 
  Calendar, 
  CreditCard, 
  Scissors, 
  Users, 
  Eye, 
  Check, 
  X,
  TrendingUp,
  Activity,
  UserCheck
} from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  time: string;
  staffName: string;
  status: string;
  price: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "APT-001",
    customerName: "Sophia Martinez",
    serviceName: "Hair Color",
    time: "10:30 AM",
    staffName: "Elena Rostova",
    status: "confirmed",
    price: "₱2,500",
  },
  {
    id: "APT-002",
    customerName: "Liam Johnson",
    serviceName: "Deep Facial Glow",
    time: "11:45 AM",
    staffName: "David Miller",
    status: "pending",
    price: "₱1,200",
  },
  {
    id: "APT-003",
    customerName: "Emma Watson",
    serviceName: "Keratin Rebond",
    time: "01:15 PM",
    staffName: "Elena Rostova",
    status: "completed",
    price: "₱3,500",
  },
  {
    id: "APT-004",
    customerName: "Olivia Brown",
    serviceName: "Premium Cut",
    time: "02:30 PM",
    staffName: "Sarah Jenkins",
    status: "confirmed",
    price: "₱500",
  },
  {
    id: "APT-005",
    customerName: "Noah Davis",
    serviceName: "Deep Facial Glow",
    time: "03:45 PM",
    staffName: "David Miller",
    status: "cancelled",
    price: "₱1,200",
  },
];

const popularServices = [
  { name: "Hair Color", count: 18, percentage: 40, trend: "+12%", color: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)]" },
  { name: "Keratin Rebond", count: 12, percentage: 27, trend: "+8%", color: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.25)]" },
  { name: "Premium Cut", count: 9, percentage: 20, trend: "+5%", color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.25)]" },
  { name: "Deep Facial Glow", count: 6, percentage: 13, trend: "-2%", color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)]" },
];

const quickActions = [
  { name: "Book Appointment", description: "Schedule client booking", href: "/admin/appointments", icon: Calendar, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30" },
  { name: "Manage Services", description: "Edit treatment catalog", href: "/admin/services", icon: Scissors, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30" },
  { name: "Client Directory", description: "View profile records", href: "/admin/customers", icon: Users, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" },
  { name: "Billing & Invoices", description: "Audit processed sales", href: "/admin/payments", icon: CreditCard, color: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30" },
];

const operationsLog = [
  {
    time: "10:15 AM",
    message: "Sophia Martinez's Hair Color appointment was confirmed.",
    user: "Elena Rostova",
    icon: Check,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    time: "09:30 AM",
    message: "New booking request received from Liam Johnson for Deep Facial Glow.",
    user: "System Integration",
    icon: Calendar,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    time: "08:45 AM",
    message: "David Miller checked-in for active stylist duty.",
    user: "David Miller",
    icon: UserCheck,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    time: "08:00 AM",
    message: "Daily operation checklist completed: POS terminal sync succeeded.",
    user: "Administrator",
    icon: Activity,
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
];

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleApprove = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: "confirmed" } : apt
    ));
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "confirmed" } : null);
    }
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: "cancelled" } : apt
    ));
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "cancelled" } : null);
    }
  };

  const handleComplete = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: "completed" } : apt
    ));
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: "completed" } : null);
    }
  };


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

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Container */}
        <SectionHeader
          title="Dashboard"
          description="Real-time operational summary, active appointment flow, and daily sales metrics."
          action={
            <div className="hidden sm:inline-flex text-xs font-semibold text-gray-500 dark:text-gray-400 select-none items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Today: {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          }
        />

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Daily Revenue"
            value="₱24,650.00"
            description="Net processing today"
            change={{ value: "+12.4%", type: "increase" }}
            icon={CreditCard}
            iconColor="blue"
          />
          <StatsCard
            title="Appointments"
            value="18 Active"
            description="4 pending verification"
            change={{ value: "+8.2%", type: "increase" }}
            icon={Calendar}
            iconColor="indigo"
          />
          <StatsCard
            title="Stylists On Duty"
            value="5 Active"
            description="98% time utilization"
            change={{ value: "100%", type: "neutral" }}
            icon={Users}
            iconColor="emerald"
          />
          <StatsCard
            title="Avg. Booking Value"
            value="₱1,350.00"
            description="Avg. spend per visit"
            change={{ value: "+4.1%", type: "increase" }}
            icon={Scissors}
            iconColor="amber"
          />
        </div>

        {/* Main Operations Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Side: Recent Appointments Grid Table (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Recent Appointments Today
              </h3>
              <Link href="/admin/appointments" className="text-xs font-semibold text-gray-900 dark:text-gray-300 hover:underline cursor-pointer">
                View All
              </Link>
            </div>

            <DataTable
              columns={columns}
              data={appointments}
              isLoading={false}
              onRowClick={(row) => setSelectedAppointment(row)}
            />
          </div>

          {/* Right Side: Popular Services list */}
          <div className="flex flex-col gap-4 h-full">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Popular Services Today
            </h3>

            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
              {popularServices.map((service, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">{service.count} bookings</span>
                      <span className="text-xs text-emerald-600 flex items-center font-bold">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        {service.trend}
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100/50 dark:border-gray-700/50">
                    <div 
                      className={`h-full ${service.color} rounded-full transition-[width] duration-700 ease-out`}
                      style={{ width: barsVisible ? `${service.percentage}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Operational Analytics Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Columns: Recent Salon Operations Log (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Real-time Operations Log
            </h3>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
              <div className="relative border-l border-gray-100 dark:border-gray-800 pl-6 ml-3 flex flex-col gap-6">
                {operationsLog.map((log, index) => {
                  const LogIcon = log.icon;
                  return (
                    <div key={index} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      {/* Timeline Dot Icon */}
                      <span className={`absolute -left-[37px] h-7 w-7 rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-800 ${log.iconBg}`}>
                        <LogIcon className={`h-3 w-3 ${log.iconColor}`} />
                      </span>
                      
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {log.message}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                          Logged by {log.user}
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap self-start sm:self-center">
                        {log.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Operations (Spans 1 col) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Quick Operations
            </h3>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <Link 
                    key={index} 
                    href={action.href}
                    className="flex items-center justify-between p-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-950/40 dark:hover:bg-gray-800/60 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${action.color}`}>
                        <ActionIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none group-hover:text-black dark:group-hover:text-white transition-colors">{action.name}</span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium leading-none">{action.description}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <AppointmentDetailsDrawer
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onApprove={handleApprove}
          onCancel={handleCancel}
          onComplete={handleComplete}
        />
      </div>
    </AdminLayout>
  );
}
