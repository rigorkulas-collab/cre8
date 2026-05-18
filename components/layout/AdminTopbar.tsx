"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, Search, LogOut, Check, AlertTriangle, CreditCard, Calendar, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: "appointment" | "payment" | "system";
}

export default function AdminTopbar({ onMenuClick, isDark, onToggleDark }: AdminTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Interactive mock notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "NT-01",
      title: "New Booking Request",
      description: "Sophia Martinez requested 'Hair Color' for today at 10:30 AM.",
      time: "5m ago",
      isRead: false,
      type: "appointment",
    },
    {
      id: "NT-02",
      title: "GCash Payment Cleared",
      description: "Reference #GCASH-TXN-9988 settled successfully for ₱2,500.",
      time: "24m ago",
      isRead: false,
      type: "payment",
    },
    {
      id: "NT-03",
      title: "Low Inventory Alert",
      description: "Salon supplies: Keratin Rebond tubes are below safety threshold.",
      time: "2h ago",
      isRead: true,
      type: "system",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasUnread = notifications.some(n => !n.isRead);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 shadow-xs dark:shadow-none transition-colors duration-200">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xs select-none cursor-pointer transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Minimal Search bar (Mock) */}
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="search"
            placeholder="Search appointments..."
            className="w-60 rounded-lg border border-gray-200 dark:border-gray-700 py-1.5 pl-9 pr-4 text-xs focus:border-gray-900 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:outline-none bg-gray-50/55 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xs select-none cursor-pointer focus:outline-none transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Alerts Bell Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xs select-none cursor-pointer focus:outline-none transition-colors"
            aria-label="Alert Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-800" />
            )}
          </button>

          {/* Dynamic Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Notifications</span>
                {hasUnread && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline select-none cursor-pointer focus:outline-none"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Dropdown List */}
              <div className="flex flex-col max-h-[280px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNotificationClick(item.id)}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors text-left w-full focus:outline-none",
                          !item.isRead && "bg-gray-50/40 dark:bg-gray-800/30"
                        )}
                      >
                        {/* Type Icon indicator */}
                        <div className={cn(
                          "h-7 w-7 rounded-md border flex items-center justify-center shrink-0 mt-0.5",
                          item.type === "appointment" && "bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900 text-indigo-500",
                          item.type === "payment" && "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900 text-emerald-500",
                          item.type === "system" && "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900 text-amber-500"
                        )}>
                          {item.type === "appointment" && <Calendar className="h-3.5 w-3.5" />}
                          {item.type === "payment" && <CreditCard className="h-3.5 w-3.5" />}
                          {item.type === "system" && <AlertTriangle className="h-3.5 w-3.5" />}
                        </div>

                        {/* Title and message */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              "text-xs font-bold text-gray-900 dark:text-gray-100 truncate",
                              !item.isRead && "font-extrabold"
                            )}>
                              {item.title}
                            </span>
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {item.time}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                            {item.description}
                          </span>
                        </div>

                        {/* Unread dot */}
                        {!item.isRead && (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-2 ml-1" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <Check className="h-6 w-6 text-gray-300 dark:text-gray-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">All caught up!</span>
                  </div>
                )}
              </div>

              {/* View All Alerts Footer */}
              <Link 
                href="/admin/appointments"
                onClick={() => setDropdownOpen(false)}
                className="text-[10px] font-bold text-gray-900 dark:text-gray-200 py-3 text-center border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors block w-full select-none cursor-pointer"
              >
                View All Booking Alerts
              </Link>

            </div>
          )}
        </div>

        {/* Quick Logout Button */}
        <Link
          href="/admin/login"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 shadow-2xs select-none cursor-pointer transition-colors"
          title="Log Out Staff"
        >
          <LogOut className="h-4.5 w-4.5 transition-colors" />
        </Link>
      </div>
    </header>
  );
}
