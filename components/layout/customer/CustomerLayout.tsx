"use client";

import React, { useState, useEffect } from "react";
import BottomNavigation from "./BottomNavigation";
import PageContainer from "./PageContainer";
import { Sun, Moon, ChevronLeft, Bell } from "lucide-react";
import { MobileHeaderProps } from "./MobileHeader";
import { useRouter, usePathname } from "next/navigation";

interface CustomerLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  headerProps?: MobileHeaderProps;
}

export default function CustomerLayout({
  children,
  showBottomNav = true,
  headerProps,
}: CustomerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Session Confirmed",
      description: "Your Hair Styling with Liam on May 20 at 2:00 PM is verified.",
      time: "10 mins ago",
      unread: true,
    },
    {
      id: "2",
      title: "Points Credited!",
      description: "150 loyalty points have been added to your balance.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "3",
      title: "Lux Voucher Code",
      description: "Use voucher LUX15 at salon checkout for 15% off treatments.",
      time: "1 day ago",
      unread: false,
    }
  ]);

  // Check login and path states to hide profile/notifications if logged out
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("cre8_user_role");
      const isAuth = pathname === "/login" || pathname === "/signup";
      setIsLoggedIn(!!role && !isAuth);
    }
  }, [pathname]);

  // Restore persisted customer dark mode preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("cre8_customer_dark_mode");
    const enabled = stored === "true";
    setIsDark(enabled);
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("cre8_customer_dark_mode", String(next));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const showBack = headerProps?.showBackButton;
  const handleBackClick = headerProps?.onBackClick;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-0 sm:py-8 transition-colors duration-200">
      {/* Centered Mobile Device Viewport Canvas Container */}
      <div className="w-full sm:max-w-lg h-screen sm:h-[840px] bg-white dark:bg-gray-900 flex flex-col shadow-2xl sm:rounded-3xl border border-gray-150 dark:border-gray-800 overflow-hidden relative transform translate-y-0 transition-colors duration-200">
        
        {/* Optional App Mock Status Bar (high visual fidelity) */}
        <div className="hidden sm:flex h-6 bg-white dark:bg-gray-900 shrink-0 items-center justify-between px-6 border-b border-gray-50 dark:border-gray-850 dark:border-gray-800/40 text-[10px] font-bold text-gray-400 select-none transition-colors duration-200">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Floating Minimalist Back Button at the Top Left */}
        {showBack && (
          <div className="absolute top-[32px] left-4 z-50 select-none">
            <button
              onClick={() => {
                if (handleBackClick) {
                  handleBackClick();
                } else {
                  window.history.back();
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-2xs backdrop-blur-xs select-none cursor-pointer focus:outline-none transition-colors duration-150"
              aria-label="Go Back"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}

        {/* Top Left Dark Mode Switcher (placed at left-[60px] next to the back button if present, otherwise left-4) */}
        <div className={`absolute top-[32px] z-50 select-none transition-all ${showBack ? "left-[60px]" : "left-4"}`}>
          <button
            onClick={toggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-2xs backdrop-blur-xs select-none cursor-pointer focus:outline-none transition-all active:scale-95 duration-150"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Moon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Top Right Premium Toolbar (Notification bell dropdown, Avatar) */}
        <div className="absolute top-[32px] right-4 z-50 flex items-center gap-2 select-none">
          {isLoggedIn && (
            <>
              {/* Notification Bell with Badge and Expanding Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-2xs backdrop-blur-xs select-none cursor-pointer focus:outline-none transition-all active:scale-95 duration-150"
                  aria-label="Toggle notifications"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>

                {/* Premium Notification Dropdown Dialog Panel */}
                {notifOpen && (
                  <>
                    {/* Click outside overlay backdropper */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setNotifOpen(false)} 
                    />
                    
                    <div 
                      className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl p-4 select-none z-50 flex flex-col gap-3.5 animate-fade-in-quick"
                      style={{ width: "340px", minWidth: "340px" }}
                    >
                      <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-gray-750">
                        <span className="text-sm font-black text-gray-900 dark:text-gray-100">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                            className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto scrollbar-none">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                // Mark single notification as read on click
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                              }}
                              className="flex gap-3 items-start p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
                            >
                              <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-transparent'}`} />
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-[14px] font-black text-gray-900 dark:text-gray-100 leading-snug">{n.title}</span>
                                <span className="text-[12px] font-medium text-gray-500 dark:text-gray-350 leading-relaxed">{n.description}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">{n.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No notifications</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Reusable Profile Avatar linking to standard client settings */}
              <button
                onClick={() => router.push("/profile")}
                className="h-9 w-9 rounded-full overflow-hidden shadow-2xs cursor-pointer select-none active:scale-95 transition-all bg-gray-900 dark:bg-gray-100 flex items-center justify-center"
                title="Profile settings"
              >
                <span className="text-xs font-extrabold text-white dark:text-gray-900">Z</span>
              </button>
            </>
          )}
        </div>

        {/* Scrollable Main Content Pane */}
        <PageContainer hasHeader={false} hasBottomNav={showBottomNav}>
          {children}
        </PageContainer>

        {/* Fixed touch-friendly Bottom Tab Navigation */}
        {showBottomNav && (
          <BottomNavigation />
        )}

        {/* Portal Target for Customer Modals/Drawers (Bypasses parent scrollbar and padding clipping) */}
        <div id="customer-modal-portal" className="absolute inset-0 pointer-events-none z-50" />
      </div>
    </div>
  );
}
