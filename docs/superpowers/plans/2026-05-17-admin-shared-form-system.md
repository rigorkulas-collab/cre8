# Step 4 — Shared Form System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-fidelity, highly reusable, and fully typed Shared Form System (`FormModal`, `FormInput`, `FormSelect`, `FormTextarea`, `FormActions`) in `components/forms/` to standardise input layout, dropdown selection, multi-line notes, error presentation, and action confirmation bars across all admin creations/modifications.

**Architecture:** Build modular, fully-typed React components leveraging the pre-established `Button`, `dialog`, and Tailwind input classes. Maintain strict TypeScript signatures and elegant focus states in accordance with our Charcoal Lux brand system.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Radix UI dialog primitives.

---

## User Review Required

> [!IMPORTANT]
> - **FormField.tsx Preservation:** We will strictly **NOT** touch, modify, or delete the existing customer-side `components/forms/FormField.tsx` dependency. All new admin-facing form components will be added as separate files under `components/forms/`.
> - **Unified Error presentation:** All input components (`FormInput`, `FormSelect`, `FormTextarea`) will support an `error?: string` prop to render error descriptions in red text underneath the fields, and highlight field borders in warning states.

## Open Questions

> [!NOTE]
> There are no remaining open questions. The requirements and design align perfectly.

---

## Proposed Changes

### [Form System Components]

- `components/forms/FormModal.tsx` [NEW]
- `components/forms/FormInput.tsx` [NEW]
- `components/forms/FormSelect.tsx` [NEW]
- `components/forms/FormTextarea.tsx` [NEW]
- `components/forms/FormActions.tsx` [NEW]

---

## Task List

### Task 1: Create FormModal Component

**Files:**
- Create: `components/forms/FormModal.tsx`

- [ ] **Step 1: Write FormModal component file**
  Create `components/forms/FormModal.tsx` using Radix Dialog wrappers to create elegant, responsive dialog boxes overlaying any custom form structure.
  ```tsx
  "use client";

  import React from "react";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";

  interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
  }

  export default function FormModal({
    isOpen,
    onClose,
    title,
    description,
    children,
  }: FormModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="pt-1.5 leading-relaxed font-medium">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="pt-2">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  ```

---

### Task 2: Create FormInput Component

**Files:**
- Create: `components/forms/FormInput.tsx`

- [ ] **Step 1: Write FormInput component file**
  Create `components/forms/FormInput.tsx` incorporating a premium text field, support for left icons, golden Champagne focus indicators, and inline validation warnings.
  ```tsx
  "use client";

  import React from "react";
  import { cn } from "@/lib/utils";

  interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ComponentType<any>;
  }

  export default function FormInput({
    label,
    error,
    icon: Icon,
    className,
    id,
    required,
    ...props
  }: FormInputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-gray-400 select-none flex items-center gap-0.5"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </span>
          )}
          <input
            id={inputId}
            required={required}
            className={cn(
              "w-full rounded-xl border py-2.5 px-4 text-sm font-medium focus:outline-none transition-all duration-200 bg-white placeholder-gray-400/70",
              Icon && "pl-10",
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/5"
                : "border-gray-200 text-gray-900 focus:border-[#D1BFA7] focus:ring-1 focus:ring-[#D1BFA7] hover:border-gray-300",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-bold text-red-600 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
  ```

---

### Task 3: Create FormSelect Component

**Files:**
- Create: `components/forms/FormSelect.tsx`

- [ ] **Step 1: Write FormSelect component file**
  Create `components/forms/FormSelect.tsx` building a styled custom category selector that aligns perfectly with our input visuals.
  ```tsx
  "use client";

  import React from "react";
  import { cn } from "@/lib/utils";
  import { ChevronDown } from "lucide-react";

  interface SelectOption {
    label: string;
    value: string | number;
  }

  interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
  }

  export default function FormSelect({
    label,
    options,
    error,
    placeholder = "Select an option",
    className,
    id,
    required,
    value,
    ...props
  }: FormSelectProps) {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={selectId}
          className="text-xs font-bold uppercase tracking-wider text-gray-400 select-none flex items-center gap-0.5"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <div className="relative">
          <select
            id={selectId}
            required={required}
            value={value}
            className={cn(
              "w-full appearance-none rounded-xl border py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none transition-all duration-200 bg-white cursor-pointer",
              !value && "text-gray-400/70",
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/5"
                : "border-gray-200 text-gray-900 focus:border-[#D1BFA7] focus:ring-1 focus:ring-[#D1BFA7] hover:border-gray-300",
              className
            )}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-900 font-medium">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        {error && (
          <span className="text-xs font-bold text-red-600 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
  ```

---

### Task 4: Create FormTextarea Component

**Files:**
- Create: `components/forms/FormTextarea.tsx`

- [ ] **Step 1: Write FormTextarea component file**
  Create `components/forms/FormTextarea.tsx` building a styled multi-line text input for descriptions or operational comments.
  ```tsx
  "use client";

  import React from "react";
  import { cn } from "@/lib/utils";

  interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
  }

  export default function FormTextarea({
    label,
    error,
    className,
    id,
    required,
    rows = 4,
    ...props
  }: FormTextareaProps) {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={textareaId}
          className="text-xs font-bold uppercase tracking-wider text-gray-400 select-none flex items-center gap-0.5"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <textarea
          id={textareaId}
          required={required}
          rows={rows}
          className={cn(
            "w-full rounded-xl border py-2.5 px-4 text-sm font-medium focus:outline-none transition-all duration-200 bg-white placeholder-gray-400/70 resize-y",
            error
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/5"
              : "border-gray-200 text-gray-900 focus:border-[#D1BFA7] focus:ring-1 focus:ring-[#D1BFA7] hover:border-gray-300",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-bold text-red-600 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
  ```

---

### Task 5: Create FormActions Component

**Files:**
- Create: `components/forms/FormActions.tsx`

- [ ] **Step 1: Write FormActions component file**
  Create `components/forms/FormActions.tsx` as a standard form actions bar footer with outline cancel button and primary submit button, complete with spinner animations during asynchronous operations.
  ```tsx
  "use client";

  import React from "react";
  import Button from "@/components/ui/Button";
  import { Loader2 } from "lucide-react";

  interface FormActionsProps {
    onCancel: () => void;
    submitText?: string;
    cancelText?: string;
    isLoading?: boolean;
    disabled?: boolean;
  }

  export default function FormActions({
    onCancel,
    submitText = "Save Changes",
    cancelText = "Cancel",
    isLoading = false,
    disabled = false,
  }: FormActionsProps) {
    return (
      <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100 animate-fade-in">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || disabled}
          size="default"
          className="rounded-xl font-bold"
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || disabled}
          size="default"
          className="rounded-xl font-bold flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0 text-white" />
              Saving...
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    );
  }
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the codebase compiles successfully and that all form elements integrate perfectly.
- Command: `npm run build`

### Manual Verification
- We will double-check that the files are properly generated in `components/forms/` and imported without TypeScript issues.
