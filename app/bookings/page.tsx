"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import MembersOnlyWall from "@/components/shared/ui/MembersOnlyWall";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Button from "@/components/ui/Button";
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  Trash2, 
  X, 
  AlertTriangle, 
  Star, 
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Appointment } from "@/types";
import { initialAppointments } from "@/lib/mock-data/mockBookings";

export default function BookingsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("cre8_user_role") || "member");
    }
  }, []);

  // Interactive Reschedule Sheet state
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [tempDate, setTempDate] = useState<string>("");
  const [tempTime, setTempTime] = useState<string>("");

  // Interactive Cancel Dialog state
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Review sheet state
  const [reviewAptId, setReviewAptId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Upcoming appointments partition
  const upcomingBookings = useMemo(() => {
    return appointments.filter(
      apt => apt.status === "pending" || apt.status === "confirmed" || apt.status === "rescheduled" || apt.status === "in progress"
    );
  }, [appointments]);

  // Historical/past appointments partition
  const pastBookings = useMemo(() => {
    return appointments.filter(
      apt => apt.status === "completed" || apt.status === "cancelled"
    );
  }, [appointments]);

  // Horizontal swipe picker date list generation (today + 10 days)
  const calendarDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const future = new Date(today);
      future.setDate(today.getDate() + i);
      
      const dayName = future.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = future.toLocaleDateString("en-US", { day: "2-digit" });
      const fullDate = future.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      
      dates.push({ dayName, dayNum, fullDate });
    }
    return dates;
  }, []);

  const timeSlots = [
    { label: "Morning", slots: ["09:00 AM", "10:00 AM", "10:30 AM", "11:00 AM"] },
    { label: "Afternoon", slots: ["01:00 PM", "02:00 PM", "03:00 PM", "04:30 PM"] },
    { label: "Evening", slots: ["06:00 PM", "07:00 PM"] }
  ];

  // Reschedule trigger handlers
  const handleOpenReschedule = (apt: Appointment) => {
    setSelectedAptId(apt.id);
    setTempDate(apt.date);
    setTempTime(apt.time);
    setIsRescheduleOpen(true);
  };

  const handleSaveReschedule = () => {
    if (!tempDate || !tempTime) {
      alert("Please select both a date and time slot.");
      return;
    }
    setAppointments(prev =>
      prev.map(apt => 
        apt.id === selectedAptId 
          ? { ...apt, date: tempDate, time: tempTime, status: "rescheduled" } 
          : apt
      )
    );
    setIsRescheduleOpen(false);
    setSelectedAptId(null);
    alert("Styling session rescheduled successfully!");
  };

  // Cancellation dialog handlers
  const handleOpenCancel = (id: string) => {
    setSelectedAptId(id);
    setIsCancelOpen(true);
  };

  const handleSaveCancel = () => {
    setAppointments(prev =>
      prev.map(apt => apt.id === selectedAptId ? { ...apt, status: "cancelled" } : apt)
    );
    setIsCancelOpen(false);
    setSelectedAptId(null);
    alert("Styling session cancelled successfully.");
  };

  // Review dialog handler
  const handleOpenReview = (id: string) => {
    setReviewAptId(id);
    setRating(5);
    setComment("");
  };

  const handleSaveReview = () => {
    alert("Thank you for your rating! Your review helps us curate premium salon treatments.");
    setReviewAptId(null);
  };

  if (userRole === null) {
    return (
      <CustomerLayout
        showBottomNav={true}
        headerProps={{ title: "MY BOOKINGS", showBackButton: false }}
      >
        <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-200" />
      </CustomerLayout>
    );
  }

  if (userRole === "guest") {
    return (
      <CustomerLayout
        showBottomNav={true}
        headerProps={{ title: "MY BOOKINGS", showBackButton: false }}
      >
        <MembersOnlyWall />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      showBottomNav={true}
      headerProps={{ title: "MY BOOKINGS", showBackButton: false }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none overflow-y-auto scrollbar-none pb-24 relative animate-page-in transition-colors duration-200">
        
        {/* Navigation Selector Tabs */}
        <div className="px-4 py-3 shrink-0 flex select-none bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
          <div className="flex w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-xl transition-colors duration-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex-1 py-2.5 text-center text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none",
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
                "flex-1 py-2.5 text-center text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none",
                activeTab === "past"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              History
            </button>
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="flex-1 p-4 flex flex-col gap-4">

          {activeTab === "upcoming" && (
            <>
              {upcomingBookings.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 flex flex-col gap-4 shadow-2xs hover:border-gray-900 dark:hover:border-gray-600 transition-colors duration-150"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 truncate">
                        {apt.serviceName}
                      </h3>
                      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                        Stylist: {apt.stylistName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400 mt-1 select-none">
                        <span>Duration: {apt.duration}</span>
                        <span>•</span>
                        <span>Price: {apt.price}</span>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400 select-none">
                      <Calendar className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span>{apt.date} • {apt.time}</span>
                    </div>

                    <div className="flex gap-2.5 w-full max-w-[240px]">
                      <button
                        onClick={() => handleOpenCancel(apt.id)}
                        className="flex-1 text-center text-[11px] font-bold text-gray-750 dark:text-gray-350 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/80 dark:hover:bg-gray-800 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleOpenReschedule(apt)}
                        className="flex-1 text-center text-[11px] font-bold text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingBookings.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-gray-200 dark:text-gray-700 shrink-0 mb-3" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 animate-fade-in-quick">
                    No upcoming booking records
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 max-w-[200px]">
                    Schedule a treatment from our menu catalog
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/browse-services")}
                    className="mt-4 rounded-2xl py-3.5 px-8 text-sm font-bold animate-fade-in-quick"
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
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 flex flex-col gap-4 shadow-2xs opacity-85"
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

                    <div className="flex gap-2">
                      {apt.status === "completed" && (
                        <button
                          onClick={() => handleOpenReview(apt.id)}
                          className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                        >
                          Review Treatment
                        </button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/booking?serviceId=${apt.serviceId}`)}
                        className="text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                      >
                        <RefreshCw className="h-3 w-3 shrink-0" />
                        Rebook Session
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {pastBookings.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-gray-200 dark:text-gray-700 shrink-0 mb-3" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    No completed booking history
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Completed styling details will render here
                  </p>
                </div>
              )}
            </>
          )}

        </div>

        {/* Reschedule Interactive Drawer Sheet Overlay */}
        {mounted && typeof document !== "undefined" && document.getElementById("customer-modal-portal") && isRescheduleOpen
          ? createPortal(
              <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end transition-opacity duration-200 pointer-events-auto">
                <div className="flex-1" onClick={() => setIsRescheduleOpen(false)} />
                
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-2xl max-h-[88%] flex flex-col shadow-2xl p-5 select-none animate-slide-up pb-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 mb-4 shrink-0">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Reschedule Appointment
                  </h3>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                    Choose a new scheduling date and time slot
                  </p>
                </div>
                <button
                  onClick={() => setIsRescheduleOpen(false)}
                  className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 active:scale-90 border border-gray-200 dark:border-gray-700 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-5">
                
                {/* 10-day swipeable calendar bar */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
                    Select New Date
                  </span>
                  
                  <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 select-none">
                    {calendarDates.map((item, idx) => {
                      const isSelected = tempDate === item.fullDate;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTempDate(item.fullDate)}
                          className={cn(
                            "flex flex-col items-center justify-center min-w-[52px] h-[58px] rounded-xl border transition-all cursor-pointer select-none",
                            isSelected
                              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100 shadow-xs scale-102 font-extrabold"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          <span className="text-[8px] uppercase tracking-wider font-bold">
                            {item.dayName}
                          </span>
                          <span className="text-xs font-black mt-0.5 leading-none">
                            {item.dayNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available time slots matrix grid */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
                    Select New Time Slot
                  </span>

                  <div className="flex flex-col gap-4">
                    {timeSlots.map((section, sIdx) => (
                      <div key={sIdx} className="flex flex-col gap-2">
                        <span className="text-[8px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                          {section.label}
                        </span>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {section.slots.map((slot, tIdx) => {
                            const isSelected = tempTime === slot;
                            return (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => setTempTime(slot)}
                                className={cn(
                                  "py-2 px-1 text-center text-[9px] font-extrabold uppercase rounded-lg border transition-all cursor-pointer select-none",
                                  isSelected
                                    ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900 shadow-xs font-black"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-100"
                                )}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Reschedule actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  <button
                    onClick={() => setIsRescheduleOpen(false)}
                    className="flex-1 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReschedule}
                    className="flex-1 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Confirm Schedule
                  </button>
                </div>

                  </div>
                </div>
              </div>,
              document.getElementById("customer-modal-portal")!
            )
          : null}

        {/* Cancellation Confirmation Dialog Overlay (Portalled to avoid container padding clipping) */}
        {mounted && typeof document !== "undefined" && document.getElementById("customer-modal-portal") && isCancelOpen
          ? createPortal(
              <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pointer-events-auto">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-[280px] p-5 flex flex-col items-center text-center shadow-2xl animate-fade-in select-none">
                  <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 mb-3 shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Cancel Appointment
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-2.5 leading-normal">
                    Are you sure you want to cancel this styling session? This action cannot be undone.
                  </p>

                  <div className="flex w-full gap-2.5 mt-5">
                    <button
                      onClick={() => setIsCancelOpen(false)}
                      className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
                    >
                      No, Keep
                    </button>
                    <button
                      onClick={handleSaveCancel}
                      className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-red-200"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>,
              document.getElementById("customer-modal-portal")!
            )
          : null}

        {/* Review Dialog Overlay (Portalled to avoid container padding clipping) */}
        {mounted && typeof document !== "undefined" && document.getElementById("customer-modal-portal") && reviewAptId
          ? createPortal(
              <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pointer-events-auto">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-[290px] p-5 flex flex-col shadow-2xl animate-fade-in select-none">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-3 shrink-0">
                <span className="text-[10px] font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Review Styling Session
                </span>
                <button onClick={() => setReviewAptId(null)}>
                  <X className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Five Star Selector */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[8px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Rate Stylist & Treatment
                  </span>
                  
                  <div className="flex gap-1.5 mt-1 select-none">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isActive = (hoverRating || rating) >= starNum;
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starNum)}
                          className="p-1 cursor-pointer transition-transform active:scale-120"
                        >
                          <Star
                            className={cn(
                              "h-5 w-5 transition-colors duration-150",
                              isActive
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-200 dark:text-gray-700"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Input Field */}
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Share Your Experience
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a brief comment about your stylist..."
                    rows={3}
                    className="w-full text-[10px] font-medium border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none bg-gray-50/20 dark:bg-gray-800 placeholder:text-gray-350 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100 leading-normal"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setReviewAptId(null)}
                    className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveReview}
                    className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>

              </div>
            </div>
          </div>,
              document.getElementById("customer-modal-portal")!
            )
          : null}

      </div>
    </CustomerLayout>
  );
}
