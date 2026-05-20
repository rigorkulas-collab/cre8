"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  X,
  Search,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Services", href: "/admin/services", icon: Scissors },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Stylists", href: "/admin/stylists", icon: Clock },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out lg:translate-x-0 pt-5",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Close Bar */}
        <div className="lg:hidden flex items-center justify-end px-4 pb-2 select-none">
          <button 
            className="rounded-md p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
          {/* User Info Profile Box */}
          <div className="mx-4 mb-4 border border-gray-100 dark:border-gray-800 rounded-lg p-3 flex items-center justify-between bg-white dark:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.015)] dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 text-white font-extrabold text-sm shrink-0">
                AD
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Admin User</p>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 truncate">admin@salon.com</p>
              </div>
            </div>
            <div className="flex flex-col text-gray-400 dark:text-gray-600 shrink-0 select-none cursor-pointer leading-none text-[8px] gap-0.5">
              <span>▲</span>
              <span>▼</span>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="mx-4 relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50/50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/5 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-gray-900 dark:text-gray-100 font-medium"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold select-none transition-colors duration-150",
                    isActive 
                      ? "bg-gray-100/90 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <Icon className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
