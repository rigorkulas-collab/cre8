"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminContent from "./AdminContent";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // On mount, restore persisted preference
  useEffect(() => {
    const stored = localStorage.getItem("cre8_admin_dark_mode");
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
    localStorage.setItem("cre8_admin_dark_mode", String(next));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Sidebar Component */}
      <AdminSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Right main pane */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        <AdminTopbar 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isDark={isDark}
          onToggleDark={toggleDark}
        />
        <AdminContent>
          {children}
        </AdminContent>
      </div>
    </div>
  );
}
