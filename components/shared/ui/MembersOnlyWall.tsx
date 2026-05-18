"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface MembersOnlyWallProps {
  title?: string;
  description?: string;
}

export default function MembersOnlyWall({ 
  title = "Members-Only Portal", 
  description = "Sign in or create an account to access appointment history, active bookings, and profile details." 
}: MembersOnlyWallProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 justify-center items-center p-6 text-center select-none pb-24 transition-colors duration-200">
      <h3 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-2.5 max-w-[220px] leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col gap-2 w-full max-w-[200px] mt-6">
        <Button
          variant="primary"
          onClick={() => router.push("/login")}
          className="w-full py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider"
        >
          Sign In
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/signup")}
          className="w-full py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-250 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
