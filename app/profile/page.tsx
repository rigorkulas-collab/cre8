"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import MembersOnlyWall from "@/components/shared/ui/MembersOnlyWall";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Button from "@/components/ui/Button";
import FormInput from "@/components/shared/forms/FormInput";
import FormActions from "@/components/shared/forms/FormActions";
import { 
  Calendar, 
  Mail, 
  User, 
  RefreshCw,
  Phone,
  X,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Appointment } from "@/types";
import { initialAppointments } from "@/lib/mock-data/mockBookings";
import { mockCustomer } from "@/lib/mock-data/mockCustomer";

export default function ProfilePage() {
  const router = useRouter();
  
  // User Profile information states
  const [profileName, setProfileName] = useState(mockCustomer.name);
  const [profileEmail, setProfileEmail] = useState(mockCustomer.email);
  const [profileMobile, setProfileMobile] = useState(mockCustomer.mobile);

  // Temporary Edit Modal states
  const [tempName, setTempName] = useState(mockCustomer.name);
  const [tempEmail, setTempEmail] = useState(mockCustomer.email);
  const [tempMobile, setTempMobile] = useState(mockCustomer.mobile);
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [userRole, setUserRole] = useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("cre8_user_role") || "member");
    }
  }, []);

  // Compute initials dynamically
  const initials = useMemo(() => {
    return profileName
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, [profileName]);

  // In-memory active appointments filter
  const upcomingBookings = useMemo(() => {
    return appointments.filter(apt => apt.status === "pending" || apt.status === "confirmed");
  }, [appointments]);

  const pastBookings = useMemo(() => {
    return appointments.filter(apt => apt.status === "completed" || apt.status === "cancelled");
  }, [appointments]);

  // Cancel Appointment state handler
  const handleCancelAppointment = (id: string) => {
    if (confirm("Are you sure you want to cancel this styling session?")) {
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, status: "cancelled" } : apt)
      );
    }
  };

  // Open Edit Dialog and sync state
  const handleOpenEdit = () => {
    setTempName(profileName);
    setTempEmail(profileEmail);
    setTempMobile(profileMobile);
    setErrors({});
    setIsEditOpen(true);
  };

  // Handle profile form save triggers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!tempName.trim()) {
      newErrors.name = "Profile name is required";
    }
    if (!tempEmail.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(tempEmail)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!tempMobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{10,12}$/.test(tempMobile.replace(/[\s-]/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    setTimeout(() => {
      setProfileName(tempName);
      setProfileEmail(tempEmail);
      setProfileMobile(tempMobile);
      setIsSaving(false);
      setIsEditOpen(false);
      alert("Profile details updated successfully!");
    }, 600);
  };

  if (userRole === null) {
    return (
      <CustomerLayout
        showBottomNav={true}
        headerProps={{ title: "My Portal", showBackButton: false }}
      >
        <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-200" />
      </CustomerLayout>
    );
  }

  if (userRole === "guest") {
    return (
      <CustomerLayout
        showBottomNav={true}
        headerProps={{ title: "My Portal", showBackButton: false }}
      >
        <MembersOnlyWall />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      showBottomNav={true}
      headerProps={{ title: "My Portal", showBackButton: false }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none overflow-y-auto scrollbar-none pb-24 relative animate-page-in transition-colors duration-200">
        
        {/* Profile Info Header Card Panel */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 select-none bg-gray-50/30 dark:bg-gray-800/10 transition-colors duration-200">
          <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border border-gray-800/80 dark:border-gray-800/80 rounded-3xl p-6 flex flex-col gap-5 shadow-md relative overflow-hidden">
            
            {/* Horizontal Row Wrapper */}
            <div className="flex items-center gap-4.5 w-full">
              
              {/* Initials Avatar (Left Aligned) */}
              <div className="h-16 w-16 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-center font-extrabold text-xl shrink-0 shadow-sm transition-colors duration-200">
                {initials}
              </div>
              
              {/* Customer Details (Right Aligned to Avatar) */}
              <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wide truncate w-full">
                  {profileName}
                </h2>
                
                <div className="flex flex-col items-start gap-1 text-[10px] font-semibold text-gray-300 mt-0.5 w-full">
                  <span className="flex items-center gap-1.5 truncate w-full">
                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {profileEmail}
                  </span>
                  <span className="flex items-center gap-1.5 mt-0.5 truncate w-full">
                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {profileMobile}
                  </span>
                </div>
              </div>
            </div>

            {/* Action edit button (Translucent) */}
            <button
              onClick={handleOpenEdit}
              className="w-full mt-1 text-xs font-bold text-white bg-white/10 hover:bg-white/15 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98] cursor-pointer select-none"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Dashboard Insight Statistics */}
        <div className="grid grid-cols-2 gap-2 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0 select-none bg-white dark:bg-gray-900 transition-colors duration-200">
          <div className="flex flex-col items-center gap-0.5 border-r border-gray-100 dark:border-gray-800">
            <span className="text-[8px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider leading-none">
              Sessions
            </span>
            <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100 mt-1 leading-none">
              {appointments.filter(a => a.status === "completed").length} Done
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider leading-none">
              Active
            </span>
            <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100 mt-1 leading-none">
              {upcomingBookings.length} Booked
            </span>
          </div>
        </div>

        {/* Tab Selection Filter */}
        <div className="px-4 py-3 shrink-0 flex select-none bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
          <div className="flex w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl transition-colors duration-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer select-none",
                activeTab === "upcoming"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer select-none",
                activeTab === "past"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              History
            </button>
          </div>
        </div>

        {/* Dynamic List Container */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          
          {activeTab === "upcoming" && (
            <>
              {upcomingBookings.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5.5 flex flex-col gap-4.5 shadow-2xs hover:border-gray-900 dark:hover:border-gray-600 transition-colors duration-150"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 truncate">
                        {apt.serviceName}
                      </h3>
                      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                        Stylist: {apt.stylistName}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400 select-none">
                      <Calendar className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span>{apt.date} • {apt.time}</span>
                    </div>
                    
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-[11px] font-bold text-gray-750 dark:text-gray-350 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/80 dark:hover:bg-gray-800 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-[0.98] cursor-pointer shrink-0"
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              ))}

              {upcomingBookings.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-gray-200 dark:text-gray-700 shrink-0 mb-3" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 animate-fade-in-quick">
                    No upcoming styling appointments
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
                    Secure a slot by browsing our services catalog
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/browse-services")}
                    className="mt-4 rounded-xl py-3 px-8 text-xs font-semibold animate-fade-in-quick"
                  >
                    Browse Services
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === "past" && (
            <>
              {pastBookings.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5.5 flex flex-col gap-4.5 shadow-2xs opacity-85"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 truncate">
                        {apt.serviceName}
                      </h3>
                      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                        Stylist: {apt.stylistName}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400 select-none">
                      <Calendar className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span>{apt.date} • {apt.time}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/booking?serviceId=${apt.serviceId}`)}
                      className="text-[10px] font-semibold px-4 py-2 rounded-lg flex items-center gap-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                    >
                      <RefreshCw className="h-3 w-3 shrink-0" />
                      Book Again
                    </Button>
                  </div>
                </div>
              ))}

              {pastBookings.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-gray-200 dark:text-gray-700 shrink-0 mb-3" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    No history records
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                    Your completed appointments will show up here
                  </p>
                </div>
              )}
            </>
          )}

        </div>

        {/* Logout Section */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 transition-colors duration-200">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("cre8_user_role");
              }
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer select-none"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
            Sign Out
          </button>
        </div>

      </div>

      {/* Dedicated Full Screen Edit Profile Page (Rendered in Portal target for perfect edge-to-edge layout) */}
      {mounted && typeof document !== "undefined" && document.getElementById("customer-modal-portal") && isEditOpen
        ? createPortal(
            <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col p-6 animate-fade-in-quick pointer-events-auto select-none transition-colors duration-200">
              
              {/* Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-gray-800 mb-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="h-9 w-9 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 active:scale-90 transition-all cursor-pointer border border-gray-200 dark:border-gray-700 shadow-2xs bg-white dark:bg-gray-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                    Edit Profile
                  </h3>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                    Update your client account parameters
                  </p>
                </div>
              </div>

              {/* Form Input Container */}
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 flex-1 overflow-y-auto scrollbar-none pb-6">
                <FormInput
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  error={errors.name}
                  disabled={isSaving}
                  required
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  error={errors.email}
                  disabled={isSaving}
                  required
                />

                <FormInput
                  label="Mobile Number"
                  type="tel"
                  placeholder="e.g. 09171234567"
                  value={tempMobile}
                  onChange={(e) => setTempMobile(e.target.value)}
                  error={errors.mobile}
                  disabled={isSaving}
                  required
                />

                {/* Spacious actions layout */}
                <div className="mt-auto pt-6 flex flex-col gap-2.5">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl text-xs font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

            </div>,
            document.getElementById("customer-modal-portal")!
          )
        : null}
    </CustomerLayout>
  );
}
