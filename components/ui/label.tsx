"use client";

import * as React from "react";
import * as LabelPrimitives from "@radix-ui/react-label";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitives.Root
    ref={ref}
    className={`text-sm font-semibold leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    {...props}
  />
));
Label.displayName = LabelPrimitives.Root.displayName;

export { Label };
