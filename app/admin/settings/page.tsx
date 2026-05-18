"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import { 
  Building, 
  Clock, 
  CreditCard, 
  Calendar, 
  Save, 
  Check, 
  Loader2,
  Lock,
  Percent,
  CheckSquare,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for settings state
interface GeneralSettings {
  salonName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
}

interface BookingSettings {
  minLeadTime: string;
  slotInterval: string;
  autoConfirm: boolean;
  loyaltyProgram: boolean;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface PaymentSettings {
  gcashMerchantId: string;
  mayaMerchantId: string;
  requireDeposit: boolean;
  depositPercentage: string;
  processingFee: string;
}

export default function AdminSettingsPage() {
  const [activeCategory, setActiveCategory] = useState<"general" | "bookings" | "hours" | "payments">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State Definitions
  const [general, setGeneral] = useState<GeneralSettings>({
    salonName: "CRE8 Salon & Spa",
    address: "114 Ortigas Ave Ext, Cainta, 1900 Rizal, Philippines",
    phone: "+63 917 123 4567",
    email: "hello@cre8salon.com",
    currency: "PHP (₱)"
  });

  const [bookings, setBookings] = useState<BookingSettings>({
    minLeadTime: "2 hours",
    slotInterval: "30 minutes",
    autoConfirm: false,
    loyaltyProgram: true
  });

  const [hours, setHours] = useState<DaySchedule[]>([
    { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
    { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
    { day: "Saturday", isOpen: true, openTime: "08:00 AM", closeTime: "09:00 PM" },
    { day: "Sunday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" }
  ]);

  const [payments, setPayments] = useState<PaymentSettings>({
    gcashMerchantId: "GCASH-CRE8-MNL",
    mayaMerchantId: "MAYA-CRE8-MERCHANT",
    requireDeposit: true,
    depositPercentage: "20%",
    processingFee: "1.50%"
  });

  // Action Triggers
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    }, 1200);
  };

  const toggleDay = (index: number) => {
    setHours(prev => prev.map((item, idx) => 
      idx === index ? { ...item, isOpen: !item.isOpen } : item
    ));
  };

