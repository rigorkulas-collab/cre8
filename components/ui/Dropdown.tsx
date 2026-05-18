"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  dividerBelow?: boolean;
}

interface DropdownHeaderObj {
  name: string;
  email: string;
  avatarUrl?: string;
  avatarFallback?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  header?: string | DropdownHeaderObj;
}

export default function Dropdown({
  trigger,
  items,
  align = "right",
  className,
  header,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Slot */}
      <div onClick={() => setIsOpen(!isOpen)} className="inline-block cursor-pointer">
        {trigger}
      </div>

      {/* Floating Menu Dropdown Popover */}
      {isOpen && (
        <div 
          className={cn(
            "absolute mt-2 w-56 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {header && typeof header === "object" ? (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1 select-none">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold flex items-center justify-center text-xs border border-gray-200/60 dark:border-gray-700 overflow-hidden shrink-0">
                {header.avatarUrl ? (
                  <img src={header.avatarUrl} alt={header.name} className="w-full h-full object-cover" />
                ) : (
                  header.avatarFallback || header.name.charAt(0)
                )}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate leading-snug">
                  {header.name}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {header.email}
                </span>
              </div>
            </div>
          ) : header ? (
            <>
              <div className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 px-3 py-2">
                {header as string}
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            </>
          ) : null}

          <div className="flex flex-col gap-0.5">
            {items.map((item, idx) => {
              if (!item) return null;
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <button
                    disabled={item.disabled}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between text-xs font-bold rounded-lg px-3 py-2 cursor-pointer transition-colors text-left",
                      item.disabled
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed select-none bg-transparent"
                        : item.danger 
                        ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950" 
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
                      item.className
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className={cn("w-3.5 h-3.5 shrink-0", item.danger ? "text-red-400" : item.disabled ? "text-gray-300 dark:text-gray-600" : "text-gray-400 dark:text-gray-500")} />}
                      <span>{item.label}</span>
                    </div>
                    {item.rightElement && (
                      <div className="shrink-0 flex items-center justify-center">
                        {item.rightElement}
                      </div>
                    )}
                  </button>
                  {item.dividerBelow && (
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
