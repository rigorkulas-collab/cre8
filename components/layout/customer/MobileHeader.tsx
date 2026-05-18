"use client";

import React from "react";
import { ChevronLeft, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export default function MobileHeader({
  title,
  showBackButton = false,
  onBackClick,
  rightAction,
  isDark = false,
  onToggleDark,
}: MobileHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full shrink-0 items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 transition-colors duration-200">
      {/* Left Slot: Back Button */}
      <div className="flex w-12 items-center justify-start select-none">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Go Back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Center Slot: Title */}
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate tracking-wider uppercase">
          {title}
        </h1>
      </div>

      {/* Right Slot: Custom Action or Theme Toggle */}
      <div className="flex w-12 items-center justify-end select-none">
        {rightAction ? (
          <div className="flex items-center justify-end">
            {rightAction}
          </div>
        ) : onToggleDark ? (
          <button
            onClick={onToggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-2xs select-none cursor-pointer focus:outline-none transition-colors duration-150"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Moon className="h-4 w-4 text-gray-650" />
            )}
          </button>
        ) : null}
      </div>
    </header>
  );
}

