"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scissors, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const customerNavItems: NavItem[] = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Services", href: "/browse-services", icon: Scissors },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around bg-white/98 dark:bg-gray-900/98 border-t border-gray-100 dark:border-gray-800/80 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur-md select-none transition-colors duration-200">
      {customerNavItems.map((item, index) => {
        const isActive = 
          pathname === item.href || 
          (item.href !== "/dashboard" && pathname?.startsWith(item.href)) ||
          (item.href === "/browse-services" && pathname === "/booking");
        const Icon = item.icon;
        
        return (
          <Link
            key={`${item.name}-${index}`}
            href={item.href}
            className="relative flex-1 h-full flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer outline-none active:scale-95 gap-1.5"
          >
            {/* White Active Accent Indicator Line at the Top of the Nav Bar */}
            {isActive && (
              <div className="absolute top-0 w-10 h-[3px] bg-gray-900 dark:bg-white rounded-b-md animate-fade-in-quick" />
            )}

            <Icon
              className={cn(
                "h-5 w-5 transition-colors duration-200 shrink-0",
                isActive ? "text-gray-950 dark:text-white" : "text-gray-400 dark:text-gray-500"
              )}
            />
            
            <span className={cn(
              "text-[11px] font-bold tracking-wide transition-colors duration-200",
              isActive ? "text-gray-950 dark:text-white font-extrabold" : "text-gray-400 dark:text-gray-500"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
