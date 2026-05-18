"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-gray-900 leading-tight">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs font-semibold text-gray-400 mt-1 leading-normal">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Form Body Fields Content Area */}
        <div className="py-2 flex flex-col gap-4">
          {children}
        </div>

        {/* Optional Custom Modal Footer Actions */}
        {footer && (
          <DialogFooter className="mt-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
