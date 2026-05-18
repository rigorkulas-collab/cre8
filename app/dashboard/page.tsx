"use client";

import React, { useMemo } from "react";
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
  ChevronRight
} from "lucide-react";

import { Service } from "@/types";
import { mockFeaturedServices } from "@/lib/mock-data/mockServices";

export default function DashboardPage() {
  const router = useRouter();

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
                  Silver Member
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-none">
                  Balance
                </span>
                <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mt-1.5 leading-none">
                  150 Points
                </span>
              </div>
            </div>

            {/* Custom linear progress bar for monochrome look */}
            <div className="flex flex-col gap-1.5 select-none pt-1">
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/10">
                <div className="bg-gray-900 dark:bg-gray-100 h-full w-[75%]" />
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-600 dark:text-gray-400">
                <span>150 pts</span>
                <span>Only 50 pts to styling gift</span>
              </div>
            </div>

            <button
              onClick={() => alert("Styling gift tiers detail simulated successfully!")}
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
