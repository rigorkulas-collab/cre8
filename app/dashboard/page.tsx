"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Button from "@/components/ui/Button";
import { 
  Calendar, 
  Scissors, 
  CalendarDays, 
  Compass, 
  Sparkles, 
  Gift, 
  ChevronRight,
  Bell,
  MailOpen
} from "lucide-react";

import { Service } from "@/types";
import { mockFeaturedServices } from "@/lib/mock-data/mockServices";

export default function DashboardPage() {
  const router = useRouter();
  const [loyalty, setLoyalty] = useState({ points: 150, tier: "Silver Member" });
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cre8_customer_loyalty");
      if (stored) {
        setLoyalty(JSON.parse(stored));
      } else {
        const initial = { points: 150, tier: "Silver Member" };
        localStorage.setItem("cre8_customer_loyalty", JSON.stringify(initial));
        setLoyalty(initial);
      }

      const storedNotifications = localStorage.getItem("cre8_notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        const defaultNotifications = [
          {
            id: "NTF-001",
            appointmentId: "APT-001",
            title: "Welcome to CRE8 Salon!",
            content: "Your premier styling experience starts here. Explore our Treatment Services catalog to select and book a premium beauty session.",
            date: "May 19, 09:00 AM",
            read: false
          }
        ];
        localStorage.setItem("cre8_notifications", JSON.stringify(defaultNotifications));
        setNotifications(defaultNotifications);
      }
    }
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem("cre8_notifications", JSON.stringify(next));
      return next;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem("cre8_notifications", JSON.stringify(next));
      return next;
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem("cre8_notifications", JSON.stringify([]));
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  }, []);

  return (
    <CustomerLayout
      showBottomNav={true}
      headerProps={{ title: "CRE8 SALON", showBackButton: false }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none overflow-y-auto scrollbar-none pb-24 animate-page-in transition-colors duration-200">
        
        {/* Top Greeting Area */}
        <div className="px-4 pt-6 pb-4 flex flex-col gap-1 select-none border-b border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 transition-colors duration-200">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-none">
            {today}
          </span>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mt-1.5 leading-none">
            Hello, Zachary
          </h2>
        </div>

        {/* Interactive Notification Center / Inbox */}
        <div className="p-4 flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/5 dark:bg-gray-850/5 transition-colors duration-200">
          <div className="flex justify-between items-center select-none">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-none">
                Inbox & Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-950 text-[10px] font-black h-4.5 min-w-4.5 px-1 rounded-full animate-pulse-slow">
                  {unreadCount}
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-extrabold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 uppercase tracking-wider cursor-pointer"
                >
                  Mark All Read
                </button>
                <span className="text-gray-300 dark:text-gray-800 text-xs">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-[10px] font-extrabold text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 uppercase tracking-wider cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((notification, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-4.5 flex gap-3.5 transition-all duration-200 relative ${
                    notification.read 
                      ? "bg-white dark:bg-gray-800/40 border-gray-150 dark:border-gray-800" 
                      : "bg-gray-50/60 dark:bg-gray-800 border-gray-900/10 dark:border-gray-700 shadow-3xs"
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <span className="absolute top-4.5 right-4.5 h-2 w-2 rounded-full bg-gray-950 dark:bg-gray-100" />
                  )}

                  <div className="h-8 w-8 rounded-full bg-gray-100/80 dark:bg-gray-900 flex items-center justify-center shrink-0 text-gray-700 dark:text-gray-350 border border-gray-100 dark:border-gray-800">
                    <Bell className={`h-4 w-4 ${!notification.read ? "animate-bounce" : ""}`} />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-1.5 pr-4">
                      <h4 className={`text-xs truncate ${notification.read ? "font-bold text-gray-705 dark:text-gray-300" : "font-extrabold text-gray-950 dark:text-white"}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold">{notification.date}</span>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${notification.read ? "font-semibold text-gray-500 dark:text-gray-400" : "font-semibold text-gray-800 dark:text-gray-200"}`}>
                      {notification.content}
                    </p>

                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="self-start mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
                      >
                        <MailOpen className="h-3 w-3 shrink-0" />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10">
                <p className="text-xs font-semibold text-gray-400">Inbox is clean. Any changes to your bookings will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointment Preview Section */}
        <div className="p-4 flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-none select-none">
            Upcoming Styling Session
          </h3>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-4.5 shadow-2xs transition-colors duration-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate">
                  Premium Cut
                </h4>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                  Stylist: Alex River
                </p>
              </div>
              <StatusBadge status="confirmed" />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-3 transition-colors duration-200">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 select-none">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>May 20, 2026 • 02:00 PM</span>
              </div>
              
              <div className="flex gap-2.5 w-full max-w-[240px]">
                <button
                  onClick={() => alert("Reschedule request simulated successfully!")}
                  className="flex-1 text-center text-[11px] font-bold text-gray-750 dark:text-gray-350 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => router.push("/bookings")}
                  className="flex-1 text-center text-[11px] font-bold text-white dark:text-gray-100 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 py-2.5 rounded-xl border border-gray-900 dark:border-gray-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Treatments */}
        <div className="p-4 flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/10 dark:bg-gray-800/5 transition-colors duration-200">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-none select-none">
            Featured Treatments
          </h3>

          <div className="flex flex-col">
            {mockFeaturedServices.map((service) => (
              <div
                key={service.id}
                onClick={() => router.push(`/booking?serviceId=${service.id}`)}
                className="group flex items-center justify-between gap-4 p-4 mb-2 bg-white dark:bg-gray-800/40 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 border border-gray-100 dark:border-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.99] shadow-2xs select-none"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 group-hover:underline truncate">
                      {service.name}
                    </h4>
                    <span className="text-[10.5px] font-bold text-gray-600 dark:text-gray-400 shrink-0">
                      ({service.duration})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 line-clamp-1 leading-normal">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {service.price}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotions & Loyalty Progress Banner */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-none select-none">
            Loyalty Rewards Program
          </h3>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-5 shadow-2xs bg-gradient-to-br from-white dark:from-gray-800 to-gray-50/20 dark:to-gray-900/20 transition-all duration-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-none">
                  Membership Level
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1.5 leading-none flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-100/30" />
                  {loyalty.tier}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-none">
                  Balance
                </span>
                <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mt-1.5 leading-none">
                  {loyalty.points} Points
                </span>
              </div>
            </div>

            {/* Custom linear progress bar for monochrome look */}
            <div className="flex flex-col gap-1.5 select-none pt-1">
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/10">
                <div 
                  className="bg-gray-900 dark:bg-gray-100 h-full transition-[width] duration-350" 
                  style={{ width: `${Math.min(100, (loyalty.points / (loyalty.points < 200 ? 200 : loyalty.points < 400 ? 400 : 600)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-600 dark:text-gray-400">
                <span>{loyalty.points} pts</span>
                <span>
                  {loyalty.points < 200 
                    ? `Only ${200 - loyalty.points} pts to styling gift` 
                    : loyalty.points < 400 
                      ? `Only ${400 - loyalty.points} pts to Gold status` 
                      : `You have reached Gold status!`}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`Loyalty Tiers:\n- Bronze Member: < 100 pts\n- Silver Member: 100 - 299 pts\n- Gold Member: 300+ pts\n\nCurrent Balance: ${loyalty.points} pts`)}
              className="w-full py-3.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-750 dark:text-gray-300 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Gift className="h-3.5 w-3.5 text-rose-500 shrink-0 animate-pulse" />
              View Loyalty Benefits
            </button>
          </div>
        </div>

      </div>
    </CustomerLayout>
  );
}
