"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export interface FormActionsProps {
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitDisabled?: boolean;
  className?: string;
}

export default function FormActions({
  submitText = "Save Changes",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  isLoading = false,
  submitDisabled = false,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 w-full pt-4 mt-2 border-t border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <Button
        variant="secondary"
        onClick={onSubmit}
        disabled={submitDisabled || isLoading}
        type={onSubmit ? "button" : "submit"}
        className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-[0.98]"
        size="default"
      >
        {isLoading && (
          <Spinner className="w-3.5 h-3.5 border-[1.5px] border-white border-t-transparent animate-spin shrink-0" />
        )}
        {submitText}
      </Button>
      
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        type="button"
        className="w-full rounded-xl py-3.5 text-xs font-bold transition-all active:scale-[0.98]"
        size="default"
      >
        {cancelText}
      </Button>
    </div>
  );
}
