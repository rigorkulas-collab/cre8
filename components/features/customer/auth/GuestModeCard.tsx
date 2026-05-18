"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function GuestModeCard() {
  const router = useRouter();

  const handleGuestAccess = () => {
    // Navigate straight to the guest-allowed browse services menu
    if (typeof window !== "undefined") {
      localStorage.setItem("cre8_user_role", "guest");
    }
    router.push("/browse-services");
  };

  return (
    <div className="w-full bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors duration-200">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Or Continue as Guest
        </h2>
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
          Book appointments without creating a password.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 pt-1">
        {/* Guest Benefits List */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider select-none">
            Guest Access
          </span>
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              Browse Services
            </li>
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              View Stylists
            </li>
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              Book Instantly
            </li>
          </ul>
        </div>

        {/* Guest Limits List */}
        <div className="flex flex-col gap-2 border-l border-gray-100 dark:border-gray-850 pl-3.5">
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-450 uppercase tracking-wider select-none">
            Account Required
          </span>
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
              <Lock className="h-3 w-3 text-amber-500 shrink-0" />
              Booking History
            </li>
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
              <Lock className="h-3 w-3 text-amber-500 shrink-0" />
              Profile Details
            </li>
            <li className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
              <Lock className="h-3 w-3 text-amber-500 shrink-0" />
              Rescheduling
            </li>
          </ul>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleGuestAccess}
        className="w-full rounded-xl text-xs flex items-center justify-center gap-1.5 py-5 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-98 transition-all font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
      >
        Continue as Guest
        <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
      </Button>
    </div>
  );
}
