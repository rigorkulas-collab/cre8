"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = HelpCircle,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white/50 p-8 text-center w-full">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-gray-400 mb-5 shadow-xs">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-medium text-gray-500 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionText && onActionClick && (
        <Button variant="secondary" onClick={onActionClick} size="default">
          {actionText}
        </Button>
      )}
    </div>
  );
}
