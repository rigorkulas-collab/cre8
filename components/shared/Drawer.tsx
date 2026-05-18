"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden select-none">
      {/* Backdrop Overlay with subtle blur */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in-quick cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Body Panel */}
      <div
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-transform duration-300 ease-in-out animate-slide-in-right",
          sizeClasses[size]
        )}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 p-5 shrink-0">
          <div className="flex flex-col gap-1 pr-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-none">
              {title}
            </h3>
            {description && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer select-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-9 w-9 flex items-center justify-center shadow-xs"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body Section */}
        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-400 select-text">
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