  const updateDayTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    setHours(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    ));
  };

  // Categories Navigation definition
  const categories = [
    { id: "general", label: "General Info", icon: Building, desc: "Salon identity and contacts" },
    { id: "bookings", label: "Booking Rules", icon: Calendar, desc: "Lead times and loyalty rules" },
    { id: "hours", label: "Business Hours", icon: Clock, desc: "Weekly open & close times" },
    { id: "payments", label: "Payment Gateway", icon: CreditCard, desc: "GCash/Maya settlements" }
  ] as const;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Settings"
          description="Configure salon operational parameters, booking policies, weekly hours, and payment configurations."
          action={
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer select-none justify-center shadow-sm",
                saveSuccess 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 shrink-0" />
                  Configuration Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 shrink-0" />
                  Save Changes
                </>
              )}
            </button>
          }
        />

        {/* Main Settings Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Left Side: Category Navigator */}
          <div className="md:col-span-1 flex flex-col gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-left transition-all border select-none cursor-pointer group",
                    isActive
                      ? "bg-gray-950 border-gray-950 text-white shadow-sm"
                      : "bg-white dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"
                  )} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    <span className={cn(
                      "text-[10px] leading-tight font-medium",
                      isActive ? "text-gray-400" : "text-gray-400 group-hover:text-gray-500"
                    )}>{cat.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Side: Active Category Form Panel */}
          <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              
              {/* 1. General Settings Form Block */}
              {activeCategory === "general" && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">General Information</h3>
                    <p className="text-xs font-medium text-gray-400">Configure salon branding, location address, and primary contact coordinates.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Salon Name</label>
                      <input
                        type="text"
                        value={general.salonName}
                        onChange={(e) => setGeneral({ ...general, salonName: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="e.g. CRE8 Salon"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Primary Currency</label>
                      <div className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 shadow-sm flex items-center justify-between select-none">
                        <span>{general.currency}</span>
                        <Lock className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500">Physical Address</label>
                      <input
                        type="text"
                        value={general.address}
                        onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="e.g. Ground Floor, CRE8 Building..."
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Contact Hotline</label>
                      <input
                        type="text"
                        value={general.phone}
                        onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="e.g. +63 917 123 4567"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Support Email</label>
                      <input
                        type="email"
                        value={general.email}
                        onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                        placeholder="e.g. hello@cre8salon.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Booking Rules Form Block */}
              {activeCategory === "bookings" && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Booking Rules & Policies</h3>
                    <p className="text-xs font-medium text-gray-400">Establish minimum notification requirements, slot step sizes, and automated confirmation parameters.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Min. Lead Time (Notice Period)</label>
                      <select
                        value={bookings.minLeadTime}
                        onChange={(e) => setBookings({ ...bookings, minLeadTime: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer select-none"
                      >
                        <option value="Immediate">Immediate Booking</option>
                        <option value="1 hour">1 Hour Notice</option>
                        <option value="2 hours">2 Hours Notice</option>
                        <option value="4 hours">4 Hours Notice</option>
                        <option value="12 hours">12 Hours Notice</option>
                        <option value="24 hours">24 Hours Notice</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Time Slot Grid Interval</label>
                      <select
                        value={bookings.slotInterval}
                        onChange={(e) => setBookings({ ...bookings, slotInterval: e.target.value })}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer select-none"
                      >
                        <option value="15 minutes">15 Minutes Intervals</option>
                        <option value="30 minutes">30 Minutes Intervals</option>
                        <option value="45 minutes">45 Minutes Intervals</option>
                        <option value="1 hour">1 Hour Intervals</option>
                      </select>
                    </div>

                    {/* Intersecting Toggles */}
                    <div className="sm:col-span-2 flex flex-col gap-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg p-4 mt-2">
                      <div className="flex items-start justify-between gap-4 cursor-pointer select-none" onClick={() => setBookings({ ...bookings, autoConfirm: !bookings.autoConfirm })}>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Auto-Confirm Booking Flow</span>
                          <span className="text-[10px] font-medium text-gray-400">If enabled, guest bookings bypass administrative verification and mark directly as "confirmed".</span>
                        </div>
                        <button 
                          type="button" 
                          className="text-gray-900 shrink-0 transition-colors focus:outline-none"
                        >
                          {bookings.autoConfirm ? (
                            <CheckSquare className="h-5 w-5 fill-gray-900 text-white shrink-0" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-300 hover:text-gray-900 shrink-0" />
                          )}
                        </button>
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-gray-800" />

                      <div className="flex items-start justify-between gap-4 cursor-pointer select-none" onClick={() => setBookings({ ...bookings, loyaltyProgram: !bookings.loyaltyProgram })}>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Enable Guest Loyalty Portal Tiers</span>
                          <span className="text-[10px] font-medium text-gray-400">Award loyalty visits counters per booked cut to elevate client profiles to VIP states.</span>
                        </div>
                        <button 
                          type="button" 
                          className="text-gray-900 shrink-0 transition-colors focus:outline-none"
                        >
                          {bookings.loyaltyProgram ? (
                            <CheckSquare className="h-5 w-5 fill-gray-900 text-white shrink-0" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-300 hover:text-gray-900 shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Business Hours Form Block */}
              {activeCategory === "hours" && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Business Operational Hours</h3>
                    <p className="text-xs font-medium text-gray-400">Set weekly operational schedules for stylist availability and booking slots limits.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {hours.map((item, idx) => (
                      <div 
                        key={item.day} 
                        className={cn(
                          "grid grid-cols-1 sm:grid-cols-4 items-center gap-4 px-4 py-3 rounded-lg border transition-all select-none",
                          item.isOpen 
                            ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800" 
                            : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60"
                        )}
                      >
                        <div className="sm:col-span-1 flex items-center justify-between sm:justify-start gap-4">
                          <button
                            type="button"
                            onClick={() => toggleDay(idx)}
                            className={cn(
                              "inline-flex text-[10px] font-bold py-1 px-2.5 rounded-md border tracking-tight uppercase shrink-0 transition-all cursor-pointer",
                              item.isOpen 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400" 
                                : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                            )}
                          >
                            {item.isOpen ? "Open" : "Closed"}
                          </button>
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none">{item.day}</span>
                        </div>

                        {item.isOpen ? (
                          <>
                            <div className="sm:col-span-1 flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-gray-400">Opens At</label>
                              <select
                                value={item.openTime}
                                onChange={(e) => updateDayTime(idx, "openTime", e.target.value)}
                                className="h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer"
                              >
                                <option value="07:00 AM">07:00 AM</option>
                                <option value="08:00 AM">08:00 AM</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                              </select>
                            </div>

                            <div className="sm:col-span-1 flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-gray-400">Closes At</label>
                              <select
                                value={item.closeTime}
                                onChange={(e) => updateDayTime(idx, "closeTime", e.target.value)}
                                className="h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer"
                              >
                                <option value="06:00 PM">06:00 PM</option>
                                <option value="07:00 PM">07:00 PM</option>
                                <option value="08:00 PM">08:00 PM</option>
                                <option value="09:00 PM">09:00 PM</option>
                                <option value="10:00 PM">10:00 PM</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          <div className="sm:col-span-2 text-xs font-medium text-gray-400 py-1">
                            Stylists off duty. Bookings disabled for this weekday.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Payment Gateway Setup Form Block */}
              {activeCategory === "payments" && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Payment Gateway Reconciliation</h3>
                    <p className="text-xs font-medium text-gray-400">Connect merchant reference codes, require scheduling downpayments, and configure gateway processing commissions.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">GCash Merchant Ref. Token</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={payments.gcashMerchantId}
                          onChange={(e) => setPayments({ ...payments, gcashMerchantId: e.target.value })}
                          className="h-[42px] w-full pl-9 pr-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                          placeholder="GCASH-MERCHANT-ID"
                          required
                        />
                        <CreditCard className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400 shrink-0" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Maya Merchant Ref. Token</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={payments.mayaMerchantId}
                          onChange={(e) => setPayments({ ...payments, mayaMerchantId: e.target.value })}
                          className="h-[42px] w-full pl-9 pr-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                          placeholder="MAYA-MERCHANT-ID"
                          required
                        />
                        <CreditCard className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400 shrink-0" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Gateway Processing Fee Margin</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={payments.processingFee}
                          onChange={(e) => setPayments({ ...payments, processingFee: e.target.value })}
                          className="h-[42px] w-full pl-9 pr-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none transition-colors"
                          placeholder="1.50%"
                          required
                        />
                        <Percent className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400 shrink-0" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500">Required Deposit Percentage</label>
                      <select
                        value={payments.depositPercentage}
                        onChange={(e) => setPayments({ ...payments, depositPercentage: e.target.value })}
                        disabled={!payments.requireDeposit}
                        className="h-[42px] px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-gray-200/50 dark:border-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-600 shadow-sm focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors cursor-pointer select-none"
                      >
                        <option value="10%">10% Deposit</option>
                        <option value="20%">20% Deposit</option>
                        <option value="50%">50% Deposit</option>
                        <option value="100%">100% Pre-payment</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 flex items-start justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg p-4 mt-2 cursor-pointer select-none" onClick={() => setPayments({ ...payments, requireDeposit: !payments.requireDeposit })}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Enforce Guest Pre-payment Deposit</span>
                        <span className="text-[10px] font-medium text-gray-400">If enabled, booking requests require a secure downpayment processed through GCash/Maya before slot allocation is certified.</span>
                      </div>
                      <button 
                        type="button" 
                        className="text-gray-900 shrink-0 transition-colors focus:outline-none"
                      >
                        {payments.requireDeposit ? (
                          <CheckSquare className="h-5 w-5 fill-gray-900 text-white shrink-0" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-300 hover:text-gray-900 shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Footer Action Block (Only visible in mobile view if required, or as a secondary submit) */}
              <div className="h-px bg-gray-100 dark:bg-gray-800 mt-4 md:hidden" />
              <button
                type="submit"
                disabled={isSaving}
                className="md:hidden w-full h-[42px] inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 shrink-0" />
                    Save Settings Configuration
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
